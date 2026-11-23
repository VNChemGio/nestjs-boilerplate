# Task Breakdown - Phase 8 (VIII): Advanced Security - Step 5: OTP

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit, documented with the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Phase VIII tasks may run in parallel (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Split mapping**: roadmap `VIII-5-1` → `VIII-5-1a` (OTP port/adapter + config) + `VIII-5-1b` (request/verify use-cases, controller, template and E2E), each independently committable.

## Step Summary
Add one-time password (OTP) delivery via email (and reusable OTP service for magic link/identity verification).

## Atomic Tasks

### `VIII-5-1a` — Add OTP port, adapter and config
- **Description**: Implement the reusable OTP port with an adapter that generates short-lived numeric codes, stores only their hashes in the Keyv cache through the cache port, and enforces attempt limits, driven by typed config (DIP). Atomic checks: (a) OTP generation + TTL from config, (b) only hash stored in cache, (c) attempt/rate limit enforced.
- **CLI(s)**: `None (config/code only)` — reuses `@nestjs/cache-manager` (`II-2-1`) and built-in `node:crypto.randomInt`.
- **Package(s)**: `None` — reuses `@nestjs/cache-manager` and `node:crypto` already present from earlier phases.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/security/domain/ports/otp.port.ts`, `src/modules/security/infrastructure/adapters/otp.adapter.ts`, `src/modules/security/infrastructure/adapters/otp.adapter.spec.ts`, `src/config/security/otp.config.ts`
  - **Modified**: `src/modules/security/security.module.ts`, `.env.example`
  - **Deleted**: `None`
- **Branch**: `feat/security-otp-port-adapter`
- **Commit**: `feat(security): add otp port and adapter`
- **Testing**: Unit test OTP expiry, attempt limit and hash-only storage with fake timers (`vi.useFakeTimers()`); coverage thresholds, `npm run typecheck`, `npm run lint`.

### `VIII-5-1b` — Add OTP request/verify use-cases and endpoints
- **Description**: Add request/verify use-cases and endpoints that deliver OTPs through the async BullMQ mail provider with a template, consumed single-use for identity verification in `VIII-7-1b`. Atomic checks: (a) email delivered via queue + template, (b) verify consumes the code (single-use), (c) request/verify endpoints wired.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — reuses the BullMQ mail provider (`II-3-1`), the OTP port from `VIII-5-1a` and `node:crypto`.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/security/application/use-cases/request-otp.use-case.ts`, `src/modules/security/application/use-cases/verify-otp.use-case.ts`, `src/modules/security/interfaces/otp.controller.ts`, `src/modules/mail/templates/otp.hbs`, `test/otp.e2e-spec.ts`
  - **Modified**: `src/modules/security/security.module.ts`
  - **Deleted**: None
- **Branch**: `feat/security-otp-request-verify`
- **Commit**: `feat(security): add otp request and verify endpoints`
- **Testing**: E2E test request → verify with mocked mail queue and replay rejection; full unit + E2E suites, coverage thresholds, `npm run typecheck`, `npm run lint`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VIII-5-1a`, `VIII-5-1b` → `✅ Done`
