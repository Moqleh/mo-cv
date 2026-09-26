# MO CV — Production Roadmap

## Implemented foundation
- Approved responsive landing UI
- Versioned Resume V1 domain
- Resume repository abstraction (browser persistence in current MVP)
- Dashboard CRUD
- Resume Builder
- Live preview + autosave
- Five visual template modes
- Arabic/English document direction
- Browser print/PDF path
- CI typecheck/build gate

## Production gates still required
1. Replace browser repository with authenticated server repository + database.
2. Authentication, authorization and account deletion.
3. Complete Resume V1 sections, ordering, revisions, conflict/outbox strategy and migrations.
4. Dedicated PDF renderer and Preview/PDF parity tests.
5. Server-side AI enhancement API with rate limiting, preview/apply/regenerate and graceful outage.
6. Full /ar and /en routing/i18n, legal pages and SEO.
7. Unit/integration/E2E/security/performance testing.
8. Production deployment, secrets, monitoring, backups and domain.

No feature is labelled LIVE until its real service is connected and verified.
