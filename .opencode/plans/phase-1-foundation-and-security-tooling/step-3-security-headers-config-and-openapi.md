# Task Breakdown - Phase 1 (I): Foundation & Security Tooling - Step 3: Security Headers, Config & OpenAPI

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format: `Description`, `CLI(s)`, `Package(s)`, `File(s)/Folder(s)`, `Branch`, `Commit`, `Testing`
> **Execution**: Strict sequential within Phase I (merge each task before cutting the next branch)
> **Branch base**: `dev`; **Branch prefix**: `feat/...` (implementation) / `chore/...` (release)
> **Split note**: umbrella roadmap task `I-3-4` → `I-3-4a`/`I-3-4b`/`I-3-4c`; umbrella roadmap task `I-3-5` → `I-3-5a`/`I-3-5b`/`I-3-5c`/`I-3-5d`. The roadmap Unified Table keeps the umbrella IDs as the source of truth; the linked index and this file list the final split IDs.
> **Ordering notes**: (a) `I-3-1` adds `useSecurityHeaders()` first; `I-3-4a` later inserts `setupOpenApi(app)` immediately above it, so the final call order satisfies "Swagger before security headers". (b) `I-3-2` only defines the Joi schema + typed `Env` — `@nestjs/config` is not installed until `I-3-5a`, which wires `validationSchema` into `ConfigModule.forRoot` (`II-5-1` later ensures it). (c) `I-3-7` promotes `@faker-js/faker` from devDependency to dependency because `src/` DTO decorators import it at runtime.

## Step Summary
Wire in native security headers, typed/validated configuration, global validation, dual OpenAPI instances (user + admin, admin disabled in prod) with a Scalar UI and bearer scheme via `setupOpenApi`, the core config module with `registerAs` namespaces, the pre-release version badge, and Faker-backed Swagger examples.

## Atomic Tasks

### `I-3-1` — Add native security headers via useSecurityHeaders
- **Description**: Call `app.useSecurityHeaders()` (NestJS 12 native, from `@nestjs/core`) in `src/main.ts` with hardened defaults (CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS; no `helmet`). Ordering: this task adds the call; `I-3-4a` inserts `setupOpenApi(app)` immediately **above** it so docs routes are mounted before headers are applied. Atomic checks: (a) method invoked on the app instance, (b) hardened headers present on responses, (c) Swagger insertion point preserved.
- **CLI(s)**: `npm run test:e2e` (header assertions); `npm run typecheck`.
- **Package(s)**: `None` — uses the native `app.useSecurityHeaders()` already provided by `@nestjs/core`/`@nestjs/common`; no new dependency (no `helmet`).
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `src/main.ts`, `test/app.e2e-spec.ts` (already on `dev`)
  - **Deleted**: `None`
- **Branch**: `feat/sec-native-security-headers`
- **Commit**: `feat(sec): add native security headers via useSecurityHeaders`
- **Testing**: E2E assertions that responses contain `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` and `Referrer-Policy`; verify the docs route remains reachable after `I-3-4a` lands.

### `I-3-2` — Add typed env with Joi validation
- **Description**: Define a Joi schema covering all required env vars (`PORT`, `NODE_ENV`, `OBSERVE_APP_KEY`/`OBSERVE_APP_SECRET`, plus placeholders used by later phases) and export `validateEnv(config: Record<string, unknown>)`, which fails fast on invalid/missing values, together with a typed `Env` interface inferred from the schema. This task does **not** touch `ConfigModule.forRoot` — `@nestjs/config` is installed in `I-3-5a`, which wires `validationSchema: validateEnv` (and `II-5-1` later "ensures" it). Atomic checks: (a) Joi schema present, (b) typed `Env` interface, (c) `validateEnv` throws on invalid/missing vars.
- **CLI(s)**: `npm install joi`; `npm run test:unit`.
- **Package(s)**: installed with `npm install joi` (Joi ships its own `lib/index.d.ts`; no `@types/joi` needed).
- **File(s)/Folder(s)**:
  - **Added**: `src/config/validation/env.validation.ts`, `src/config/validation/env.validation.spec.ts`, `src/config/env.interface.ts`
  - **Modified**: `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/config-typed-env-joi-validation`
- **Commit**: `feat(config): add typed env with joi validation`
- **Testing**: Unit test that a valid env object passes and that invalid/missing values throw; compile-time check that `Env` is inferred from the schema (`npm run typecheck`).

### `I-3-3` — Add global validation pipe with whitelist and transform
- **Description**: Register `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))` so DTOs validate, unknown props are rejected/stripped and payloads transform to DTO instances. Add a sample validated DTO (`src/common/dto/example.dto.ts`, first created here; decorated with Swagger examples later in `I-3-7`). Atomic checks: (a) pipe registered globally, (b) `whitelist` + `transform` + `forbidNonWhitelisted` enabled, (c) `class-validator`/`class-transformer` present.
- **CLI(s)**: `npm install class-validator class-transformer`; `npm run test:e2e`.
- **Package(s)**: installed with `npm install class-validator class-transformer`.
- **File(s)/Folder(s)**:
  - **Added**: `src/common/dto/example.dto.ts`, `test/validation.e2e-spec.ts`
  - **Modified**: `src/main.ts` (register global `ValidationPipe`), `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/config-global-validation-pipe`
- **Commit**: `feat(config): add global validation pipe with whitelist and transform`
- **Testing**: E2E test with a test-only controller in the spec that unknown properties are rejected/stripped and payloads are transformed to DTO instances; coverage thresholds pass.

### `I-3-4a` — Add setupOpenApi with the user Swagger doc and bearer scheme
- **Description**: Create `setupOpenApi(app)` in a separate file `src/config/openapi/setup-openapi.ts`. Mount a single `user` Swagger document (`docs` + `docs-json`) with a bearer `Authorization` security scheme (`type: 'http'`, `scheme: 'bearer'`, `bearerFormat: 'JWT'`) and filter it to non-admin tags. Call `setupOpenApi(app)` in `src/main.ts` immediately **above** the `useSecurityHeaders()` call from `I-3-1` (required order). The `admin` document and Scalar UI are added by `I-3-4b`/`I-3-4c`. Atomic checks: (a) separate file exporting `setupOpenApi`, (b) user doc + bearer scheme in the generated spec, (c) call order in `main.ts`.
- **CLI(s)**: `npm install @nestjs/swagger`; `mkdir -p src/config/openapi`; `npm run test:e2e`.
- **Package(s)**: installed with `npm install @nestjs/swagger` (first-party Nest package; reused by `I-3-7`, `III-2-1`, `VI-1-1`, `VI-2-1`).
- **File(s)/Folder(s)**:
  - **Added**: `src/config/openapi/setup-openapi.ts`, `src/config/openapi/setup-openapi.spec.ts`, `test/openapi.e2e-spec.ts`
  - **Modified**: `src/main.ts`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/config-openapi-swagger-bearer-setup`
- **Commit**: `feat(config): add openapi swagger bearer setup with user doc`
- **Testing**: E2E GET of `docs-json` returns a spec containing the bearer scheme; the docs route is reachable (mounted before security headers); unit test that `setupOpenApi` registers exactly one doc at this stage.

### `I-3-4b` — Add the admin Swagger doc with a production guard
- **Description**: Extend `setupOpenApi` with a second `admin` Swagger document (`admin/docs` + `admin/docs-json`) limited to admin-tagged routes, gated by `NODE_ENV !== 'production'` using the typed `Env` from `I-3-2`, so the admin spec never leaks in production. The user doc remains available in every environment. Atomic checks: (a) two docs with distinct tag filters, (b) admin doc absent/404 in a prod-like env, (c) user doc unaffected.
- **CLI(s)**: `NODE_ENV=development npm run test:e2e -- openapi`; `NODE_ENV=production npm run test:e2e -- openapi`.
- **Package(s)**: `None` — reuses `@nestjs/swagger` installed by `I-3-4a`.
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `src/config/openapi/setup-openapi.ts`, `src/config/openapi/setup-openapi.spec.ts`, `test/openapi.e2e-spec.ts`
  - **Deleted**: `None`
- **Branch**: `feat/config-openapi-admin-doc-prod-guard`
- **Commit**: `feat(config): add admin openapi doc with production guard`
- **Testing**: E2E in development: both docs reachable and tagged correctly; with `NODE_ENV=production`: the admin route returns 404 and the user spec still serves.

### `I-3-4c` — Integrate @scalar/nestjs-api-reference UI
- **Description**: Mount the Scalar API Reference UI for the `user` OpenAPI document via `@scalar/nestjs-api-reference`, pointing it at the user `docs-json` URL, and honor the same production guard so no admin Scalar UI is exposed. Atomic checks: (a) Scalar route registered, (b) it serves the user spec URL, (c) no admin Scalar UI in prod.
- **CLI(s)**: `npm install @scalar/nestjs-api-reference`; `npm run test:e2e`.
- **Package(s)**: installed with `npm install @scalar/nestjs-api-reference`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/openapi/scalar-api-reference.ts`, `test/scalar-api-reference.e2e-spec.ts`
  - **Modified**: `src/config/openapi/setup-openapi.ts`, `src/main.ts`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/config-scalar-api-reference`
- **Commit**: `feat(config): integrate scalar api reference for openapi docs`
- **Testing**: E2E GET of the Scalar route returns HTML referencing the user spec JSON; confirm no admin Scalar route in a prod-like env.

### `I-3-5a` — Add the core ConfigModule and wire env validation
- **Description**: Install `@nestjs/config` and add `src/config/config.module.ts` exporting a global `ConfigModule.forRoot({ isGlobal: true, validationSchema: validateEnv, envFilePath: '.env', expandVariables: true })`; import it into `src/app.module.ts`. This is the first task that wires the Joi schema from `I-3-2` into bootstrap (later "ensured" by `II-5-1`). The `load` namespace array starts empty; sub-tasks `I-3-5b` … `I-3-5d` append their `registerAs` providers. Atomic checks: (a) `@nestjs/config` installed, (b) global ConfigModule with `validationSchema`, (c) invalid env fails at bootstrap.
- **CLI(s)**: `npm install @nestjs/config`; `npm run test:unit`; negative smoke `NODE_ENV=production PORT=abc npm run start` (must fail fast).
- **Package(s)**: installed with `npm install @nestjs/config` (first-party Nest package).
- **File(s)/Folder(s)**:
  - **Added**: `src/config/config.module.ts`, `src/config/config.module.spec.ts`
  - **Modified**: `src/app.module.ts`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/config-core-config-module`
- **Commit**: `feat(config): add core configuration module with @nestjs/config`
- **Testing**: Unit test that `ConfigModule` compiles with a valid env and rejects an invalid `PORT`; `npm run typecheck`.

### `I-3-5b` — Add the app config namespace with registerAs
- **Description**: Add `src/config/app.config.ts` using `registerAs('app', ...)` for `port`, `nodeEnv` and similar app-level values; export the typed config as a value consumable via `as Provider()` in `.forRootAsync()`/`.registerAsync()` options, and append it to the `load` array in `src/config/config.module.ts` (first created by `I-3-5a`). This is the first creator of `src/config/app.config.ts` (modified later by `II-5-1`). Atomic checks: (a) `registerAs('app')` namespace, (b) small typed config file, (c) provider pattern consumable by async modules.
- **CLI(s)**: `npm run test:unit`.
- **Package(s)**: `None` — reuses `@nestjs/config` from `I-3-5a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/app.config.ts`, `src/config/app.config.spec.ts`
  - **Modified**: `src/config/config.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/config-app-namespace-registeras`
- **Commit**: `feat(config): add app config namespace with registerAs`
- **Testing**: Unit test that `appConfig()` returns a typed object and can be injected via `as Provider()` in a `Test.createTestingModule()`; coverage thresholds pass.

### `I-3-5c` — Add the auth config namespace with registerAs
- **Description**: Add `src/config/auth.config.ts` using `registerAs('auth', ...)` for JWT settings (`algorithm: 'RS256'`, issuer/audience, access/refresh TTLs, key paths per Final Decisions Log #4) and append it to the `load` array in `src/config/config.module.ts`. Keep it small and typed, exported as an `as Provider()` value for later auth modules. Atomic checks: (a) `registerAs('auth')` namespace, (b) RS256-oriented typed fields, (c) provider consumable by async modules. This file is first created here and extended later by `VI-2-1`/`VIII-1-1`.
- **CLI(s)**: `npm run test:unit`.
- **Package(s)**: `None` — reuses `@nestjs/config` from `I-3-5a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/auth.config.ts`, `src/config/auth.config.spec.ts`
  - **Modified**: `src/config/config.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/config-auth-namespace-registeras`
- **Commit**: `feat(config): add auth config namespace with registerAs`
- **Testing**: Unit test that `authConfig()` returns typed values and is injectable via `as Provider()`; coverage thresholds pass.

### `I-3-5d` — Add the database config namespace with registerAs
- **Description**: Add a small `src/config/database.config.ts` using `registerAs('database', ...)` with connection URL/SSL fields (skeleton namespace only) and append it to the `load` array in `src/config/config.module.ts`. `II-1-1a` later completes it with the full TypeORM options and `src/config/data-source.ts`. Atomic checks: (a) `registerAs('database')` namespace, (b) typed values, (c) provider consumable by `TypeOrmModule.forRootAsync()` later.
- **CLI(s)**: `npm run test:unit`.
- **Package(s)**: `None` — reuses `@nestjs/config` from `I-3-5a`; no TypeORM packages installed here.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/database.config.ts`, `src/config/database.config.spec.ts`
  - **Modified**: `src/config/config.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/config-database-namespace-registeras`
- **Commit**: `feat(config): add database config namespace with registerAs`
- **Testing**: Unit test that `databaseConfig()` returns typed values and is injectable via `as Provider()`; coverage thresholds pass.

### `I-3-6` — Update package.json version badge
- **Description**: Set `package.json` `version` to the pre-release target ahead of the `v12.0.0` tag (e.g. `12.0.0-rc.0`) and align the version badge in `README.md` with it. Do **not** tag `v12.0.0` — that belongs to `IX-3-2`. Atomic checks: (a) badge present/updated, (b) badge value identical to `package.json` version.
- **CLI(s)**: `npm pkg set version=12.0.0-rc.0` (adjust to the agreed pre-release version).
- **Package(s)**: `None` — metadata/documentation only.
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `package.json`, `package-lock.json`, `README.md` (badge URL/value)
  - **Deleted**: `None`
- **Branch**: `chore/release-update-version-badge`
- **Commit**: `chore(release): update package.json version badge`
- **Testing**: No unit/E2E code; metadata consistency check between the README badge and `package.json`.

### `I-3-7` — Add OpenAPI Swagger examples via Faker data
- **Description**: Add `src/common/fixtures/swagger-examples.ts` that uses `@faker-js/faker` with a deterministic `faker.seed()` (same seeding approach as the `test/fixtures/` helpers from `I-1-7`, but self-contained under `src/` so production builds never import from `test/`) and decorate `src/common/dto/example.dto.ts` properties with `@ApiProperty({ example })` from the generated values. Promote `@faker-js/faker` from devDependency to dependency because `src/` imports it in decorator metadata. Atomic checks: (a) examples come from seeded fixtures, (b) deterministic seed, (c) no real/sensitive data.
- **CLI(s)**: `npm pkg delete devDependencies.@faker-js/faker` then `npm install @faker-js/faker`; `npm run test:unit`.
- **Package(s)**: `@faker-js/faker` moved to `dependencies` (first installed as a devDependency by `I-1-7`); reuses `@nestjs/swagger` from `I-3-4a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/common/fixtures/swagger-examples.ts`, `src/common/fixtures/swagger-examples.spec.ts`
  - **Modified**: `src/common/dto/example.dto.ts` (first created by `I-3-3`), `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/api-openapi-swagger-faker-examples`
- **Commit**: `feat(api): add openapi swagger examples via faker data`
- **Testing**: Unit test that each generated example validates against its DTO schema and is stable for a fixed seed; verify the `docs-json` spec contains the examples.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass (security headers, validation pipe, both Swagger instances, Scalar UI, prod admin guard)
- [ ] Security audit & version sync pass
- [ ] `git push` each step branch → PR → merge into `dev` in strict order: `I-3-1` → `I-3-2` → `I-3-3` → `I-3-4a` → `I-3-4b` → `I-3-4c` → `I-3-5a` → `I-3-5b` → `I-3-5c` → `I-3-5d` → `I-3-6` → `I-3-7`
- [ ] Update Status for `I-3-1` … `I-3-7` → `✅ Done` in the roadmap Unified Table (umbrella IDs `I-3-4` covers `I-3-4a` … `I-3-4c`; `I-3-5` covers `I-3-5a` … `I-3-5d`)
