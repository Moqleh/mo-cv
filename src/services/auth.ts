import{createClient,type AuthChangeEvent,type SupabaseClient}from'@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL as string|undefined;
const key=import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined;
const client:SupabaseClient|null=url&&key?createClient(url,key):null;
const baseUrl=()=>import.meta.env.PROD?'https://moqleh.github.io/mo-cv/':new URL(import.meta.env.BASE_URL,location.origin).href;
const recoveryUrl=()=>{const u=new URL(baseUrl());u.searchParams.set('recovery','1');return u.href};
const DEV='mocv.dev.user';const allowLocal=import.meta.env.DEV;
export const supabase=client;
export const auth={
 isCloudConfigured:()=>!!client,
 async signUp(email:string,password:string,name:string){
  if(client){const{data,error}=await client.auth.signUp({email,password,options:{data:{name},emailRedirectTo:baseUrl()}});if(error)throw error;return{signedIn:!!data.session,needsEmailConfirmation:!data.session}}
  if(!allowLocal)throw new Error('خدمة تسجيل الدخول غير متاحة حالياً');
  localStorage.setItem(DEV,JSON.stringify({id:'local-user',email,name}));
  return{signedIn:true,needsEmailConfirmation:false}
 },
 async signIn(email:string,password:string){
  if(client){const{error}=await client.auth.signInWithPassword({email,password});if(error)throw error;return}
  if(!allowLocal)throw new Error('خدمة تسجيل الدخول غير متاحة حالياً');
  if(password.length<8)throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  localStorage.setItem(DEV,JSON.stringify({id:'local-user',email,name:email.split('@')[0]}))
 },
 async forgotPassword(email:string){
  if(!client)throw new Error('استعادة كلمة المرور تتطلب إعداد Supabase');
  const{error}=await client.auth.resetPasswordForEmail(email,{redirectTo:recoveryUrl()});
  if(error)throw error
 },
 onAuthStateChange(callback:(signedIn:boolean,event?:AuthChangeEvent)=>void){
  if(!client)return()=>{};
  const{data}=client.auth.onAuthStateChange((event,session)=>callback(!!session?.user,event));
  return()=>data.subscription.unsubscribe()
 },
 async session(){if(client){const{data}=await client.auth.getSession();return data.session}return allowLocal?this.user():null},
 async updatePassword(password:string){
  if(!client)throw new Error('تحديث كلمة المرور يتطلب إعداد Supabase');
  if(password.length<8)throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  const{error}=await client.auth.updateUser({password});
  if(error)throw error
 },
 async deleteAccount(){if(!client)throw new Error('حذف الحساب يتطلب إعداد Supabase');const{error}=await client.functions.invoke('delete-account',{method:'POST'});if(error)throw error;await client.auth.signOut()},
 async signOut(){if(client)await client.auth.signOut();localStorage.removeItem(DEV)},
 async user(){if(client){const{data}=await client.auth.getUser();return data.user}if(!allowLocal)return null;try{return JSON.parse(localStorage.getItem(DEV)||'null')}catch{return null}}
};