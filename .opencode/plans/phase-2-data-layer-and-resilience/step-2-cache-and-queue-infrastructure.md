# Task Breakdown - Phase 2 (II): Data Layer & Resilience - Step 2: Cache & Queue Infrastructure

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit
> **Task format**: each atomic task uses the 7-field format — Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing
> **Execution**: Phase II tasks may run in parallel (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Add Keyv-backed Redis caching with a `boilerplate` namespace and BullMQ queues with an in-memory fallback for local development.

## Atomic Tasks

### `II-2-1a` — Install Keyv/Redis cache dependencies and config
- **Description**: Install the first-party Nest cache module plus Keyv and its Redis store; add a small `src/config/cache.config.ts` exported as an `as Provider()` value with `namespace: 'boilerplate'`, Redis URL, default TTL and a `CACHE_DRIVER=redis|memory` toggle; add the Redis service to `docker-compose.yml` and the env vars to `.env.example`. Atomic checks: (a) packages installed, (b) config provider exported with namespace, (c) env toggle present, (d) `docker compose up -d redis` works.
- **CLI(s)**: `npm install @nestjs/cache-manager cache-manager keyv @keyv/redis`, `docker compose up -d redis`
- **Package(s)**: installed with `npm install @nestjs/cache-manager cache-manager keyv @keyv/redis` — first-party `@nestjs/cache-manager`, `cache-manager` core, `keyv` + `@keyv/redis` store.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/cache.config.ts`, `src/config/cache.config.spec.ts`
  - **Modified**: `docker-compose.yml`, `.env.example`, `package.json`, `package-lock.json`
  - **Deleted**: None
- **Branch**: `feat/infra-keyv-redis-cache-config`
- **Commit**: `feat(infra): install keyv redis cache dependencies and config`
- **Testing**: unit test that the config provider returns `namespace: 'boilerplate'` and honours the driver toggle (`npm test -- src/config/cache.config.spec.ts`); `npm run typecheck`.

### `II-2-1b` — Register global cache module with memory fallback adapter
- **Description**: Register the global `CacheModule.forRootAsync()` in `src/app.module.ts` using the config provider from `II-2-1a`; implement a Keyv-backed cache adapter (Redis store when `CACHE_DRIVER=redis`, plain in-memory Keyv when `memory` or Redis is unavailable in dev) behind a `CachePort`, and expose it via a dedicated `CacheModule`/service. Atomic checks: (a) global module registered via `forRootAsync`, (b) keys carry the `boilerplate` namespace prefix, (c) memory fallback selected by env, (d) get/set/delete through the port.
- **CLI(s)**: `npx nest g module cache`
- **Package(s)**: `None` (uses packages installed in `II-2-1a`)
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/cache/cache.module.ts`, `src/modules/cache/cache.service.ts`, `src/modules/cache/ports/cache.port.ts`, `src/modules/cache/adapters/keyv-cache.adapter.ts`, `src/modules/cache/adapters/memory-cache.adapter.ts`, `src/modules/cache/index.ts`, `src/modules/cache/cache.service.spec.ts`
  - **Modified**: `src/app.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/infra-keyv-cache-module-adapter`
- **Commit**: `feat(infra): register global keyv cache module with memory fallback`
- **Testing**: unit tests for get/set/delete asserting the namespace prefix; fallback test with Redis disabled; port-conformance test across both adapters; `npm test -- src/modules/cache`; coverage thresholds.

### `II-2-2a` — Install BullMQ dependencies and register async queue config
- **Description**: Install `@nestjs/bullmq` + `bullmq`; add `src/config/queue.config.ts` exported as an `as Provider()` value with Redis connection, key prefix and default job options; register `BullModule.forRootAsync()` in the root module using that provider; reuse the Redis service from `II-2-1a`. Atomic checks: (a) packages installed, (b) config provider exported, (c) `forRootAsync` registration, (d) connection/prefix from config.
- **CLI(s)**: `npm install @nestjs/bullmq bullmq`, `docker compose up -d redis`
- **Package(s)**: installed with `npm install @nestjs/bullmq bullmq` — first-party `@nestjs/bullmq` plus the `bullmq` queue driver.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/queue.config.ts`, `src/config/queue.config.spec.ts`
  - **Modified**: `src/app.module.ts`, `.env.example`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/infra-bullmq-queue-config`
- **Commit**: `feat(infra): install bullmq and register async queue config`
- **Testing**: unit test config provider returns the expected connection/prefix/default job options; `npm run typecheck`; boot smoke check with local Redis running.

### `II-2-2b` — Add queue port and in-memory fallback adapter
- **Description**: Define a transport-agnostic queue port (`register`, `enqueue`, `process`, named queues) and implement two adapters: a BullMQ adapter wrapping `@nestjs/bullmq` queues and an in-memory adapter for local dev without Redis; select the adapter from config and export a stable injection token for consumers (the mail queue in `II-3-1`). Atomic checks: (a) port interface, (b) both adapters conform, (c) env-based selection, (d) enqueue/process works with both.
- **CLI(s)**: `npx nest g module queue`
- **Package(s)**: `None` (uses packages installed in `II-2-2a`)
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/queue/queue.module.ts`, `src/modules/queue/ports/queue.port.ts`, `src/modules/queue/adapters/bullmq-queue.adapter.ts`, `src/modules/queue/adapters/memory-queue.adapter.ts`, `src/modules/queue/index.ts`, `src/modules/queue/queue.service.spec.ts`
  - **Modified**: `src/app.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/infra-queue-memory-fallback-adapter`
- **Commit**: `feat(infra): add queue port and in-memory fallback adapter`
- **Testing**: port-conformance tests run against both adapters; unit test that config selects the right adapter; enqueue → process round trip with the memory adapter; `npm test -- src/modules/queue`; coverage thresholds.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `II-2-1a`, `II-2-1b`, `II-2-2a`, `II-2-2b` → `✅ Done`

