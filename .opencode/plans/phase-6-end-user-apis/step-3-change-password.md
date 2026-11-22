# Task Breakdown - Phase 6 (VI): End-User APIs - Step 3: Change Password

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format (`Description`, `CLI(s)`, `Package(s)`, `File(s)/Folder(s)`, `Branch`, `Commit`, `Testing`)
> **Execution**: Parallel stream Phase V ∥ VI ∥ VII; sequential within phase
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Add an authenticated change-password API.

## Atomic Tasks

### `VI-3-1` — Add change password api
- **Description**: Implement `POST /auth/change-password` for authenticated users: verify the current password through the Argon2 hashing port from `III-1-2a`, set the new password hash, and revoke existing refresh sessions via `IV-2-4`. Atomic checks: (a) endpoint guarded by JWT auth, (b) wrong current password rejected, (c) new password hashed via port, (d) sessions revoked.
- **CLI(s)**: `None (code only — handler and DTO added to the existing AuthController)`
- **Package(s)**: None new — reuses the Argon2 hashing port (`III-1-2a`) and multi-level revocation (`IV-2-4`).
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/dto/change-password.dto.ts`, `test/auth-change-password.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/auth.service.ts`, `src/modules/user/domain/repositories/user.repository.port.ts`, `src/modules/user/infrastructure/repositories/typeorm-user-info.repository.ts`
  - **Deleted**: None
- **Branch**: `feat/auth-change-password-api`
- **Commit**: `feat(auth): add change password api`
- **Testing**: Unit test that a wrong current password is rejected and the new hash is persisted via a mocked repository; E2E test authenticated change, old password no longer works and refresh session revoked. Run `npm test`, `npm run test:e2e`, `npm run test:cov`, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VI-3-1` → `✅ Done`
