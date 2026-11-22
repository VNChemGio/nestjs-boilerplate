# Task Breakdown - Phase 8 (VIII): Advanced Security - Step 7: Account Lockout & Self-Unlock

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit, documented with the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Phase VIII tasks may run in parallel (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Note**: Temporary/permanent lockout hardening is also in `IX-1-8`; these tasks establish the consecutive-failure lockout + identity-verified self-unlock.
> **Split mapping**: roadmap `VIII-7-1` → `VIII-7-1a` (failed-attempt lockout) + `VIII-7-1b` (OTP-gated self-unlock), each independently committable.

## Step Summary
Lock accounts after consecutive failed login attempts and let users self-unlock via identity verification (OTP endpoints from `VIII-5-1b`).

## Atomic Tasks

### `VIII-7-1a` — Add consecutive-failed-attempt account lockout
- **Description**: Track failed-login counters in the Keyv cache with TTL, lock the account after a configured threshold/duration, and reject logins while locked with a generic response. Atomic checks: (a) failure counter increment + reset on success, (b) lock threshold + duration from config, (c) locked login rejected without revealing lock state.
- **CLI(s)**: `None (config/code only)` — reuses `@nestjs/cache-manager` from `II-2-1`.
- **Package(s)**: `None` — reuses `@nestjs/cache-manager` from `II-2-1`; no new npm package.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/use-cases/account-lockout.use-case.ts`, `src/modules/auth/infrastructure/adapters/lockout-store.adapter.ts`, `src/modules/auth/infrastructure/adapters/lockout-store.adapter.spec.ts`, `src/config/security/lockout.config.ts`, `test/account-lockout.e2e-spec.ts`
  - **Modified**: `src/modules/auth/use-cases/validate-user.use-case.ts` (increment/reject), `.env.example`
  - **Deleted**: `None`
- **Branch**: `feat/auth-account-lockout`
- **Commit**: `feat(auth): add account lockout on consecutive failed attempts`
- **Testing**: Unit test lock after N failures and counter reset on success with a `vi.fn()` cache; E2E test locked account rejected with a generic 401; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

### `VIII-7-1b` — Add OTP-gated self-unlock flow
- **Description**: Provide an authenticated-by-identity self-unlock endpoint that consumes an OTP from `VIII-5-1b`, resets the failure counter and restores login, reusing the lockout use-case from `VIII-7-1a`. Atomic checks: (a) valid OTP unlocks, (b) invalid/expired OTP rejected, (c) counter reset after unlock, (d) login works again.
- **CLI(s)**: `None (config/code only)` — reuses the OTP service from `VIII-5-1a`/`VIII-5-1b` and the lockout use-case from `VIII-7-1a`.
- **Package(s)**: `None`
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/use-cases/self-unlock.use-case.ts`, `test/self-unlock.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts` (unlock endpoint), `src/modules/security/interfaces/otp.controller.ts`, `src/modules/auth/use-cases/account-lockout.use-case.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-self-unlock-otp`
- **Commit**: `feat(auth): add user self-unlock via identity verification`
- **Testing**: Unit test unlock via valid OTP with a `vi.fn()` cache and rejection of invalid OTP; E2E test locked account rejected then unlock restores login; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VIII-7-1a`, `VIII-7-1b` → `✅ Done`
