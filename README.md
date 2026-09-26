# MO CV

Arabic-first, bilingual professional resume builder.

## Current architecture
- React + TypeScript + Vite
- Versioned Resume V1 domain with Zod validation and migrations
- Responsive approved landing design
- Authentication adapter (Supabase when configured)
- PostgreSQL/Supabase migration with Row Level Security
- Dashboard and resume CRUD
- Builder, autosave, live preview and five template modes
- AI client boundary that fails gracefully when the server service is not configured
- CI: typecheck → tests → production build

## Local development
```bash
npm install
npm run verify
npm run dev
```

Copy `.env.example` to `.env` and configure only the services you actually use.

## Production configuration still required
A GitHub repository cannot itself provide the production database, authentication service, AI provider, transactional email, hosting/domain or server-side PDF infrastructure. Configure those external services before describing those capabilities as live.

For Supabase, apply `supabase/migrations/001_initial.sql` and set the public URL/anon key. RLS is mandatory.

## Security
Never commit service-role keys, AI keys, passwords or other secrets. Browser variables prefixed with `VITE_` are public by definition.

## Status
The repository is the source of truth. A feature is not called production/live until its real external service is connected and verified.
