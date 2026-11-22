# Task Breakdown - Phase 8 (VIII): Advanced Security - Step 2: Weak Password Check

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit, documented with the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Phase VIII tasks may run in parallel (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Split mapping**: roadmap `VIII-2-1` → `VIII-2-1a` (password-policy port + breach-list adapter) + `VIII-2-1b` (enforcement across all password-setting flows), each independently committable.

## Step Summary
Reject weak/breached passwords at registration and password-change using a breach list (e.g., HIBP k-anonymity).

## Atomic Tasks

### `VIII-2-1a` — Add password policy port and breach-list adapter
- **Description**: Add a password-policy port with a breach-list adapter (HIBP k-anonymity API via Node built-in `fetch`, with a local-list fallback), register it in `SecurityModule`, and drive it from typed config. Atomic checks: (a) policy port + adapter registered in SecurityModule, (b) breach check returns a clear validation error on a known-breached password, (c) no plaintext password leaves the process.
- **CLI(s)**: `None (config/code only)` — uses Node built-in `fetch`/`node:crypto` and existing `@nestjs/config` wiring.
- **Package(s)**: `None` — reuses `@nestjs/config` from earlier phases and built-in `fetch`; no new npm package required.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/security/security.module.ts`, `src/modules/security/domain/ports/password-policy.port.ts`, `src/modules/security/infrastructure/adapters/breach-list-password-policy.adapter.ts`, `src/modules/security/infrastructure/adapters/breach-list-password-policy.adapter.spec.ts`, `src/config/security/weak-password.config.ts`
  - **Modified**: `.env.example`
  - **Deleted**: None
- **Branch**: `feat/security-password-policy-port`
- **Commit**: `feat(security): add password policy port and breach-list adapter`
- **Testing**: Unit test known-breached password rejected and strong password accepted (mock `fetch` with `vi.fn()`); coverage thresholds, `npm run typecheck`, `npm run lint`.

### `VIII-2-1b` — Enforce weak password check in all password flows
- **Description**: Wire the policy port from `VIII-2-1a` into registration (`VI-1-1a`), reset (`VI-2-1b`), change (`VI-3-1`) and admin user creation (`III-2-1b`). Atomic checks: (a) integrated into all password-setting flows, (b) breached password returns a clear validation error, (c) no plaintext password leaves the process.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — reuses the port/adapter from `VIII-2-1a`.
- **File(s)/Folder(s)**:
  - **Added**: `test/weak-password.e2e-spec.ts`
  - **Modified**: `src/modules/auth/use-cases/register.use-case.ts`, `src/modules/auth/password-reset.service.ts`, `src/modules/auth/auth.service.ts`, `src/modules/admin/services/admin-users.service.ts`, `src/modules/security/security.module.ts`
  - **Deleted**: None
- **Branch**: `feat/security-weak-password-flow-integration`
- **Commit**: `feat(security): enforce weak password check in all password flows`
- **Testing**: E2E test register/reset with breached password returns 400; full unit + E2E suites, coverage thresholds, `npm run typecheck`, `npm run lint`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VIII-2-1a`, `VIII-2-1b` → `✅ Done`
