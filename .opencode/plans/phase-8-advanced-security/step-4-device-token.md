# Task Breakdown - Phase 8 (VIII): Advanced Security - Step 4: Device Token

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit, documented with the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Phase VIII tasks may run in parallel (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Split mapping**: roadmap `VIII-4-1` → `VIII-4-1a` (device token port/adapter + session field) + `VIII-4-1b` (token claim, guard validation and device controller), each independently committable.

## Step Summary
Add device-bound tokens to support multi-level device revocation (`IV-2-4`).

## Atomic Tasks

### `VIII-4-1a` — Add device token port, adapter and session field
- **Description**: Introduce a device-token port/adapter backed by the shared id-generator port and persist the device identifier with refresh sessions. Atomic checks: (a) port + adapter conform, (b) device id persisted on the refresh session.
- **CLI(s)**: `None (config/code only)` — reuses the shared id-generator port (`src/modules/shared/domain/ports/id-generator.port.ts`).
- **Package(s)**: `None` — reuses `node:crypto` randomUUID via the shared adapter; no new npm package.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/domain/ports/device-token.port.ts`, `src/modules/auth/infrastructure/adapters/device-token.adapter.ts`, `src/modules/auth/infrastructure/adapters/device-token.adapter.spec.ts`
  - **Modified**: `src/modules/auth/domain/entities/refresh-session.entity.ts`
  - **Deleted**: None
- **Branch**: `feat/security-device-token-port-adapter`
- **Commit**: `feat(security): add device token port and adapter`
- **Testing**: Unit test device id generation through the shared id-generator port; coverage thresholds, `npm run typecheck`, `npm run lint`.

### `VIII-4-1b` — Embed, validate and expose device tokens
- **Description**: Embed the device id as a `did` claim in issued tokens, validate it in the JWT strategy, and expose device registration/listing/revocation through a controller. Atomic checks: (a) token carries the `did` claim, (b) guard rejects tokens for revoked/unknown devices, (c) revoke-by-device blocks only that device's tokens.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — reuses the device-token port from `VIII-4-1a` and the JWT token issuer.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/interfaces/device.controller.ts`, `test/device-token.e2e-spec.ts`
  - **Modified**: `src/common/utils/jwt.ts`, `src/modules/auth/use-cases/refresh-token.use-case.ts`, `src/modules/auth/strategies/jwt.strategy.ts`, `src/modules/auth/auth.module.ts`, `src/modules/shared/domain/ports/token-issuer.port.ts`
  - **Deleted**: None
- **Branch**: `feat/security-device-token-claims-guard`
- **Commit**: `feat(security): embed and validate device tokens`
- **Testing**: Unit test device claim validation and revoke-by-device; E2E test revoked device tokens rejected while other devices remain valid; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VIII-4-1a`, `VIII-4-1b` → `✅ Done`
