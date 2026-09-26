# Production readiness checklist

MO CV is production-ready only when every item below is verified against the deployed environment.

- [x] TypeScript/build/test/coverage gates run in CI.
- [x] GitHub Pages deployment is gated by verification and coverage.
- [x] Resume schema validates IDs, URLs, dates, text and section order.
- [x] Local revisions are bounded; cloud revisions and optimistic concurrency are implemented.
- [x] Dashboard and Builder have cloud persistence adapters and auth guards.
- [x] AI calls are authenticated and the provider secret stays server-side.
- [x] A4 print/PDF layout has RTL/LTR-compatible browser rendering and pagination guards.
- [ ] Supabase project URL/anon key configured in production build.
- [ ] Database migrations applied to the production Supabase project.
- [ ] Supabase auth redirect/email settings verified on the deployed domain.
- [ ] AI Edge Function deployed with AI_API_KEY, AI_API_URL and AI_MODEL secrets.
- [ ] Full live E2E verified: signup -> dashboard -> create -> edit -> autosave -> logout -> login -> restore -> PDF.
- [ ] AI-disabled E2E verified so core resume creation/export never depends on AI.

Never describe unchecked items as live or verified.
