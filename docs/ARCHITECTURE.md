# Architecture Governance
TypeScript, typed contracts, centralized validation/error handling and explicit service boundaries are required for core flows.

## Naming
Branches: feature/<scope>, fix/<scope>, docs/<scope>, chore/<scope>.
Commits: imperative, scoped when useful; describe the actual change.
Types/components: PascalCase. Functions/variables: camelCase. Constants: UPPER_SNAKE_CASE when truly constant.
Database/schema names: stable snake_case.
Resume section identifiers must be stable machine keys, not translated labels.

## Migrations
Prefer forward-compatible migrations. Destructive changes require staged rollout, backup/restore consideration and production-like validation. Reversibility must be assessed per migration; do not claim rollback where data loss makes it false.

## API
Internal contracts are versioned through typed schemas/schema_version. If a public external API is introduced, define OpenAPI/versioning/deprecation policy before exposing it.
