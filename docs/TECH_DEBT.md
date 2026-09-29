# Technical Debt Register
Every intentional temporary compromise must record: ID, decision, reason, risk, owner, review date, closure condition and status.

| ID | Decision | Risk | Owner | Review | Closure condition | Status |
|---|---|---|---|---|---|---|
| TD-001 | Client print dialog is current PDF path | Cross-browser/PDF consistency | Tech Lead | Before GA | Rendering decision validated against Arabic/English fixtures | Under Process |
| TD-002 | Full offline sync queue is not yet complete | Offline edits may need stronger recovery semantics | Tech Lead | Before Beta exit | Indexed persistence + retry/conflict tests pass | Under Construction |
