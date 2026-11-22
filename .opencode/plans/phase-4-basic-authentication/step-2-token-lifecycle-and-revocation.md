# Task Breakdown - Phase 4 (IV): Basic Authentication - Step 2: Token Lifecycle & Revocation

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Strict sequential (Phase IV Step 2 after Step 1)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Decision log**: Redis blacklist + memory fallback + TTL cleanup (`IV-2-2`). `IV-2-2` is split into `IV-2-2a` (port + adapters) and `IV-2-2b` (logout/guard wiring); the original `IV-2-4` deliverable is split into `IV-2-4a` (scope model + account level), `IV-2-4b` (user), `IV-2-4c` (device), `IV-2-4d` (session) so each revocation level is independently committable.

## Step Summary
Implement refresh token rotation, a Redis-backed blacklist with an in-memory dev fallback, refresh token reuse detection, and multi-level revocation (account / device / session / user).

## Atomic Tasks

### `IV-2-1` — Implement refresh token mechanism
- **Description**: Add `POST /auth/refresh`, validating the refresh token issued by `IV-1-2b` and rotating it into a new access/refresh pair; bind refresh to a session/device id. Atomic checks: (a) refresh endpoint exists, (b) rotation replaces the old pair, (c) refresh tokens are rejected as access tokens and vice versa, (d) DTO validates the token string.
- **CLI(s)**: `npx nest g service auth --no-spec` (extend the existing auth service/controller)
- **Package(s)**: `None` — reuses `@nestjs/jwt` and the JWT util from Phase IV Step 1.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/domain/entities/refresh-session.entity.ts`, `src/modules/auth/use-cases/refresh-token.use-case.ts`, `src/modules/auth/dto/refresh-token.dto.ts`, `src/modules/auth/use-cases/refresh-token.use-case.spec.ts`, `test/auth-refresh.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/auth.module.ts`, `src/common/utils/jwt.ts`
  - **Deleted**: None
- **Branch**: `feat/auth-refresh-token-mechanism`
- **Commit**: `feat(auth): implement refresh token mechanism`
- **Testing**: Unit test verifies a valid refresh yields a fresh pair with a new `jti` and that an access token is refused; E2E `npm run test:e2e` covers the refresh flow; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-2-2a` — Add token blacklist port and adapters
- **Description**: Define a `TokenBlacklist` port with a Redis (Keyv) adapter and an in-memory fallback, and add TTL cleanup keyed to token expiry, selecting the fallback when Redis is unavailable. Atomic checks: (a) port + both adapters, (b) fallback selected when Redis is unavailable, (c) entries auto-expire.
- **CLI(s)**: `None (config/code only)` — uses the Redis/Keyv client provisioned in `II-2-1`.
- **Package(s)**: `None` — reuses `keyv`/Redis dependencies from `II-2-1`; no new package.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/ports/token-blacklist.port.ts`, `src/modules/auth/adapters/redis-token-blacklist.adapter.ts`, `src/modules/auth/adapters/in-memory-token-blacklist.adapter.ts`, `src/modules/auth/ports/token-blacklist.port.spec.ts`, `src/modules/auth/adapters/in-memory-token-blacklist.adapter.spec.ts`
  - **Modified**: `src/modules/auth/auth.module.ts`, `.env.example`
  - **Deleted**: `None`
- **Branch**: `feat/auth-token-blacklist-port-adapters`
- **Commit**: `feat(auth): add token blacklist port and adapters`
- **Testing**: Unit tests (Vitest with `vi.fn()`) check blacklist write/read, TTL expiry and fallback on Redis failure; coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-2-2b` — Wire logout revocation into the auth guard
- **Description**: Wire `POST /auth/logout` to blacklist the access token through the port from `IV-2-2a`, and make `JwtAuthGuard` reject blacklisted tokens. Atomic checks: (a) blacklisted token rejected by `JwtAuthGuard`, (b) logout returns 200/204 and revokes.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — reuses the blacklist port/adapters from `IV-2-2a`.
- **File(s)/Folder(s)**:
  - **Added**: `test/auth-logout.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/guards/jwt-auth.guard.ts`, `src/modules/auth/auth.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-logout-revocation`
- **Commit**: `feat(auth): add logout revocation`
- **Testing**: E2E checks `/auth/logout` then a 401 on a protected route; full suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-2-3` — Add refresh token theft detection via reuse detection
- **Description**: Track refresh token family/session state in the store; if an already-rotated token is presented again, revoke the whole family/session and flag theft. Atomic checks: (a) family/session id persisted on issue, (b) reuse of a consumed token detected, (c) family-wide revocation applied, (d) audit event emitted without leaking tokens.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — uses the existing blacklist store and `@nestjs/event-emitter` if available; no new package.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/use-cases/detect-refresh-reuse.use-case.ts`, `src/modules/auth/adapters/refresh-token-family.store.ts`, `src/modules/auth/use-cases/detect-refresh-reuse.use-case.spec.ts`, `test/auth-refresh-reuse.e2e-spec.ts`
  - **Modified**: `src/modules/auth/use-cases/refresh-token.use-case.ts`, `src/modules/auth/auth.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-refresh-token-reuse-detection`
- **Commit**: `feat(auth): add refresh token theft detection via reuse detection`
- **Testing**: Unit test reuse triggers family revocation and emits one theft event; E2E proves a stolen token reuse invalidates the legitimate session; full suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-2-4a` — Add revocation scope model and account-level revocation
- **Description**: Introduce the revocation scope model (`account` / `user` / `device` / `session`), a revocation store port + adapter, and guard evaluation, then enforce the account level (all sessions of an account). Atomic checks: (a) scopes modeled, (b) guard evaluates all scopes even before each is enforced, (c) account-level revoke blocks access, (d) revoke endpoint requires authentication.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — reuses the persistence and cache setup from Phase II.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/domain/revocation-scope.ts`, `src/modules/auth/ports/revocation-store.port.ts`, `src/modules/auth/adapters/revocation-store.adapter.ts`, `src/modules/auth/guards/revocation.guard.ts`, `src/modules/auth/guards/revocation.guard.spec.ts`
  - **Modified**: `src/modules/auth/guards/jwt-auth.guard.ts`, `src/modules/auth/auth.module.ts`, `src/modules/auth/auth.controller.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-multi-level-revocation`
- **Commit**: `feat(auth): add revocation scope model and account-level revocation`
- **Testing**: Unit test guard accepts/blocks per scope and account revoke marks all sessions; E2E tests the account revoke endpoint; full suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-2-4b` — Add user-level revocation
- **Description**: Enforce revocation scoped to a `userId` across all of that user's accounts/devices, with an authenticated endpoint to revoke. Atomic checks: (a) user scope stored and evaluated by the guard, (b) revoke applies to all user sessions, (c) other users unaffected.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None`
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/use-cases/revoke-user.use-case.ts`, `src/modules/auth/use-cases/revoke-user.use-case.spec.ts`, `test/auth-revoke-user.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/domain/revocation-scope.ts`, `src/modules/auth/guards/revocation.guard.ts`, `src/modules/auth/auth.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-user-level-revocation`
- **Commit**: `feat(auth): add user-level revocation`
- **Testing**: Unit test user scope blocks all tokens for that user but not others; E2E `/auth/revoke/user` then protected route 401; full suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-2-4c` — Add device-level revocation
- **Description**: Enforce revocation scoped to a device/session identifier carried in refresh and access tokens, with an endpoint to revoke a single device. Atomic checks: (a) `deviceId` claim present, (b) guard checks device scope, (c) revoking one device leaves others valid.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None`
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/use-cases/revoke-device.use-case.ts`, `src/modules/auth/use-cases/revoke-device.use-case.spec.ts`, `test/auth-revoke-device.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/domain/revocation-scope.ts`, `src/modules/auth/guards/revocation.guard.ts`, `src/common/utils/jwt.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-device-level-revocation`
- **Commit**: `feat(auth): add device-level revocation`
- **Testing**: Unit test device revoke invalidates only the target device; E2E checks `/auth/revoke/device` and that a second device still works; full suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-2-4d` — Add session-level revocation
- **Description**: Enforce the finest-grained scope, a single session (`jti`/session id), with an endpoint to revoke one session. Atomic checks: (a) session id in token claims, (b) guard checks session scope, (c) revoking a session does not affect other sessions on the same device.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None`
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/use-cases/revoke-session.use-case.ts`, `src/modules/auth/use-cases/revoke-session.use-case.spec.ts`, `test/auth-revoke-session.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.controller.ts`, `src/modules/auth/domain/revocation-scope.ts`, `src/modules/auth/guards/revocation.guard.ts`, `src/modules/auth/auth.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-session-level-revocation`
- **Commit**: `feat(auth): add session-level revocation`
- **Testing**: Unit test session scoping isolates other sessions; E2E `/auth/revoke/session` and sibling session still authorized; full suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `IV-2-1`, `IV-2-2a`, `IV-2-2b`, `IV-2-3`, `IV-2-4a`, `IV-2-4b`, `IV-2-4c`, `IV-2-4d` → `✅ Done`
