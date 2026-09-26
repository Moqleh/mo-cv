import{describe,it,expect}from'vitest';import{emptyResume}from'./resume';import{parseResume}from'./schema';import{migrateResume}from'./migrations';import{createId,isId}from'./id';
describe('Resume V1',()=>{
it('creates exact secure domain IDs',()=>{const ids=Array.from({length:50},()=>createId());expect(ids.every(isId)).toBe(true);expect(new Set(ids).size).toBe(ids.length)});
it('accepts valid Arabic and English resumes',()=>{expect(parseResume(emptyResume('ar')).locale).toBe('ar');expect(parseResume(emptyResume('en')).locale).toBe('en')});
it('rejects invalid section permutations',()=>{const r=emptyResume();r.sectionOrder=['summary','summary','education','skills','languages','certifications','projects','courses'];expect(()=>parseResume(r)).toThrow()});
it('rejects malformed IDs',()=>{const r=emptyResume();r.id='not-valid';expect(()=>parseResume(r)).toThrow()});
it('rejects javascript URLs',()=>{const r=emptyResume();r.personal.website='javascript:alert(1)';expect(()=>parseResume(r)).toThrow()});
it('allows angle brackets as plain text',()=>{const r=emptyResume();r.summary='<developer>';expect(parseResume(r).summary).toBe('<developer>')});
it('rejects control characters',()=>{const r=emptyResume();r.summary='ok\u0000bad';expect(()=>parseResume(r)).toThrow()});
it('rejects invalid experience range',()=>{const r=emptyResume();r.experience=[{id:createId(),role:'x',company:'y',location:'',start:'2026-12',end:'2026-01',current:false,description:''}];expect(()=>parseResume(r)).toThrow()});
it('accepts current experience without end date',()=>{const r=emptyResume();r.experience=[{id:createId(),role:'x',company:'y',location:'',start:'2026-01',end:'',current:true,description:''}];expect(parseResume(r).experience[0].current).toBe(true)});
it('v1 migration validates',()=>expect(migrateResume(emptyResume()).schemaVersion).toBe(1));
it('rejects future schema',()=>expect(()=>migrateResume({...emptyResume(),schemaVersion:2})).toThrow())
});