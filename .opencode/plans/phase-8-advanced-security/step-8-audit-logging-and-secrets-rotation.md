# Task Breakdown - Phase 8 (VIII): Advanced Security - Step 8: Audit Logging & Secrets Rotation

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit, documented with the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Phase VIII tasks may run in parallel (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`/`feat(crypto)`

## Step Summary
Add security audit logging across sensitive events and a secrets rotation workflow.

## Atomic Tasks

### `VIII-8-1a` — Add security audit logging service
- **Description**: Define an audit-log port and adapter that append immutable-style structured records (actor id, IP, action, timestamp, outcome) through the built-in logger / existing `@nestjs/observe` module, with redaction so no secrets/PII are written. Atomic checks: (a) port + adapter registered in SecurityModule, (b) records carry actor/IP/timestamp/outcome, (c) password/token fields redacted, (d) enablement toggle from config.
- **CLI(s)**: `None (config/code only)` — uses the built-in logger and existing `@nestjs/observe` module; no CLI tool.
- **Package(s)**: `None` — reuses `@nestjs/common` logger and `@nestjs/observe`; no new npm package.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/security/domain/ports/audit-log.port.ts`, `src/modules/security/infrastructure/adapters/audit-log.adapter.ts`, `src/modules/security/infrastructure/adapters/audit-log.adapter.spec.ts`, `src/config/security/audit.config.ts`
  - **Modified**: `src/modules/security/security.module.ts`, `.env.example`
  - **Deleted**: `None`
- **Branch**: `feat/sec-security-audit-logging`
- **Commit**: `feat(sec): add security audit logging`
- **Testing**: Unit test records include required fields and redact sensitive data (`vi.fn()` on the logger); `npm run test:cov`, `npm run typecheck`, `npm run lint`.

### `VIII-8-1b` — Instrument sensitive security events with audit logging
- **Description**: Emit audit events from the sensitive flows using the port from `VIII-8-1a`: login success/failure, logout, token revocation, password change/reset, MFA enable/disable, admin user CRUD, and lockout/unlock. Atomic checks: (a) each listed flow calls the audit port with actor/IP/outcome, (b) failed and successful outcomes both recorded, (c) no secret/PII in emitted records.
- **CLI(s)**: `None (config/code only)` — wires the existing audit-log port; no CLI tool.
- **Package(s)**: `None`
- **File(s)/Folder(s)**:
  - **Added**: `test/audit-logging.e2e-spec.ts`, `src/modules/security/application/use-cases/audit-event.use-case.ts`, `src/modules/security/application/use-cases/audit-event.use-case.spec.ts`
  - **Modified**: `src/modules/auth/use-cases/validate-user.use-case.ts`, `src/modules/auth/auth.controller.ts`, `src/modules/auth/password-reset.service.ts`, `src/modules/auth/use-cases/revoke-user.use-case.ts`, `src/modules/security/application/use-cases/mfa-toggle.use-case.ts`, `src/modules/admin/services/admin-users.service.ts`, `src/modules/auth/use-cases/account-lockout.use-case.ts`
  - **Deleted**: None
- **Branch**: `feat/sec-audit-event-instrumentation`
- **Commit**: `feat(sec): instrument sensitive events with audit logging`
- **Testing**: Unit test each flow emits the expected event fields; E2E test asserts an audit record after a login event; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

### `VIII-8-2a` — Add secrets rotation service with versioning
- **Description**: Introduce a config-driven secret-version provider and rotation service so consumers (JWT keys, AES encryption key, API tokens) read the currently active version and can hot-swap to the next without downtime. Atomic checks: (a) versioned secret config from `.env`, (b) service exposes active/previous versions, (c) consumers resolve through the service, (d) unit test proves switching version takes effect.
- **CLI(s)**: `None (config/code only)` — reuses `@nestjs/config` wiring from earlier phases.
- **Package(s)**: `None` — reuses `@nestjs/config` and built-in `node:crypto`; no new npm package.
- **File(s)/Folder(s)**:
  - **Added**: `src/common/crypto/secret-version.provider.ts`, `src/common/crypto/secret-rotation.service.ts`, `src/common/crypto/secret-rotation.service.spec.ts`, `src/config/security/secrets.config.ts`
  - **Modified**: `src/modules/shared/infrastructure/adapters/encryption.adapter.ts`, `src/modules/shared/infrastructure/adapters/token-issuer.adapter.ts`, `.env.example`
  - **Deleted**: `None`
- **Branch**: `feat/crypto-secrets-rotation-service`
- **Commit**: `feat(crypto): add secrets rotation service with versioning`
- **Testing**: Unit test the service returns the active version and switches after rotation, and that consumers pick up the new version; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

### `VIII-8-2b` — Document and validate the secrets rotation workflow
- **Description**: Write the operational rotation procedure (env/secret versioning, stepped rollout, reload-without-downtime steps, and per-secret guidance for JWT keys, encryption keys, and API tokens) as the foundation for `IX-1-4`. Atomic checks: (a) procedure documented, (b) versioned env keys documented, (c) rollback steps included, (d) docs reviewed against the service from `VIII-8-2a`.
- **CLI(s)**: `None (config/code only)` — documentation task; no CLI tool.
- **Package(s)**: `None`
- **File(s)/Folder(s)**:
  - **Added**: `docs/security/secrets-rotation.md`, `docs/security/rotation-checklist.md`
  - **Modified**: `SECURITY.md`, `.env.example`
  - **Deleted**: `None`
- **Branch**: `feat/crypto-secrets-rotation-workflow`
- **Commit**: `feat(crypto): add secrets rotation workflow`
- **Testing**: Docs review for rotation/rollback steps; re-run the `VIII-8-2a` unit test to confirm documented version keys match the service; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VIII-8-1a`, `VIII-8-1b`, `VIII-8-2a`, `VIII-8-2b` → `✅ Done`
