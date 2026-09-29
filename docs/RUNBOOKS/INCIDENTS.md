# Incident Runbook
1. Classify P0/P1/P2/P3.
2. Identify affected environment, feature and user impact.
3. For P0/P1: stop rollout; activate rollback/kill switch where safer than continued operation.
4. Preserve logs/evidence without exposing PII.
5. Mitigate, verify, then communicate when user action or material impact requires it.
6. Record root cause, timeline, corrective action and prevention.

Every production-critical alert must link to an owner and runbook. P0/P1 incidents require a post-incident review.
