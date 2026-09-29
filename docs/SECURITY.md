# Security & Privacy Governance
Threat model and authorization matrix precede final RLS approval. Frontend checks are not authorization.

## Residency and jurisdiction
Do not hard-code a legal conclusion before deployment facts are known. Record the actual Supabase region, AI provider processing locations, target markets and cross-border transfer mechanism before GA. Then map applicable requirements (for example GDPR/UK GDPR, Saudi PDPL, CCPA/CPRA where applicable) with qualified legal review.

## AI provider decision record
Before GA record: provider(s), purpose, fields sent, prohibited fields, retention/training terms, region, outage fallback, per-user quota, monthly cost ceiling, timeout and kill switch.
Never send secrets, authentication credentials, or unrelated user data to an AI provider.

## Penetration/security review
Scope and timing are risk-based. At minimum, security review covers auth, RLS/IDOR, injection/XSS, file handling, secrets, rate limits and sensitive serverless functions before GA.
