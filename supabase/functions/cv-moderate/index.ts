import{createClient}from'https://esm.sh/@supabase/supabase-js@2.45.4';
const json=(body:unknown,status=200,cors:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
async function hashText(s:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
Deno.serve(async req=>{\n const started=Date.now();const log=(outcome:string,extra:Record<string,unknown>={})=>console.log(JSON.stringify({service:'cv-moderate',outcome,duration_ms:Date.now()-started,...extra}));
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
  const key=Deno.env.get('AI_API_KEY'),aiUrl=Deno.env.get('AI_API_URL'),model=Deno.env.get('AI_MODEL');
  if(!key||!aiUrl||!model){log('not_configured');return json({allowed:false,error:'semantic_moderation_not_configured'},503,cors);}
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