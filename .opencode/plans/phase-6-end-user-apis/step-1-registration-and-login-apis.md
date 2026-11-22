# Task Breakdown - Phase 6 (VI): End-User APIs - Step 1: Registration & Login APIs

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format (`Description`, `CLI(s)`, `Package(s)`, `File(s)/Folder(s)`, `Branch`, `Commit`, `Testing`)
> **Execution**: Parallel stream Phase V ∥ VI ∥ VII (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Split mapping**: roadmap `VI-1-1` → `VI-1-1a` (register) + `VI-1-1b` (login), each independently committable.

## Step Summary
Expose end-user register and login APIs built on the local strategy and JWT issuance.

## Atomic Tasks

### `VI-1-1a` — Add end-user register API
- **Description**: Implement `POST /auth/register` creating a local user via the Argon2 hashing port from `III-1-2a`, with a request DTO, Swagger docs and a rate-limit hook from `II-5-3`. Atomic checks: (a) endpoint registered, (b) password hashed through the port, (c) validation/whitelist applied to the DTO, (d) duplicate email returns 409, (e) endpoint documented in Swagger.
- **CLI(s)**: `None (code only — handler and DTO added to the existing AuthController/AuthModule from Phase IV)`
- **Package(s)**: None new — reuses `@nestjs/swagger` (`I-3-4a`), `@nestjs/throttler` (`II-5-3`) and Argon2 (`III-1-2a`).
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/dto/register.dto.ts`, `src/modules/auth/use-cases/register.use-case.ts`, `src/modules/auth/use-cases/register.use-case.spec.ts`, `test/auth-register.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/auth.service.ts`, `src/modules/auth/auth.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-enduser-register-api`
- **Commit**: `feat(auth): add end-user register api`
- **Testing**: unit tests for DTO validation and register hashing via a mocked hashing port; E2E tests for register (201 + hashed password persisted, 409 on duplicate) and Swagger schema assertions. Run `npm test`, `npm run test:e2e`, `npm run test:cov`, `npm run lint`, `npm run typecheck`.

### `VI-1-1b` — Add end-user login API
- **Description**: Implement `POST /auth/login` using the local strategy from `IV-1-1a` and issuing the access/refresh token pair from `IV-1-2b`, with a request DTO, Swagger docs and rate-limit hooks from `II-5-3`. Atomic checks: (a) endpoint registered, (b) login returns the token pair, (c) validation/whitelist applied to the DTO, (d) bad credentials return 401, (e) endpoint documented in Swagger.
- **CLI(s)**: `None (code only — handler and DTO added to the existing AuthController/AuthModule from Phase IV)`
- **Package(s)**: None new — reuses `@nestjs/passport`, `@nestjs/swagger` (`I-3-4a`), `@nestjs/throttler` (`II-5-3`) and the JWT utils (`IV-1-2b`).
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/dto/login.dto.ts`, `src/modules/auth/use-cases/login.use-case.ts`, `src/modules/auth/use-cases/login.use-case.spec.ts`, `src/modules/auth/auth.controller.spec.ts`, `test/auth-login.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/auth.service.ts`, `src/modules/auth/strategies/local.strategy.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-enduser-login-api`
- **Commit**: `feat(auth): add end-user login api`
- **Testing**: unit tests for DTO validation and token issuance via a mocked token issuer; E2E tests for login (200 token pair, 401 on bad credentials) and Swagger schema assertions. Run `npm test`, `npm run test:e2e`, `npm run test:cov`, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VI-1-1a`, `VI-1-1b` → `✅ Done`
