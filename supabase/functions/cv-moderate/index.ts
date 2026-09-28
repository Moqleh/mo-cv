import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import{createClient}from'https://esm.sh/@supabase/supabase-js@2.117.2';
const json=(body:unknown,status=200,cors:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
async function hashText(s:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const cosine=(a:number[],b:number[])=>{let dot=0,aa=0,bb=0;for(let i=0;i<Math.min(a.length,b.length);i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i]}return aa&&bb?dot/(Math.sqrt(aa)*Math.sqrt(bb)):0};
const semanticRefs=[
 {category:'threat',severity:'severe',text:'I am going to seriously hurt or kill you and make you suffer.'},
 {category:'hate_or_degrading',severity:'severe',text:'People from this race, religion, or protected group are inferior and should be harmed or removed.'},
 {category:'harassment',severity:'standard',text:'You are a disgusting worthless idiot and I am insulting and humiliating you.'},
 {category:'obscene_abuse',severity:'standard',text:'This is vulgar obscene sexual profanity used to abuse or insult another person.'}
] as const;
let semanticRefVectors:Promise<{category:string,severity:'standard'|'severe',v:number[]}[]>|null=null;
async function builtInSemanticVerdict(text:string){
 const latin=(text.match(/[A-Za-z]/g)||[]).length,total=(text.match(/[A-Za-z\u0600-\u06FF]/g)||[]).length;
 if(latin<30||latin/Math.max(total,1)<.55)return null;
 const session=new Supabase.ai.Session('gte-small');
 semanticRefVectors??=Promise.all(semanticRefs.map(async r=>({category:r.category,severity:r.severity,v:await session.run(r.text,{mean_pool:true,normalize:true}) as number[]})));
 const refs=await semanticRefVectors;
 const chunks=text.split(/\n+|---/).map(x=>x.trim()).filter(Boolean).slice(0,24);
 let best:{score:number,category:string,severity:'standard'|'severe'}|null=null;
 for(const chunk of chunks){const v=await session.run(chunk.slice(0,1600),{mean_pool:true,normalize:true}) as number[];for(const r of refs){const score=cosine(v,r.v);if(!best||score>best.score)best={score,category:r.category,severity:r.severity}}}
 if(best&&best.score>=.86)return best;
 return null;
}
Deno.serve(async req=>{
 const started=Date.now();const log=(outcome:string,extra:Record<string,unknown>={})=>console.log(JSON.stringify({service:'cv-moderate',outcome,duration_ms:Date.now()-started,...extra}));
 const cors={'Access-Control-Allow-Origin':Deno.env.get('APP_ORIGIN')||'https://moqleh.github.io','Access-Control-Allow-Headers':'authorization, content-type, apikey','Access-Control-Allow-Methods':'POST, OPTIONS'};
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});if(req.method!=='POST')return json({error:'method_not_allowed'},405,cors);
 try{
  const auth=req.headers.get('Authorization');if(!auth)return json({error:'unauthorized'},401,cors);
  const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});const{data:{user}}=await userClient.auth.getUser();if(!user)return json({error:'unauthorized'},401,cors);
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const since=new Date(Date.now()-30*86400000).toISOString();
  const{data:recent,error:recentError}=await admin.from('content_moderation_events').select('severity').eq('user_id',user.id).gte('created_at',since);
  if(recentError)return json({allowed:false,error:'moderation_unavailable'},503,cors);
  const strikes=recent?.length||0;const alreadySuspended=strikes>=3||Boolean(recent?.some((x:any)=>x.severity==='severe'));
  if(alreadySuspended)return json({allowed:false,suspended:true,strikes30d:strikes,categories:['account_suspended'],reason:'Export is suspended pending review.'},200,cors);
  const body=await req.json();const fields=Array.isArray(body?.fields)?body.fields:[];
  if(!fields.length||fields.length>100)return json({error:'invalid_input'},400,cors);
  const normalized=fields.map((x:any)=>({path:String(x?.path||'').slice(0,120),text:String(x?.text||'').slice(0,6000)})).filter((x:any)=>x.text.trim());
  const joined=normalized.map((x:any)=>x.path+'\n'+x.text).join('\n---\n').slice(0,30000);
  if(!joined.trim())return json({allowed:true,categories:[],reason:'empty'},200,cors);
  const normalizedText=joined.normalize('NFKC').toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,'');
  const compactText=normalizedText.replace(/[\s._*~\-–—]+/g,'');
  const deterministicRules:[RegExp,string,string][]=[
   [/(?:fuck|fucking|motherfucker|bitch|cunt|asshole|shithead|كس[ّ ]?امك|كسمك|شرموط|شرموطة|قحبة|عاهرة|خول|منيك|انيك|نيكك|يلعن\s*(?:ابوك|أبوك|امك|أمك))/iu,'profanity','standard'],
   [/(?:nigger|kike|faggot|chink|خنزير\s*(?:يهودي|مسلم|مسيحي)|اقتل\s+(?:كل|جميع)|kill\s+all\s+)/iu,'hate_or_degrading','severe'],
   [/(?:i\s*(?:will|'ll)\s+kill\s+you|i\s*(?:will|'ll)\s+hurt\s+you|سوف\s+اقتلك|سأقتلك|راح\s+اقتلك|بقتلك)/iu,'threat','severe']
  ];
  const obfuscatedProfanity=['fuck','motherfucker','asshole','كسمك','كسامك','شرموط','شرموطة','قحبة','عاهرة','منيك'];
  const obfuscatedHit=obfuscatedProfanity.some(term=>compactText.includes(term));
  const deterministic=deterministicRules.find(([rule])=>rule.test(normalizedText))||(obfuscatedHit?[/.*/u,'profanity','standard'] as [RegExp,string,string]:undefined);
  if(deterministic){
   const severity=deterministic[2]==='severe'?'severe':'standard',categories=[deterministic[1]],h=await hashText(joined),nextStrikes=strikes+1,suspended=severity==='severe'||nextStrikes>=3;
   const{error:insertError}=await admin.from('content_moderation_events').insert({user_id:user.id,severity,categories,action:suspended?'suspended':'blocked',content_hash:h});
   if(insertError)return json({allowed:false,error:'moderation_record_failed'},503,cors);
   log(suspended?'suspended':'blocked',{mode:'deterministic',severity,strikes30d:nextStrikes});return json({allowed:false,severity,categories,reason:'Content is not suitable for a professional resume.',strikes30d:nextStrikes,suspended},200,cors);
  }
  const key=Deno.env.get('AI_API_KEY'),aiUrl=Deno.env.get('AI_API_URL'),model=Deno.env.get('AI_MODEL');
  if(!key||!aiUrl||!model){
   try{
    const semantic=await builtInSemanticVerdict(joined);
    if(semantic){
     const h=await hashText(joined),nextStrikes=strikes+1,suspended=semantic.severity==='severe'||nextStrikes>=3;
     const{error:insertError}=await admin.from('content_moderation_events').insert({user_id:user.id,severity:semantic.severity,categories:[semantic.category],action:suspended?'suspended':'blocked',content_hash:h});
     if(insertError)return json({allowed:false,error:'moderation_record_failed'},503,cors);
     log(suspended?'suspended':'blocked',{mode:'builtin_semantic',severity:semantic.severity,strikes30d:nextStrikes});
     return json({allowed:false,severity:semantic.severity,categories:[semantic.category],reason:'Content is not suitable for a professional resume.',strikes30d:nextStrikes,suspended,mode:'builtin_semantic'},200,cors);
    }
   }catch(e){log('builtin_semantic_unavailable',{error:e instanceof Error?e.name:'unknown'})}
   log('allowed',{mode:'deterministic_plus_builtin_semantic'});return json({allowed:true,categories:[],reason:'ok',mode:'deterministic_plus_builtin_semantic'},200,cors);
  }
  const system='You are a strict professional-resume content moderation gate. Analyze Arabic and English text. Return JSON only: {"allowed":boolean,"severity":"none"|"standard"|"severe","categories":string[],"reason":string}. Block direct profanity, obscene/vulgar sexual wording, insults/harassment, hateful or degrading slurs, threats, malicious content, or clearly abusive/unprofessional text. Do not block ordinary names, legitimate professional terms, URLs, locations, qualifications, or neutral descriptions. Severe means credible threats, hateful/degrading attacks, or extreme targeted abuse. Do not rewrite or repeat offensive text in reason.';
  const upstream=await fetch(aiUrl,{method:'POST',signal:AbortSignal.timeout(6000),headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'system',content:system},{role:'user',content:joined}],temperature:0,response_format:{type:'json_object'}})});
  if(!upstream.ok){log('provider_error',{status:upstream.status});return json({allowed:false,error:'moderation_unavailable'},503,cors);}
  const data=await upstream.json();const raw=data?.choices?.[0]?.message?.content;if(typeof raw!=='string')return json({allowed:false,error:'moderation_unavailable'},503,cors);
  let verdict:any;try{verdict=JSON.parse(raw)}catch(e){log('internal_error',{error:e instanceof Error?e.name:'unknown'});return json({allowed:false,error:'moderation_unavailable'},503,cors)}
  if(verdict.allowed===true){log('allowed');return json({allowed:true,categories:[],reason:'ok'},200,cors);}
  const severity=verdict.severity==='severe'?'severe':'standard';const categories=Array.isArray(verdict.categories)?verdict.categories.map(String).slice(0,10):['unprofessional'];const h=await hashText(joined);
  const nextStrikes=strikes+1;const suspended=severity==='severe'||nextStrikes>=3;
  const{error:insertError}=await admin.from('content_moderation_events').insert({user_id:user.id,severity,categories,action:suspended?'suspended':'blocked',content_hash:h});
  if(insertError)return json({allowed:false,error:'moderation_record_failed'},503,cors);
  log(suspended?'suspended':'blocked',{severity,strikes30d:nextStrikes});return json({allowed:false,severity,categories,reason:'Content is not suitable for a professional resume.',strikes30d:nextStrikes,suspended},200,cors);
 }catch{return json({allowed:false,error:'moderation_unavailable'},503,cors)}
});