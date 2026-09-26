import{beforeEach,describe,expect,it,vi}from'vitest';

describe('AI service graceful fallback',()=>{
  beforeEach(()=>{vi.resetModules();vi.unstubAllEnvs();vi.restoreAllMocks()});
  it('rejects empty text without a network call',async()=>{
    vi.stubEnv('VITE_AI_ENDPOINT','https://example.test/ai');
    const fetchSpy=vi.spyOn(globalThis,'fetch');
    const{enhanceText}=await import('./ai');
    const result=await enhanceText('summary','   ');
    expect(result.ok).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('keeps core editing usable when AI is not configured',async()=>{
    vi.stubEnv('VITE_AI_ENDPOINT','');
    const{enhanceText}=await import('./ai');
    const result=await enhanceText('summary','Experienced engineer');
    expect(result.ok).toBe(false);
    expect(result.error).toContain('غير مفعلة');
  });
});
