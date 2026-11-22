# Task Breakdown - Phase 4 (IV): Basic Authentication - Step 1: Local Auth & JWT RS256

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Strict sequential Phase III → IV
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Decision log**: Basic auth only (local + JWT RS256). RS256 key pair + `kid` basic here; rotation deferred to `IX-1-4`. Utils live in `src/common/utils/` (password-hashing, encryption, jwt). The original `IV-1-1` deliverable is split into `IV-1-1a` (module, use-case and strategy) and `IV-1-1b` (login endpoint), and `IV-1-2` into `IV-1-2a` (key pair/config), `IV-1-2b` (JWT util) and `IV-1-2c` (strategy/guard), so each is independently committable.

## Step Summary
Implement Passport local strategy with Argon2 verification, generate and configure an RS256 key pair with `kid`, add the JWT sign/verify utility, and register the JWT strategy.

## Atomic Tasks

### `IV-1-1a` — Add auth module, validate-user use-case and local strategy
- **Description**: Add `AuthModule` and a Passport `LocalStrategy` using the Argon2 hashing port from `III-1-2a`; validate credentials against the user repository through a `ValidateUser` use-case that returns the user or throws `UnauthorizedException`. Atomic checks: (a) strategy registered, (b) Argon2 verify via port, (c) `ValidateUser` returns the user or throws, (d) no raw password ever logged or returned.
- **CLI(s)**: `npx nest g module auth --no-spec`, `npx nest g service auth --no-spec`
- **Package(s)**: installed with `npm install @nestjs/passport passport passport-local` and `npm install -D @types/passport-local`; Argon2 itself was installed in `III-1-2a` and is reused via the hashing port.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/auth.module.ts`, `src/modules/auth/strategies/local.strategy.ts`, `src/modules/auth/use-cases/validate-user.use-case.ts`, `src/modules/auth/strategies/local.strategy.spec.ts`, `src/modules/auth/use-cases/validate-user.use-case.spec.ts`
  - **Modified**: `src/app.module.ts`, `src/common/utils/password-hashing.ts`, `src/modules/shared/infrastructure/adapters/password-hasher.adapter.ts`, `package.json`, `package-lock.json`
  - **Deleted**: None
- **Branch**: `feat/auth-local-strategy-argon2`
- **Commit**: `feat(auth): implement local strategy with argon2 password verification`
- **Testing**: Unit tests (Vitest, `vi.fn()`) assert correct password resolves, wrong password/missing user throws `UnauthorizedException`, and the Argon2 adapter is called exactly once; coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-1-1b` — Expose the local login endpoint
- **Description**: Add `AuthController`/`AuthService` with the minimal `/auth/login` handler guarded by the local strategy from `IV-1-1a`, wiring Passport through `AuthModule`. Atomic checks: (a) endpoint registered, (b) successful login returns the authenticated user context, (c) bad credentials yield 401, (d) no password is logged or returned in the response.
- **CLI(s)**: `npx nest g controller auth --no-spec`
- **Package(s)**: `None` — reuses `@nestjs/passport`/`passport-local` from `IV-1-1a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/auth.service.ts`, `test/auth-local.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.module.ts`
  - **Deleted**: None
- **Branch**: `feat/auth-local-login-endpoint`
- **Commit**: `feat(auth): expose local login endpoint`
- **Testing**: E2E via `npm run test:e2e` checks `/auth/login` 200 with a valid pair and 401 on bad credentials; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-1-2a` — Generate and configure the RS256 key pair with kid
- **Description**: Generate a 2048-bit RSA key pair for RS256, load the private/public PEM from typed config, assign a static `kid` for the key (rotation is deferred to `IX-1-4`), and register the config provider. Atomic checks: (a) PEM files generated and git-ignored, (b) `JWT_PRIVATE_KEY_PATH`/`JWT_PUBLIC_KEY_PATH`/`JWT_KID` validated via `@nestjs/config`, (c) keys are never committed or logged.
- **CLI(s)**: `mkdir -p keys`, `openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out keys/private.pem`, `openssl rsa -in keys/private.pem -pubout -out keys/public.pem`
- **Package(s)**: `None` — uses `node:crypto`/filesystem and the `@nestjs/config` provider already installed in Phases I/II.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/jwt.config.ts`
  - **Modified**: `.env.example`, `.gitignore` (first task to add the key ignore rule), `src/app.module.ts` (register config)
  - **Deleted**: `None`
- **Branch**: `feat/auth-jwt-rs256-key-pair-config`
- **Commit**: `feat(auth): add rs256 key pair config with kid`
- **Testing**: Unit test config parses paths/`kid` and rejects missing or malformed keys; no E2E needed for key generation alone; `npm run test`, `npm run lint`, `npm run typecheck`.

### `IV-1-2b` — Add JWT sign/verify util for access and refresh tokens
- **Description**: Replace the HS256 scaffold in `src/common/utils/jwt.ts` with an RS256 sign/verify utility bound to the config key pair, issuing access and refresh tokens with distinct claims, audiences and TTLs, and stamping `kid` into the protected header. Atomic checks: (a) RS256 keys loaded from config, (b) access + refresh token types distinguishable, (c) `kid` present in header, (d) verify rejects wrong algorithm and tampered signatures.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: installed earlier with `npm install @nestjs/jwt` (first-party) and reused through the `TokenIssuer` port; no new package in this task.
- **File(s)/Folder(s)**:
  - **Added**: `src/common/utils/jwt.spec.ts`
  - **Modified**: `src/common/utils/jwt.ts`, `src/common/utils/index.ts`, `src/modules/shared/domain/ports/token-issuer.port.ts`, `src/modules/shared/infrastructure/adapters/token-issuer.adapter.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-jwt-rs256-key-pair`
- **Commit**: `feat(auth): issue and verify jwt access and refresh tokens with rs256 key pair`
- **Testing**: Unit tests (Vitest) cover sign→verify round-trip, `kid` header assertion, expiration/audience claims, tamper rejection and algorithm-confusion rejection; full unit suite + coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-1-2c` — Register the JWT strategy and auth guard
- **Description**: Register `passport-jwt` `JwtStrategy` using the public key, validate `sub`/`kid`/token type on the request, expose `JwtAuthGuard`, and protect a sample route from `src/app.controller.ts`. Atomic checks: (a) strategy registered via `AuthModule`, (b) only access tokens accepted, (c) invalid/expired token yields 401, (d) verified user attached to `request.user`.
- **CLI(s)**: `npx nest g guard jwt-auth --no-spec`
- **Package(s)**: installed earlier with `npm install @nestjs/passport passport passport-jwt` and `npm install -D @types/passport-jwt`; no new package in this task.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/strategies/jwt.strategy.ts`, `src/modules/auth/guards/jwt-auth.guard.ts`, `src/modules/auth/strategies/jwt.strategy.spec.ts`, `test/auth-jwt.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.module.ts`, `src/app.controller.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-jwt-strategy`
- **Commit**: `feat(auth): register jwt strategy and guard`
- **Testing**: Unit test strategy validates payload and rejects refresh tokens/wrong `kid`; E2E `npm run test:e2e` checks protected route 200 with valid token and 401 without; run full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `IV-1-1a`, `IV-1-1b`, `IV-1-2a`, `IV-1-2b`, `IV-1-2c` → `✅ Done`
