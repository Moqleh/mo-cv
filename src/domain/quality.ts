import type{ResumeV1}from'./resume';

export interface ResumeQualityResult{ok:boolean;issues:string[]}
export interface ResumeTextField{path:string;text:string}

const profanity=[
  /\b(?:fuck(?:er|ing)?|shit(?:ty)?|bitch|asshole|motherfucker|cunt)\b/iu,
  /(?:كس\s*امك|كسمك|شرموط(?:ة)?|قحبة|منيوك|طيز)/iu
];
const directAbuse=[
  /\b(?:you are|you're)\s+(?:an?\s+)?(?:idiot|stupid|moron|loser)\b/iu,
  /(?:انت|أنت)\s+(?:غبي|حقير|حمار|تافه)/iu
];
const gibberish=/(.)\1{7,}/u;

export function resumeTextFields(r:ResumeV1):ResumeTextField[]{
  return[
    ['title',r.title],['personal.fullName',r.personal.fullName],['personal.jobTitle',r.personal.jobTitle],
    ['personal.email',r.personal.email],['personal.phone',r.personal.phone],['personal.location',r.personal.location],
    ['personal.website',r.personal.website],['personal.linkedin',r.personal.linkedin],['summary',r.summary],
    ...r.experience.flatMap((x,i)=>[['experience.'+i+'.role',x.role],['experience.'+i+'.company',x.company],['experience.'+i+'.location',x.location],['experience.'+i+'.description',x.description]]),
    ...r.education.flatMap((x,i)=>[['education.'+i+'.degree',x.degree],['education.'+i+'.field',x.field],['education.'+i+'.school',x.school],['education.'+i+'.location',x.location],['education.'+i+'.description',x.description]]),
    ...r.skills.map((x,i)=>['skills.'+i,x]),...r.languages.flatMap((x,i)=>[['languages.'+i+'.name',x.name],['languages.'+i+'.level',x.level]]),
    ...r.certifications.flatMap((x,i)=>[['certifications.'+i+'.name',x.name],['certifications.'+i+'.issuer',x.issuer],['certifications.'+i+'.url',x.url]]),
    ...r.projects.flatMap((x,i)=>[['projects.'+i+'.name',x.name],['projects.'+i+'.role',x.role],['projects.'+i+'.description',x.description],['projects.'+i+'.url',x.url]]),
    ...r.courses.flatMap((x,i)=>[['courses.'+i+'.name',x.name],['courses.'+i+'.provider',x.provider]])
  ].map(([path,text])=>({path,text})).filter(x=>x.text.trim());
}

export function validateProfessionalContent(r:ResumeV1,locale:'ar'|'en'=r.locale):ResumeQualityResult{
  const tr=(ar:string,en:string)=>locale==='ar'?ar:en;
  const issues:string[]=[];
  const fields=resumeTextFields(r);
  if(!r.personal.fullName.trim())issues.push(tr('أدخل الاسم الكامل قبل التصدير','Enter the full name before export'));
  if(!r.personal.jobTitle.trim())issues.push(tr('أدخل المسمى المهني قبل التصدير','Enter the professional title before export'));
  if(r.personal.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.personal.email))issues.push(tr('صحح البريد الإلكتروني قبل التصدير','Correct the email address before export'));
  const safeUrl=(v:string)=>!v.trim()||/^https:\/\/[^\s]+$/i.test(v.trim());
  if(!safeUrl(r.personal.website)||!safeUrl(r.personal.linkedin)||r.certifications.some(x=>!safeUrl(x.url))||r.projects.some(x=>!safeUrl(x.url)))issues.push(tr('استخدم روابط آمنة وصحيحة تبدأ بـ https://','Use valid secure links beginning with https://'));
  if(r.personal.phone&&r.personal.phone.replace(/[^0-9]/g,'').length<7)issues.push(tr('راجع رقم الهاتف قبل التصدير','Review the phone number before export'));
  if(r.summary.trim()&&r.summary.trim().length<40)issues.push(tr('الملخص المهني قصير جداً؛ أضف قيمة مهنية واضحة قبل التصدير','The professional summary is too short; add clear professional value before export'));
  if(r.experience.some(x=>x.start&&x.end&&!x.current&&x.end<x.start)||r.education.some(x=>x.start&&x.end&&x.end<x.start))issues.push(tr('راجع التواريخ: تاريخ النهاية لا يمكن أن يسبق تاريخ البداية','Review dates: an end date cannot be before its start date'));
  if(fields.some(({text})=>profanity.some(rx=>rx.test(text))))issues.push(tr('احذف الألفاظ البذيئة أو الفاحشة قبل إنشاء السيرة النهائية','Remove profane or obscene language before creating the final resume'));
  if(fields.some(({text})=>directAbuse.some(rx=>rx.test(text))))issues.push(tr('احذف الإهانات أو الإساءة الشخصية قبل إنشاء السيرة النهائية','Remove insults or personal abuse before creating the final resume'));
  if(fields.some(({text})=>gibberish.test(text)))issues.push(tr('راجع النصوص العبثية أو الأحرف المكررة بشكل غير طبيعي','Review gibberish or unusually repeated characters'));
  return{ok:issues.length===0,issues:[...new Set(issues)]};
}
