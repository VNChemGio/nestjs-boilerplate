# Task Breakdown - Phase 2 (II): Data Layer & Resilience - Step 5: Basic Infra Configs

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit
> **Task format**: each atomic task uses the 7-field format — Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing
> **Execution**: Phase II tasks may run in parallel (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Rule reminder**: Prefer NestJS v12 built-ins (config, http-client, idempotency, resilience). Split configs into small files exporting an `as Provider()` for async module options.

## Step Summary
Add the basic configuration/setup for config, outbound HTTP client, throttling, idempotency, and resilience/circuit-breaker — foundations hardened later in Phases VIII/IX.

## Atomic Tasks

### `II-5-1` — Add @nestjs/config basic configuration setup
- **Description**: Ensure `@nestjs/config` is globally registered with the Joi env validation from `I-3-2` and the `registerAs` configs from `I-3-5`; add a minimal baseline `app` config (port, nodeEnv) exported as a provider and readable through `ConfigService`. Atomic checks: (a) `ConfigModule.forRoot({ isGlobal: true, validationSchema })`, (b) validation schema wired, (c) baseline config exported/injectable.
- **CLI(s)**: `None (config/code only; reuses Phase I setup)`
- **Package(s)**: `None` (reuses `@nestjs/config` and `joi` installed in `I-3-2`/`I-3-5`)
- **File(s)/Folder(s)**:
  - **Added**: `src/config/index.ts`
  - **Modified**: `src/config/app.config.ts`, `src/config/app.config.spec.ts`, `src/app.module.ts`
  - **Deleted**: None
- **Branch**: `feat/infra-config-basic-setup`
- **Commit**: `feat(infra): add @nestjs/config with basic configuration setup`
- **Testing**: unit test a service injects `ConfigService` and reads a typed value from the baseline config; `npm run typecheck`.

### `II-5-2` — Add HTTP client for outbound calls (basic config)
- **Description**: Register the NestJS v12 native fetch-based `@nestjs/http-client` (prefer it over `@nestjs/axios`) as a reusable named client: `HttpClientModule.forRootAsync()` for global defaults and `registerAsync()` for a `default` client with base URL/timeout from `src/config/http-client.config.ts` exported as an `as Provider()` value; inject with `HttpClient` / `@InjectHttpClient()`. Atomic checks: (a) client provider registered, (b) config-driven baseUrl/timeout, (c) injectable token.
- **CLI(s)**: `npm install @nestjs/http-client`
- **Package(s)**: installed with `npm install @nestjs/http-client` — first-party, `fetch`-based client (no Axios dependency).
- **File(s)/Folder(s)**:
  - **Added**: `src/config/http-client.config.ts`, `src/modules/http-client/http-client.module.ts`, `src/modules/http-client/http-client.module.spec.ts`
  - **Modified**: `src/app.module.ts`, `.env.example`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/infra-http-client-basic-config`
- **Commit**: `feat(infra): add http client for outbound calls (basic config)`
- **Testing**: unit test with a stubbed `fetch` passed to `HttpClientModule.forRoot({ fetch })` using `vi.fn()`, asserting GET/POST call args and timeout config; `npm test -- src/modules/http-client`; coverage thresholds.

### `II-5-3` — Add @nestjs/throttler with basic throttle config
- **Description**: Register `ThrottlerModule.forRootAsync()` from a small `src/config/throttler.config.ts` exported as a provider, and apply the global `ThrottlerGuard` via `APP_GUARD` with conservative defaults (e.g. 100 requests/minute). Atomic checks: (a) `forRootAsync` config provider, (b) global guard bound, (c) limits defined in config.
- **CLI(s)**: `npm install @nestjs/throttler`
- **Package(s)**: installed with `npm install @nestjs/throttler` — first-party throttling module.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/throttler.config.ts`, `src/config/throttler.config.spec.ts`
  - **Modified**: `src/app.module.ts`, `.env.example`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/infra-throttler-basic-config`
- **Commit**: `feat(infra): add @nestjs/throttler with basic throttle config`
- **Testing**: E2E test that exceeding the configured limit yields HTTP 429 (`npm run test:e2e -- throttler`); unit test the config provider values; coverage thresholds.

### `II-5-4` — Add idempotency (basic config)
- **Description**: Register NestJS v12 native `@nestjs/idempotency` with `IdempotencyModule.forRootAsync()` from `src/config/idempotency.config.ts` exported as a provider; use the default in-memory store in dev with a scope hook and key extraction ready, leaving the persistent store / critical-write middleware for `IX-1-5`. Atomic checks: (a) module provider registered, (b) store configured (memory in dev), (c) scope/key hook defined.
- **CLI(s)**: `npm install @nestjs/idempotency`
- **Package(s)**: installed with `npm install @nestjs/idempotency` — first-party idempotency module (built-in `InMemoryIdempotencyStore`).
- **File(s)/Folder(s)**:
  - **Added**: `src/config/idempotency.config.ts`, `src/modules/idempotency/idempotency.module.ts`, `src/config/idempotency.config.spec.ts`
  - **Modified**: `src/app.module.ts`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/infra-idempotency-basic-config`
- **Commit**: `feat(infra): add idempotency (basic config)`
- **Testing**: unit test repeated key returns the cached response and a different key executes the handler (`vi.fn()` call counts); `npm test -- src/config/idempotency.config.spec.ts`; coverage thresholds.

### `II-5-5` — Add resilience / circuit breaker (basic config)
- **Description**: Register NestJS v12 native `@nestjs/resilience` with `ResilienceModule.forRootAsync()` from `src/config/resilience.config.ts` exported as a provider; set default timeout/retry and one named preset skeleton for third-party calls hardened in `IX-1-2`, with a swappable policy port. Atomic checks: (a) resilience provider registered, (b) policy/preset from config, (c) swappable port/exposed service.
- **CLI(s)**: `npm install @nestjs/resilience`
- **Package(s)**: installed with `npm install @nestjs/resilience` — first-party resilience module (retry, timeout, circuit breaker, bulkhead).
- **File(s)/Folder(s)**:
  - **Added**: `src/config/resilience.config.ts`, `src/config/resilience.config.spec.ts`
  - **Modified**: `src/app.module.ts`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/infra-resilience-circuit-breaker-basic`
- **Commit**: `feat(infra): add resilience / circuit breaker (basic config)`
- **Testing**: unit test that the circuit opens after N failures and rejects subsequent calls (Vitest fake timers via `vi.useFakeTimers`, inspect `ResilienceService.circuitBreaker()`); `npm test -- src/config/resilience.config.spec.ts`; coverage thresholds.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass (throttler 429, idempotency, circuit breaker)
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `II-5-1`, `II-5-2`, `II-5-3`, `II-5-4`, `II-5-5` → `✅ Done`

