import{z}from'zod';
const safeText=(max:number)=>z.string().max(max).refine(v=>!/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(v),'Control characters are not allowed');
const id=z.string().min(1).max(64);const ym=z.string().regex(/^$|^\d{4}-(0[1-9]|1[0-2])$/);const url=z.string().refine(v=>!v||(()=>{try{return new URL(v).protocol==='https:'}catch{return false}})(),'Only HTTPS URLs are allowed');
const personal=z.object({fullName:safeText(120),jobTitle:safeText(120),email:z.string().max(254).refine(v=>!v||z.string().email().safeParse(v).success),phone:safeText(40),location:safeText(120),website:url});
const experience=z.object({id,role:safeText(120),company:safeText(120),start:ym,end:ym,current:z.boolean(),description:safeText(4000)}).refine(x=>x.current||!x.start||!x.end||x.start<=x.end,'Invalid date range');
const education=z.object({id,degree:safeText(160),school:safeText(160),start:ym,end:ym}).refine(x=>!x.start||!x.end||x.start<=x.end,'Invalid date range');
export const ResumeSchemaV1=z.object({schemaVersion:z.literal(1),id,title:safeText(120),locale:z.enum(['ar','en']),template:z.enum(['classic','professional','modern','creative','elegant']),updatedAt:z.string().datetime(),personal,summary:safeText(5000),experience:z.array(experience).max(50),education:z.array(education).max(30),skills:z.array(safeText(80)).max(100),languages:z.array(safeText(80)).max(30)}).strict();
export function parseResume(input:unknown){return ResumeSchemaV1.parse(input)}
