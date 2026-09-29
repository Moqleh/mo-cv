# Testing Strategy
## Data
Never use real user PII in automated tests or staging fixtures. Maintain deterministic seed/fixture resumes for Arabic, English, mixed-direction, short, long and multi-page PDF cases.

## Matrix
Unit, integration, E2E, visual/PDF regression, RTL, mobile, accessibility, performance, security and cross-browser.

## Initial measurable budgets
Targets are provisional until production baselines exist:
- LCP target <= 2.5s at the 75th percentile on supported production traffic.
- CLS target <= 0.1.
- INP target <= 200ms.
- Critical save operations should expose latency/error metrics; set a numeric SLO after baseline measurement rather than inventing one.
- PDF export must never clip required content in approved fixtures.

Performance limits must be revised from measured evidence, not loosened silently.
