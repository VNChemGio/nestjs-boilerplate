# Task Breakdown - Phase 8 (VIII): Advanced Security - Step 3: MFA / 2FA

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit, documented with the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Phase VIII tasks may run in parallel (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Add TOTP-based MFA with encrypted secrets and recovery codes.

## Atomic Tasks

### `VIII-3-1a` — Add MFA / 2FA: TOTP enrollment and enable/disable
- **Description**: Build TOTP enrollment: generate a per-user secret, expose an `otpauth://` URI and QR code, and enable/disable the `mfaEnabled` flag on the user after a successful confirmation code. Atomic checks: (a) `POST /auth/mfa/enroll` returns secret + otpauth URI/QR, (b) `POST /auth/mfa/enable` validates a first TOTP code before flipping the flag, (c) `POST /auth/mfa/disable` requires re-auth, (d) secret is handed to the `EncryptionService` port (wired in `VIII-3-2a`).
- **CLI(s)**: `npm install otplib qrcode`
- **Package(s)**: installed with `npm install otplib qrcode` (TOTP generation/verification + QR rendering).
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/security/infrastructure/adapters/totp.adapter.ts`, `src/modules/security/application/use-cases/mfa-enroll.use-case.ts`, `src/modules/security/application/use-cases/mfa-toggle.use-case.ts`, `src/modules/security/interfaces/mfa.controller.ts`, `src/config/security/mfa.config.ts`, `src/modules/security/infrastructure/adapters/totp.adapter.spec.ts`
  - **Modified**: `src/modules/user/domain/entities/user.entity.ts` (`mfaEnabled`/secret fields), `src/modules/security/security.module.ts`, `src/app.module.ts`, `.env.example`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/security-mfa-2fa`
- **Commit**: `feat(security): add mfa totp enrollment and toggle`
- **Testing**: Unit test secret generation, otpauth URI shape, QR payload, and enable only on a valid first code; E2E test enroll → enable → disable; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

### `VIII-3-1b` — Add MFA / 2FA: TOTP login verify challenge
- **Description**: When MFA is enabled, normal login returns a short-lived partial-login token instead of the access/refresh pair; `POST /auth/mfa/verify` accepts a TOTP code (or a recovery code from `VIII-3-2b`) and exchanges the partial token for the standard token pair. Atomic checks: (a) login issues a scoped partial token when `mfaEnabled`, (b) verify accepts a valid TOTP within the configured window, (c) invalid/replayed code rejected, (d) full token pair issued only after success.
- **CLI(s)**: `None (config/code only)` — reuses `otplib` installed in `VIII-3-1a` and the existing JWT/token-issuer port.
- **Package(s)**: `None` — reuses `otplib` from `VIII-3-1a` and `src/common/utils/jwt.ts`.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/security/application/use-cases/verify-mfa-challenge.use-case.ts`, `src/modules/security/application/use-cases/verify-mfa-challenge.use-case.spec.ts`, `test/mfa-login.e2e-spec.ts`
  - **Modified**: `src/modules/auth/use-cases/login.use-case.ts`, `src/modules/auth/use-cases/validate-user.use-case.ts`, `src/modules/security/interfaces/mfa.controller.ts`, `src/config/security/mfa.config.ts`, `src/modules/shared/domain/ports/token-issuer.port.ts`
  - **Deleted**: None
- **Branch**: `feat/security-mfa-verify-challenge`
- **Commit**: `feat(security): add MFA login TOTP verify challenge`
- **Testing**: Unit test valid/invalid TOTP window and replay rejection using `vi.setSystemTime()`; E2E test MFA login challenge → verify issues tokens; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

### `VIII-3-2a` — Encrypt TOTP secrets at rest
- **Description**: Persist TOTP secrets as AES-256-GCM ciphertext using the existing `EncryptionService` port/adapter (`src/common/utils/encryption.ts`, hardened later in `IX-1-6`) and decrypt on read for verification. Atomic checks: (a) stored secret is ciphertext, never plaintext, (b) decrypt yields the original secret for `otplib` verify, (c) tampered ciphertext throws, (d) encryption key sourced from config/env.
- **CLI(s)**: `None (config/code only)` — reuses the AES-256-GCM util and `EncryptionService` port from `I-1-2`.
- **Package(s)**: `None` — reuses built-in `node:crypto`; no new npm package.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/security/infrastructure/adapters/encrypted-totp-secret.adapter.ts`, `src/modules/security/infrastructure/adapters/encrypted-totp-secret.adapter.spec.ts`
  - **Modified**: `src/modules/security/application/use-cases/mfa-enroll.use-case.ts`, `src/modules/security/application/use-cases/verify-mfa-challenge.use-case.ts`, `src/config/security/mfa.config.ts`, `.env.example`
  - **Deleted**: None
- **Branch**: `feat/security-totp-secret-encryption`
- **Commit**: `feat(security): add totp secrets encryption`
- **Testing**: Unit test stored value is ciphertext and round-trips correctly; tampered payload throws; E2E verify still works with an encrypted secret; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

### `VIII-3-2b` — Add TOTP recovery codes
- **Description**: Generate a set of single-use recovery codes on enrollment, store only salted hashes, display them once, and allow redeeming one in place of a TOTP code during the MFA challenge. Atomic checks: (a) N codes generated via `node:crypto`, (b) only hashes persisted, (c) a code works once then fails, (d) redemption reissues the full token pair.
- **CLI(s)**: `None (config/code only)` — uses built-in `node:crypto` (`randomBytes`, `createHash`); no CLI tool.
- **Package(s)**: `None`
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/security/application/use-cases/generate-recovery-codes.use-case.ts`, `src/modules/security/application/use-cases/redeem-recovery-code.use-case.ts`, `src/modules/security/infrastructure/adapters/recovery-code-hasher.adapter.ts`, `src/modules/security/infrastructure/adapters/recovery-code-hasher.adapter.spec.ts`, `test/recovery-codes.e2e-spec.ts`
  - **Modified**: `src/modules/user/domain/entities/user.entity.ts` (recovery-code hash list), `src/modules/security/application/use-cases/mfa-enroll.use-case.ts`, `src/modules/security/application/use-cases/verify-mfa-challenge.use-case.ts`, `src/config/security/mfa.config.ts`, `.env.example`
  - **Deleted**: `None`
- **Branch**: `feat/security-totp-recovery-codes`
- **Commit**: `feat(security): add TOTP recovery codes`
- **Testing**: Unit test codes hashed at rest, single-use consumption, and rejection of unknown codes; E2E test a recovery code completes MFA then replay fails; `npm run test:cov`, `npm run typecheck`, `npm run lint`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VIII-3-1a`, `VIII-3-1b`, `VIII-3-2a`, `VIII-3-2b` → `✅ Done`
