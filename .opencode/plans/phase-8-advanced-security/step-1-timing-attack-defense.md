# Task Breakdown - Phase 8 (VIII): Advanced Security - Step 1: Timing Attack Defense

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit, documented with the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Phase VIII tasks may run in parallel (from common `dev` base) after Phase VII
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Defend against user-enumeration timing attacks by performing a dummy hash verification when a user is not found.

## Atomic Tasks

### `VIII-1-1` — Add timing attack defense with dummy hash
- **Description**: Precompute a valid Argon2 dummy hash at startup (from config); in the local auth `ValidateUser` use-case, always run a hash comparison — real for an existing user, dummy for a missing one — so response time is uniform for existing/non-existing users. Atomic checks: (a) dummy hash generated from config at bootstrap, (b) comparison still runs on user-not-found, (c) no password/data leak and no change to the 401 response body.
- **CLI(s)**: `None (config/code only)` — reuses the existing Argon2 hasher from `III-1-2a`/`IV-1-1a`; no CLI tool needed.
- **Package(s)**: `None` — reuses `argon2` installed in `III-1-2a` (bound in `IV-1-1a`) and `src/common/utils/password-hashing.ts`.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/crypto/dummy-hash.ts`, `src/modules/auth/crypto/dummy-hash.spec.ts`
  - **Modified**: `src/modules/auth/use-cases/validate-user.use-case.ts`, `src/config/auth.config.ts`, `.env.example`
  - **Deleted**: None
- **Branch**: `feat/auth-timing-attack-dummy-hash`
- **Commit**: `feat(auth): add timing attack defense with dummy hash`
- **Testing**: Unit test both paths invoke a verify (`vi.fn()` spy on the hasher); loose-bounds timing test that missing-user vs wrong-password durations are comparable; E2E asserts uniform 401 status/body; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VIII-1-1` → `✅ Done`
