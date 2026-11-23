# Task Breakdown - Phase 6 (VI): End-User APIs - Step 2: Password Recovery

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format (`Description`, `CLI(s)`, `Package(s)`, `File(s)/Folder(s)`, `Branch`, `Commit`, `Testing`)
> **Execution**: Parallel stream Phase V ∥ VI ∥ VII; sequential within phase
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Add forgot/reset password APIs using the async mail provider (BullMQ) and Handlebars templates.

## Atomic Tasks

### `VI-2-1a` — Add forgot password request API
- **Description**: Implement `POST /auth/forgot-password`: look up the user by email with a uniform response (no account enumeration), generate a signed, short-lived single-use reset token, persist its hash/expiry, render the password-reset template from `II-4-1` and enqueue a mail job through the `mail` queue producer from `II-3-1`; all side effects go through ports so the use-case stays transport-agnostic (DIP). Atomic checks: (a) endpoint exists, (b) signed expiring token stored, (c) reset email enqueued with rendered template, (d) identical response for existing and unknown emails, (e) rate-limited.
- **CLI(s)**: `npx nest g service modules/auth/password-reset --flat`
- **Package(s)**: None new — reuses built-in `node:crypto`, the JWT/crypto util from `IV-1-2`, `@nestjs/bullmq` (`II-2-2`/`II-3-1`) and i18n templates (`II-4-1`).
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/password-reset.service.ts`, `src/modules/auth/password-reset.service.spec.ts`, `src/modules/auth/dto/forgot-password.dto.ts`, `test/auth-forgot-password.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/auth.module.ts`, `src/config/auth.config.ts`, `.env.example`
  - **Deleted**: None
- **Branch**: `feat/auth-forgot-password-request-api`
- **Commit**: `feat(auth): add forgot password request api`
- **Testing**: Unit tests for signed token generation with expiry and mail-producer enqueue via a mocked queue; E2E test with mocked mail queue asserting the same 202 response for known/unknown emails and exactly one enqueued job. Run `npm test`, `npm run test:e2e`, `npm run test:cov`, `npm run lint`, `npm run typecheck`.

### `VI-2-1b` — Add reset password handler
- **Description**: Implement `POST /auth/reset-password`: validate the signed reset token from `VI-2-1a` (signature + expiry + single-use consumption), set the new password through the Argon2 hashing port from `III-1-2a`, invalidate the token and revoke existing refresh sessions from `IV-2-4`. Atomic checks: (a) endpoint exists, (b) invalid/expired tokens rejected, (c) new password hashed via port, (d) token consumed so replay fails, (e) sessions revoked.
- **CLI(s)**: `None (code only — handler and DTO added to the existing AuthController)`
- **Package(s)**: None new — reuses the Argon2 hashing port (`III-1-2a`) and multi-level revocation (`IV-2-4`).
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/dto/reset-password.dto.ts`, `test/auth-reset-password.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/password-reset.service.ts`, `src/modules/user/domain/repositories/user.repository.port.ts`, `src/modules/user/infrastructure/repositories/typeorm-user-info.repository.ts`
  - **Deleted**: None
- **Branch**: `feat/auth-reset-password-handler`
- **Commit**: `feat(auth): add reset password handler`
- **Testing**: Unit tests for token validation/consumption (replay rejected) and password update via a mocked repository; E2E test full forgot→reset flow with mocked mail queue and replay returning 400/401. Run `npm test`, `npm run test:e2e`, `npm run test:cov`, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VI-2-1a`, `VI-2-1b` → `✅ Done`
