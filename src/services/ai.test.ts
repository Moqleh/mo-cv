import{beforeEach,describe,expect,it,vi}from'vitest';

describe('AI service',()=>{
  beforeEach(()=>{vi.resetModules();vi.unstubAllEnvs();vi.restoreAllMocks()});
  it('rejects empty text without a network call',async()=>{
    vi.stubEnv('VITE_AI_ENDPOINT','https://example.test/ai');
    const fetchSpy=vi.spyOn(globalThis,'fetch');
    const{enhanceText}=await import('./ai');
    expect((await enhanceText('summary','   ')).ok).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('keeps editing usable when AI is not configured',async()=>{
    vi.stubEnv('VITE_AI_ENDPOINT','');
    const{enhanceText}=await import('./ai');
    const result=await enhanceText('summary','Experienced engineer');
    expect(result.ok).toBe(false);expect(result.error).toContain('غير مفعلة');
  });
  it('returns provider text on a successful request',async()=>{
    vi.stubEnv('VITE_AI_ENDPOINT','https://example.test/ai');
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({text:'Improved text'})}));
    const{enhanceText}=await import('./ai');
    expect(await enhanceText('summary','Original')).toEqual({ok:true,text:'Improved text'});
  });
  it('handles HTTP, malformed JSON payloads and network failures gracefully',async()=>{
    vi.stubEnv('VITE_AI_ENDPOINT','https://example.test/ai');
    vi.stubGlobal('fetch',vi.fn().mockResolvedValueOnce({ok:false}).mockResolvedValueOnce({ok:true,json:async()=>({noText:true})}).mockRejectedValueOnce(new Error('offline')));
    const{enhanceText}=await import('./ai');
    expect((await enhanceText('summary','one')).ok).toBe(false);
    expect((await enhanceText('summary','two')).error).toContain('استجابة');
    expect((await enhanceText('summary','three')).error).toContain('الاتصال');
  });
});
