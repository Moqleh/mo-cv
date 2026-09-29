# MO CV Master Plan v1.0 — Frozen Reference
Date: 2026-09-29
Status: Frozen Reference
Change rule: changes require a documented change request and changelog entry.

## Objective
Ship MO CV as a production-grade Arabic/English resume platform with reliable persistence, secure authorization, verified PDF output, measurable quality, and controlled releases.

## Gate status vocabulary
- Under Construction: approved and being designed; implementation has not started.
- Under Process: implementation or verification has started; exit criteria are not yet satisfied.
- Blocked: progress cannot continue because a named dependency is unresolved.
- Locked: exit criteria are satisfied and evidence is recorded. Reopening requires a change decision.

## Definition of Ready (DoR)
A feature may enter implementation only when:
1. User/business outcome is explicit.
2. Acceptance criteria are testable.
3. Data/API impact is identified.
4. Security/privacy impact is assessed.
5. UX states are defined: empty/loading/error/success and offline/conflict where applicable.
6. Dependencies and owner are named.
7. Test approach is identified.
8. No unresolved architecture blocker exists.

## Critical path
G0 Product -> G1 Architecture/Data -> G2 Data Integrity -> G3 Security/Privacy -> G4 PDF/ATS/AI foundations -> G5 Quality -> G6 Production Platform -> G7 Observability/Ops -> G8 Release -> G9 Post-launch.

Hard dependencies:
- RLS verification depends on stable schema and authorization matrix.
- Conflict UI depends on revision semantics and save state machine.
- PDF regression depends on a frozen rendering pipeline and fixtures.
- Production release depends on tested migrations, RLS, rollback, privacy/delete, critical E2E and smoke tests.
- GA depends on Beta exit evidence and operational readiness.

## Gate control
Each Gate record MUST contain: Owner, Status, Dependencies, Exit Criteria, Evidence, Last Review.
Owner role defaults until staffing is explicit:
- Product: Product Owner
- Architecture/Data/Security/Platform: Tech Lead
- Quality/A11y: QA Owner
- Operations/Release: Release Owner
- Legal/Privacy: Legal/Privacy Owner
No Gate becomes Locked without evidence.

## Gate exit criteria
### G0 Product
Exit: MVP/out-of-scope/KPIs/personas/JTBD approved; Beta and GA scope distinguished.
Evidence: versioned product scope and acceptance criteria.

### G1 Architecture & Data
Exit: schema, schema_version, API contracts, migration policy, naming conventions and data classification approved.
Evidence: schema/migration tests and architecture docs.

### G2 Data Integrity
Exit: CLEAN/DIRTY/SAVING/SAVED/OFFLINE/CONFLICT/ERROR behavior verified; crash recovery, multi-tab and stale-write prevention tested.
Evidence: automated tests plus conflict/offline scenarios.

### G3 Security & Privacy
Exit: threat model, authorization matrix, RLS tests, auth/session controls, export/delete and retention rules verified.
Evidence: security tests and privacy checklist. Legal text requires qualified legal review before GA where applicable.

### G4 PDF / ATS / AI
Exit: Arabic/English PDF fixtures pass visual checks; ATS methodology/limits documented; AI provider/data/consent/cost/fallback rules approved.
Evidence: snapshots, evaluation results, provider configuration record.

### G5 Quality
Exit: critical E2E, RTL/mobile/cross-browser, accessibility critical paths, performance budgets and security tests pass.
Evidence: CI artifacts/reports.

### G6 Production Platform
Exit: dev/staging/prod separation, migration path, secrets, rollback, backup and restore procedure tested.
Evidence: deployment/restore drill records.

### G7 Observability & Ops
Exit: critical alerts have owner, severity and runbook; uptime/error/save/PDF/AI signals observable.
Evidence: alert tests/dashboard links/runbook references.

### G8 Release
Exit: staging release gate passes; production smoke passes; no open P0/P1; rollback path available.
Evidence: release record and post-deploy smoke evidence.

### G9 Post-launch
Exit: analytics/feedback/support/cost monitoring active; roadmap uses observed evidence.
Evidence: dashboards/support process/review record.

## Beta exit
Closed/Open Beta may proceed only with no known data-loss/security blocker, tested RLS, working save/recovery, verified critical PDF paths, privacy disclosure, monitoring, rollback and support contact.

## GA exit
GA additionally requires restore drill evidence, accessibility sign-off scope recorded, penetration/security review appropriate to risk, incident process, cost guardrails, legal/privacy review appropriate to target jurisdictions, and stable production metrics.

## Nine foundations before full implementation
1. MVP
2. Data Schema
3. Save State Machine
4. Threat Model + RLS
5. PDF Pipeline
6. CI/CD + environments + rollback
7. Observability
8. Privacy + export/delete
9. Design System + engineering conventions

## Reference documents
- RELEASE_GATES.md
- ARCHITECTURE.md
- SECURITY.md
- TESTING_STRATEGY.md
- DESIGN_SYSTEM.md
- TECH_DEBT.md
- RUNBOOKS/INCIDENTS.md

## Changelog
### v1.0 — 2026-09-29
Initial frozen execution reference. Adds DoR, dependency graph, measurable Gate exits, ownership/evidence rules, Beta/GA distinction, incident/rollout discipline, design-system foundation and technical-debt governance.
