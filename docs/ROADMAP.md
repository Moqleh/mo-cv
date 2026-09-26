# MO CV — Production Roadmap

## Implemented in the repository
- Approved responsive landing UI and five visual template modes.
- Versioned Resume V1 schema, normalization, migrations, bounded local revisions and cloud revision migrations.
- Dashboard CRUD, Resume Builder, live preview, autosave, section ordering and ATS checks.
- Local persistence fallback plus authenticated Supabase repository adapter with optimistic concurrency.
- Supabase authentication flows, authorization/RLS migrations and self-service account deletion.
- Server-side AI Edge Function implementation with authentication, rate limiting and graceful client fallback.
- Arabic/English resume direction, legal pages, SEO assets and GitHub Pages-safe PWA paths.
- A4 browser print/PDF path with RTL/LTR-compatible styles.
- CI typecheck, unit tests, coverage, build, security audit, Pages deployment and post-deploy smoke tests.

## Remaining production verification / product gates
1. Connect the production Supabase project and configure the public project URL/anon key in the deployment environment.
2. Apply all database migrations to that production project and verify RLS/account deletion against real users.
3. Configure Supabase auth redirect/email settings for the deployed domain.
4. Deploy the AI Edge Function and configure its provider secrets; verify authenticated success, quota and outage paths live.
5. Run a real browser E2E against production: signup -> dashboard -> create -> edit -> autosave -> logout -> login -> restore -> PDF.
6. Complete full landing/editor English copy and stable language routing if dedicated /ar and /en URLs remain a release requirement.
7. Add dedicated PDF renderer/parity tests if exact server-generated PDF output remains a release requirement.
8. Configure production monitoring/backups and the final custom domain if those are part of launch scope.

No unchecked external service is described as LIVE until it is connected and verified.
