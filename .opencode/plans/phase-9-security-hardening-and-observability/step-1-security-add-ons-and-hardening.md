# Task Breakdown - Phase 9 (IX): Security Hardening & Observability - Step 1: Security Add-ons & Hardening

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; each atomic task uses the 7-field format (Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing)
> **Execution**: Strict sequential Phase VIII → IX (tasks within step may run in parallel from common base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Note**: Unified Table skips `IX-1-3` (no such task). Field encryption (`IX-1-6a`/`IX-1-6b`) should be evaluated before implementing per Decision Log #6.

## Step Summary
Harden rate limiting, circuit breaking, key rotation, idempotency, field-level encryption, dual rate limits, and temporary/permanent lockout. Bundled deliverables (idempotency, field encryption) are split into independently committable atomic tasks.

## Atomic Tasks

### `IX-1-1` — Add sliding window rate limiting
- **Description**: Upgrade the basic throttler (`II-5-3`) to a sliding-window strategy using the shared Redis/memory store for accurate per-window enforcement. Atomic checks: (a) sliding-window store registered, (b) limits read from split config exported `as Provider()`, (c) falls back to memory when Redis unavailable, (d) existing throttler decorators keep working.
- **CLI(s)**: `npm test`, `npm run test:e2e`, `npm run lint` (no new CLI tooling; extends installed throttler)
- **Package(s)**: `None` — built on `@nestjs/throttler` installed in `II-5-3` and the existing Redis/cache client from `II-2-1`.
- **File(s)/Folder(s)**:
  - **Added**: `src/common/middleware/sliding-window.throttler.storage.ts`, `src/common/middleware/sliding-window.throttler.storage.spec.ts`
  - **Modified**: `src/config/throttler.config.ts`, `src/config/index.ts`, `src/app.module.ts`
  - **Deleted**: None
- **Branch**: `feat/security-sliding-window-rate-limiting`
- **Commit**: `feat(security): add sliding window rate limiting`
- **Testing**: Unit test boundary behavior at window edges with `vi.fn()` store spies; E2E test HTTP 429 after limit; `npm run lint`, `npm run typecheck`, coverage thresholds.

### `IX-1-2` — Add circuit breaker for third-party calls
- **Description**: Harden the resilience basic config (`II-5-5`) into a real circuit breaker wrapping outbound HTTP calls (OAuth providers, breach-list checks) with fallback behavior and metrics hooks; the breaker wraps the outbound port so providers/policies depend on the abstraction, not the circuit-breaker implementation (DIP/OCP). Atomic checks: (a) breaker wraps outbound calls via first-party package, (b) closed/open/half-open transitions, (c) configurable fallback response, (d) state changes emitted for metrics/alerts.
- **CLI(s)**: `npm install @nestjs/resilience`, `npm test`, `npm run test:e2e`
- **Package(s)**: installed with `npm install @nestjs/resilience` (prefer this first-party package over a custom implementation).
- **File(s)/Folder(s)**:
  - **Added**: `src/common/resilience/circuit-breaker.service.ts`, `src/common/resilience/circuit-breaker.service.spec.ts`
  - **Modified**: `src/config/resilience.config.ts`, `src/config/index.ts`, `src/app.module.ts`, `src/modules/auth/oauth/strategies/google.strategy.ts`, `src/modules/auth/oauth/strategies/microsoft.strategy.ts`, `src/modules/auth/oauth/strategies/github.strategy.ts`, `src/modules/auth/oauth/strategies/apple.strategy.ts`, `src/modules/auth/oauth/strategies/x.strategy.ts`, `src/modules/security/infrastructure/adapters/breach-list-password-policy.adapter.ts`, `package.json`, `package-lock.json`
  - **Deleted**: None
- **Branch**: `feat/resilience-circuit-breaker-third-party`
- **Commit**: `feat(resilience): add circuit breaker for third party calls`
- **Testing**: Unit test state transitions against a flaky `vi.fn()` dependency; E2E test fallback response when breaker is open; coverage + lint + typecheck.

### `IX-1-4` — Add AES-256-GCM key rotation
- **Description**: Add `kid`-based JWT/encryption key rotation — a shared key-ring abstraction covering RS256 keys from `IV-1-2` and AES-256-GCM keys: support multiple active keys, sign/encrypt with the current key, verify/decrypt with any known `kid`, and retire old keys per the rotation workflow. Atomic checks: (a) key ring keyed by `kid`, (b) sign/verify across ids, (c) rotation config, (d) retired keys rejected.
- **CLI(s)**: `openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out keys/jwt-<kid>.pem` (generate/rotate keys), `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — uses Node's built-in `node:crypto`; no new npm package.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/key-rotation.config.ts`, `src/common/utils/key-ring.ts`, `src/common/utils/key-ring.spec.ts` (rotated key files are generated locally and git-ignored, so they are not committed paths)
  - **Modified**: `src/config/jwt.config.ts`, `src/common/utils/jwt.ts`, `src/config/index.ts`, `.gitignore`
  - **Deleted**: None
- **Branch**: `feat/crypto-aes-256-gcm-key-rotation`
- **Commit**: `feat(crypto): add aes-256-gcm key rotation`
- **Testing**: Unit test tokens signed with an old `kid` still verify until retired, then fail; rotation retires as configured; E2E verify across keys; coverage + lint + typecheck.

### `IX-1-5a` — Add idempotency package and config
- **Description**: Confirm the first-party `@nestjs/idempotency` package from `II-5-4` and extend its basic setup into split, typed config exported `as Provider()` — store backend, default TTL, and key header name — so critical-write protection can be enabled without restart-specific code changes. Atomic checks: (a) package present, (b) config file exported as provider, (c) store/TTL configurable, (d) wired into `AppModule`.
- **CLI(s)**: `npm install @nestjs/idempotency`, `npm run lint`
- **Package(s)**: installed with `npm install @nestjs/idempotency` (first-party, preferred over a hand-rolled store).
- **File(s)/Folder(s)**:
  - **Added**: None
  - **Modified**: `src/config/idempotency.config.ts`, `src/config/index.ts`, `src/app.module.ts`, `package.json`, `package-lock.json`
  - **Deleted**: None
- **Branch**: `feat/common-idempotency-package-config`
- **Commit**: `feat(common): add idempotency package and config`
- **Testing**: Unit test config defaults/overrides; `npm run lint`, `npm run typecheck`; verify module boots with config injected.

### `IX-1-5b` — Add idempotency key middleware for critical writes
- **Description**: Build on `IX-1-5a` with a middleware/interceptor that requires an idempotency key header on critical write endpoints (register, password reset, payment-style writes), returns cached responses for repeats, enforces TTL, and emits 409 for in-progress conflicts. Atomic checks: (a) header key required on critical routes, (b) cached replay, (c) TTL expiry, (d) 409 on in-progress.
- **CLI(s)**: `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — consumes `@nestjs/idempotency` installed in `IX-1-5a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/common/middleware/idempotency.interceptor.ts`, `src/common/middleware/idempotency.interceptor.spec.ts`, `src/common/decorators/idempotent.decorator.ts`
  - **Modified**: `src/app.module.ts`, `src/modules/auth/auth.controller.ts`, `src/modules/auth/use-cases/register.use-case.ts`, `src/modules/auth/password-reset.service.ts`, `src/modules/admin/controllers/admin-users.controller.ts`
  - **Deleted**: None
- **Branch**: `feat/common-idempotency-key-middleware`
- **Commit**: `feat(common): add idempotency key middleware for critical writes`
- **Testing**: Unit test replay returns cached result and TTL/conflict handling with `vi.fn()` store; E2E test repeat key creates no duplicate side-effect and 409 on concurrent replay; coverage + lint + typecheck.

### `IX-1-6a` — Add AES-256-GCM crypto util and encryption port
- **Description**: *(Evaluate first per Decision Log #6.)* Implement the reusable AES-256-GCM encryption utility behind the DDD crypto port — authenticated encryption storing IV + auth tag + ciphertext — reusing the key-ring abstraction from `IX-1-4`. Atomic checks: (a) crypto port/adapter, (b) authenticated encryption, (c) configurable key via `kid`, (d) tamper detection throws; searchable-field caveat documented.
- **CLI(s)**: `npm test`, `npm run typecheck`
- **Package(s)**: `None` — uses Node's built-in `node:crypto` and the existing crypto port/key ring.
- **File(s)/Folder(s)**:
  - **Added**: `src/common/crypto/aes-256-gcm.adapter.ts`, `src/common/crypto/aes-256-gcm.adapter.spec.ts`, `src/common/crypto/crypto.port.ts`, `src/common/crypto/index.ts`
  - **Modified**: `src/common/utils/encryption.ts`
  - **Deleted**: None
- **Branch**: `feat/crypto-aes-256-gcm-util-port`
- **Commit**: `feat(crypto): add aes-256-gcm crypto util and port`
- **Testing**: Unit test encrypt→decrypt round-trip, tampered ciphertext/auth tag rejection, and `kid` selection with `vi.fn()`; coverage + lint + typecheck.

### `IX-1-6b` — Add TypeORM encrypted field transformer
- **Description**: Consume the crypto port from `IX-1-6a` in a reusable TypeORM column transformer that encrypts sensitive fields (TOTP secrets, PII) at rest and decrypts on read, storing IV + auth tag + ciphertext. Atomic checks: (a) transformer adapter, (b) transparent encrypt/decrypt in entity columns, (c) configurable key, (d) searchable-field caveat documented.
- **CLI(s)**: `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — built on `@nestjs/typeorm` installed in `II-1-1`.
- **File(s)/Folder(s)**:
  - **Added**: `src/common/db/encrypted-column.transformer.ts`, `src/common/db/encrypted-column.transformer.spec.ts`, `src/common/db/index.ts`, `docs/field-encryption-caveats.md`
  - **Modified**: `src/modules/user/domain/entities/user.entity.ts`
  - **Deleted**: None
- **Branch**: `feat/db-aes-256-gcm-field-encryption`
- **Commit**: `feat(db): add aes-256-gcm field level encryption at rest`
- **Testing**: Unit test transformer round-trip and tamper detection; E2E test persisted DB value is ciphertext (not plaintext); coverage + lint + typecheck.

### `IX-1-7` — Add dual rate limit (per IP + per account)
- **Description**: Layer account-based rate limiting on top of the IP-based sliding window (`IX-1-1`) for auth endpoints, keyed by user/email; both limits are evaluated independently and neither can bypass the other. Atomic checks: (a) IP + account limiters, (b) both evaluated per request, (c) distinct 429 reason messages, (d) config-driven toggles.
- **CLI(s)**: `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — extends `@nestjs/throttler` already installed.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/dual-rate-limit.config.ts`, `src/common/middleware/account-throttler.guard.ts`, `src/common/middleware/account-throttler.guard.spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/use-cases/login.use-case.ts`, `src/modules/auth/use-cases/register.use-case.ts`, `src/config/index.ts`, `src/app.module.ts`
  - **Deleted**: None
- **Branch**: `feat/security-dual-rate-limit-ip-account`
- **Commit**: `feat(security): add dual rate limit (per IP + per account)`
- **Testing**: Unit test IP limit and account limit independently block with distinct messages; E2E test each returns 429; coverage + lint + typecheck.

### `IX-1-8` — Add temporary + permanent account lockout
- **Description**: Extend `VIII-7-1a` with distinct temporary (timed expiry) and permanent lockout states, configurable thresholds/escalation from temporary to permanent, admin unlock capability, and audit events emitted for alerting. Atomic checks: (a) both lockout types, (b) escalation threshold, (c) admin unlock, (d) audit events.
- **CLI(s)**: `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — uses existing user/auth modules and event emitter (`@nestjs/event-emitter`) if already present.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/use-cases/escalate-lockout.use-case.ts`, `src/modules/auth/use-cases/escalate-lockout.use-case.spec.ts`
  - **Modified**: `src/modules/auth/use-cases/account-lockout.use-case.ts`, `src/modules/admin/controllers/admin-users.controller.ts`, `src/config/security/lockout.config.ts`, `src/config/index.ts`
  - **Deleted**: None
- **Branch**: `feat/auth-temporary-permanent-lockout`
- **Commit**: `feat(auth): add temporary + permanent account lockout`
- **Testing**: Unit test temporary expiry and permanent escalation with `vi.fn()` clock; E2E test admin unlock restores login; coverage + lint + typecheck.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass (rate limits, idempotency, encryption, lockout)
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `IX-1-1`, `IX-1-2`, `IX-1-4`, `IX-1-5a`, `IX-1-5b`, `IX-1-6a`, `IX-1-6b`, `IX-1-7`, `IX-1-8` → `✅ Done`
