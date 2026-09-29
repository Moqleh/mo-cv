# Release Gates
## Rollout
Default: internal verification -> Closed Beta -> Open Beta -> GA.
Risky features use feature flags where practical. AI, PDF pipeline changes, auth-sensitive behavior and experimental features require a documented rollback/disable path.

## Kill switches
Critical externally dependent features should fail closed or degrade safely. AI and export/moderation dependencies must not silently fabricate success.

## Severity
- P0: active data loss, broad security compromise, or service-wide critical failure. Stop release; immediate response.
- P1: critical user journey unavailable or serious security/privacy defect. Stop release until resolved or explicitly mitigated.
- P2: significant degraded functionality with workaround. Release decision requires owner review.
- P3: minor/non-critical defect. May be scheduled with documented debt.

## Release evidence
Record commit SHA, environment, migration version, test results, unresolved P2/P3 issues, smoke result, rollback target, approver and timestamp.
