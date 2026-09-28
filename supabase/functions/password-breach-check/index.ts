const cors={'Access-Control-Allow-Origin':Deno.env.get('APP_ORIGIN')||'https://moqleh.github.io','Access-Control-Allow-Headers':'authorization, content-type, apikey','Access-Control-Allow-Methods':'POST, OPTIONS'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return json({error:'method_not_allowed'},405);
 try{
  const body=await req.json();const sha1=String(body?.sha1||'').toUpperCase();
  if(!/^[A-F0-9]{40}$/.test(sha1))return json({error:'invalid_input'},400);
  const prefix=sha1.slice(0,5),suffix=sha1.slice(5);
  const upstream=await fetch('https://api.pwnedpasswords.com/range/'+prefix,{headers:{'Add-Padding':'true','User-Agent':'MO-CV-password-check'},signal:AbortSignal.timeout(5000)});
  if(!upstream.ok)return json({error:'breach_check_unavailable'},503);
  const text=await upstream.text();
  let count=0;
  for(const line of text.split(/\r?\n/)){const [s,c]=line.split(':');if(s===suffix){count=Number(c)||1;break}}
  return json({pwned:count>0,count:count>0?count:0});
 }catch{return json({error:'breach_check_unavailable'},503)}
});