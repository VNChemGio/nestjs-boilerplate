# Task Breakdown - Phase 1 (I): Foundation & Security Tooling - Step 1: Foundation & Scaffolding

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format: `Description`, `CLI(s)`, `Package(s)`, `File(s)/Folder(s)`, `Branch`, `Commit`, `Testing`
> **Execution**: Strict sequential within Phase I
> **Branch base**: `dev`; **Branch prefix**: `chore/...` (tooling) / `feat/...` (architecture/logger)

## Step Summary
Bootstrap the NestJS 12.6.0 application, DDD-friendly module structure, test harness, project governance docs, Faker fixtures, and environment-aware logger.

## Atomic Tasks

### `I-1-1a` — Initialize NestJS 12 scaffolding
- **Description**: Scaffold the NestJS 12.6.0 ESM application (already present on `dev` at `06269bb` per roadmap state): `src/main.ts` creates the app and listens on `PORT` (3000 default), `src/app.module.ts` is the root module, sample `AppController`/`AppService` included. Pin `@nestjs/*` runtime packages to 12.6.0 and set ESM (`"type": "module"`, `.js` relative import specifiers). Atomic checks: (a) `src/main.ts` + `src/app.module.ts` exist, (b) NestJS v12.6.0 pinned in `package.json`, (c) app builds and boots.
- **CLI(s)**: `npx @nestjs/cli new . --package-manager npm --skip-git` (initial scaffold); `npm install`; `npm run build` (smoke).
- **Package(s)**: installed with `npm install @nestjs/common@12.6.0 @nestjs/core@12.6.0 @nestjs/platform-express@12.6.0 reflect-metadata rxjs`; dev deps with `npm install -D @nestjs/cli@^12 @nestjs/schematics@^12 @nestjs/testing@12.6.0 typescript @types/node`.
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `src/main.ts`, `src/app.module.ts`, `src/app.module.spec.ts`, `src/app.controller.ts`, `src/app.controller.spec.ts`, `src/app.service.ts`, `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`, `package.json` (all already present on `dev`; verify/pin v12.6.0 + ESM rather than re-adding)
  - **Deleted**: None
- **Branch**: `chore/core-init-nestjs12-scaffolding`
- **Commit**: `chore(core): initialize nestjs 12 scaffolding and git quality gates`
- **Testing**: Smoke unit test that `AppModule` compiles via `Test.createTestingModule`; `npm run build` and `npm run typecheck` pass.

### `I-1-1b` — Add git quality gates (lint, format, typecheck, commitlint)
- **Description**: Configure the git quality gates for the scaffold: `oxlint` (with type-aware linting via `oxlint-tsgolint`), Prettier formatting, TypeScript `tsc --noEmit` typecheck, a `husky` `pre-commit` hook running `lint-staged`, **commitlint** (`@commitlint/cli` + `@commitlint/config-conventional`) via a `commit-msg` hook, and the corresponding `package.json` scripts. Atomic checks: (a) `.husky/pre-commit` invokes lint-staged, (b) `lint` / `typecheck` / `format:check` scripts exist, (c) commit messages follow Conventional Commits via commitlint, (d) all gates pass on a clean tree.
- **CLI(s)**: `npx husky init`; `npx husky add .husky commit-msg "npx --no -- commitlint --edit $1"` (or equivalent); `npm pkg set scripts.lint=... scripts.typecheck=... scripts.format=... scripts.format:check=... scripts.prepare=husky`; `npm install -D @commitlint/cli @commitlint/config-conventional`; `npm pkg set scripts.commitlint=...`; `npm run prepare`; `npm run lint`; `npm run typecheck`; `npm run format:check`; `npm run commitlint`.
- **Package(s)**: installed with `npm install -D oxlint oxlint-tsgolint prettier husky lint-staged typescript @commitlint/cli @commitlint/config-conventional`.
- **File(s)/Folder(s)**:
  - **Added**: `.husky/commit-msg`, `commitlint.config.mjs`
  - **Modified**: `.husky/pre-commit`, `.prettierrc`, `.oxlintrc.json`, `.lintstagedrc.mjs`, `package.json`
  - **Deleted**: None
- **Branch**: `chore/core-add-git-quality-gates`
- **Commit**: `chore(core): add git quality gates (lint, format, typecheck, commitlint)`
- **Testing**: `npm run lint`, `npm run typecheck`, `npm run format:check` and `npm run commitlint` pass; verify `.husky/pre-commit` triggers lint-staged and `.husky/commit-msg` runs commitlint on commit messages.

### `I-1-2` — Add module structure with SOLID layout
- **Description**: Establish the module structure with SOLID-friendly boundaries: `src/modules/` organized per feature module and `src/common/utils/` for swappable hashing/encryption/jwt utilities. The `src/modules/shared/` ports/adapters layer already present on `dev` is the swappability mechanism, so this task only adds the barrels and documents the convention — no new port/adapter scaffolding. Atomic checks: (a) barrels for `src/modules/` and `src/common/` exist, (b) `src/common/utils/` available for swappable utilities, (c) the shared port bindings are documented in `src/modules/shared/README.md`.
- **CLI(s)**: `None (layout/config only — the shared ports/adapters and utils folders already exist on dev)`.
- **Package(s)**: `None` — layout only, no new npm packages.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/index.ts`, `src/common/index.ts`
  - **Modified**: `src/app.module.ts`, `src/modules/shared/README.md`
  - **Deleted**: None
- **Branch**: `feat/arch-module-structure-solid`
- **Commit**: `feat(arch): add module structure with solid layout`
- **Testing**: Unit test that the feature module compiles/behaves via a focused test (module wiring smoke); no DDD port/adapter interface checks.
### `I-1-3` — Add Vitest unit and E2E scaffolding with coverage thresholds
- **Description**: Install/configure Vitest with `vitest.config.ts` (v8 coverage provider, thresholds for lines/branches/functions/statements) and a separate `vitest.config.e2e.ts` project; add `test:unit`, `test:e2e`, `test:cov` scripts for `*.spec.ts` and `*.e2e-spec.ts`. Atomic checks: (a) all three scripts present, (b) thresholds enforced, (c) sample unit + e2e specs pass.
- **CLI(s)**: `npm install -D vitest @vitest/coverage-v8 vite supertest @types/supertest`; `npm pkg set scripts.test=... scripts.test:unit=... scripts.test:e2e=... scripts.test:cov=...`; `npm run test:unit`; `npm run test:e2e`; `npm run test:cov`.
- **Package(s)**: installed with `npm install -D vitest @vitest/coverage-v8 vite supertest @types/supertest` (prefer the Nest-supported Vitest stack; Vitest mocks use `vi.fn()`, never `jest.fn()`).
- **File(s)/Folder(s)**:
  - **Added**: None
  - **Modified**: `vitest.config.ts`, `vitest.config.e2e.ts`, `test/app.e2e-spec.ts`, `src/app.controller.spec.ts`, `package.json`, `tsconfig.json`
  - **Deleted**: None
- **Branch**: `chore/core-vitest-scaffolding-coverage`
- **Commit**: `chore(core): add vitest unit and e2e scaffolding with coverage thresholds`
- **Testing**: Run `npm run test:unit` and `npm run test:e2e`; deliberately drop below a threshold once to verify the coverage gate fails, then restore.

### `I-1-4` — Add LICENSE file
- **Description**: Add a LICENSE file at repo root (choose the project license, e.g. MIT) and align the `package.json` `license` field. Atomic checks: (a) root `LICENSE` exists, (b) `package.json` `license` matches the chosen license.
- **CLI(s)**: `npm pkg set license=MIT` (optional, to align metadata).
- **Package(s)**: `None` — documentation/legal file only.
- **File(s)/Folder(s)**:
  - **Added**: `LICENSE`
  - **Modified**: `package.json` (`license` field)
  - **Deleted**: `None`
- **Branch**: `chore/project-add-license`
- **Commit**: `chore(project): add LICENSE file`
- **Testing**: No unit/E2E code; verify file content and `package.json` metadata consistency.

### `I-1-5` — Add SECURITY.md policy
- **Description**: Add `SECURITY.md` describing supported versions and the responsible vulnerability disclosure process (reporting contact, response timeline) aligned with the project's security posture. Atomic checks: (a) root `SECURITY.md` exists, (b) reporting contact/process present.
- **CLI(s)**: `None (documentation/config only)`.
- **Package(s)**: `None`.
- **File(s)/Folder(s)**:
  - **Added**: `SECURITY.md`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `chore/project-add-security-policy`
- **Commit**: `chore(project): add SECURITY.md policy`
- **Testing**: No unit/E2E code; content review only.

### `I-1-6` — Add CHANGELOG.md
- **Description**: Add `CHANGELOG.md` with an initial Keep a Changelog structure (Unreleased + version sections). Atomic checks: (a) root `CHANGELOG.md` exists, (b) version/section scaffolding present.
- **CLI(s)**: `None (documentation/config only)`.
- **Package(s)**: `None`.
- **File(s)/Folder(s)**:
  - **Added**: `CHANGELOG.md`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `chore/project-add-changelog`
- **Commit**: `chore(project): add CHANGELOG.md`
- **Testing**: No unit/E2E code; content review only.

### `I-1-7` — Add Faker library for generating test data and fixtures
- **Description**: Install `@faker-js/faker` and add reusable fixture factories under `test/fixtures/` for user/auth data, with a deterministic seed helper so examples are reproducible. Atomic checks: (a) dependency added, (b) at least one reusable fixture factory, (c) deterministic via `faker.seed()` helper.
- **CLI(s)**: `npm install -D @faker-js/faker`; `mkdir -p test/fixtures`; `npm run test:unit`.
- **Package(s)**: installed with `npm install -D @faker-js/faker`.
- **File(s)/Folder(s)**:
  - **Added**: `test/fixtures/faker.seed.ts`, `test/fixtures/user.fixture.ts`, `test/fixtures/auth.fixture.ts`, `test/fixtures/fixtures.spec.ts`
  - **Modified**: `package.json` (dev dependency)
  - **Deleted**: `None`
- **Branch**: `chore/test-add-faker-fixtures`
- **Commit**: `chore(test): add faker library for generating test data and fixtures`
- **Testing**: Unit test asserting the fixture factory produces valid typed objects with a fixed seed (repeatable output across calls).

### `I-1-8` — Add logger setup (ConsoleLogger dev, JSON prod via createAppLogger)
- **Description**: Implement a `createAppLogger()` factory returning Nest's `ConsoleLogger` in development and a structured JSON logger in production, wired in `src/main.ts`. Atomic checks: (a) factory exported, (b) env-based branch on `NODE_ENV`, (c) JSON output includes level/timestamp/context.
- **CLI(s)**: `None (implementation authored directly; no generator required)`; validate with `npm run test:unit`.
- **Package(s)**: `None` — uses `ConsoleLogger` from `@nestjs/common` (already pinned in `I-1-1a`).
- **File(s)/Folder(s)**:
  - **Added**: `src/common/logger/create-app-logger.ts`, `src/common/logger/create-app-logger.spec.ts`
  - **Modified**: `src/main.ts` (use `createAppLogger()` as app logger)
  - **Deleted**: `None`
- **Branch**: `feat/core-create-app-logger`
- **Commit**: `feat(core): add logger setup (ConsoleLogger in dev, JSON logger in prod via createAppLogger)`
- **Testing**: Unit test asserting logger type/shape per `NODE_ENV`; spy with `vi.fn()` on output to verify JSON fields (level, timestamp, context) in production mode.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status for `I-1-1a`, `I-1-1b`, `I-1-2` … `I-1-8` → `✅ Done`
