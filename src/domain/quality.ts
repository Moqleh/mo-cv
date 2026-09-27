import type{ResumeV1}from'./resume';

export interface ResumeQualityResult{ok:boolean;issues:string[]}

const blocked=[
  /\b(?:fuck|shit|bitch|asshole|motherfucker)\b/iu,
  /(?:كس\s*امك|كسمك|شرموط|شرموطة|قحبة|منيوك|زب\b|طيز)/iu
];
const gibberish=/(.)\1{7,}/u;

export function validateProfessionalContent(r:ResumeV1,locale:'ar'|'en'=r.locale):ResumeQualityResult{
  const tr=(ar:string,en:string)=>locale==='ar'?ar:en;
  const issues:string[]=[];
  const values=[
    r.personal.fullName,r.personal.jobTitle,r.personal.location,r.summary,
    ...r.experience.flatMap(x=>[x.role,x.company,x.location,x.description]),
    ...r.education.flatMap(x=>[x.degree,x.field,x.school,x.location,x.description]),
    ...r.skills,...r.languages.flatMap(x=>[x.name,x.level]),
    ...r.certifications.flatMap(x=>[x.name,x.issuer]),
    ...r.projects.flatMap(x=>[x.name,x.role,x.description]),
    ...r.courses.flatMap(x=>[x.name,x.provider])
  ].filter(Boolean);
  if(!r.personal.fullName.trim())issues.push(tr('أدخل الاسم الكامل قبل التصدير','Enter the full name before export'));
  if(r.personal.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.personal.email))issues.push(tr('صحح البريد الإلكتروني قبل التصدير','Correct the email address before export'));
  if(values.some(v=>blocked.some(rx=>rx.test(v))))issues.push(tr('احذف الألفاظ غير المناسبة قبل إنشاء السيرة النهائية','Remove inappropriate language before creating the final resume'));
  if(values.some(v=>gibberish.test(v)))issues.push(tr('راجع النصوص العبثية أو الأحرف المكررة بشكل غير طبيعي','Review gibberish or unusually repeated characters'));
  return{ok:issues.length===0,issues};
}
