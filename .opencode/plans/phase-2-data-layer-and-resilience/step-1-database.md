# Task Breakdown - Phase 2 (II): Data Layer & Resilience - Step 1: Database

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit
> **Task format**: each atomic task uses the 7-field format — Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing
> **Execution**: Phase II tasks may run in parallel (from common `dev` base); strict order Phase I → II
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Set up TypeORM with PostgreSQL and soft-delete support as the persistence foundation.

## Atomic Tasks

### `II-1-1a` — Install TypeORM/Postgres dependencies and register async database config
- **Description**: Install the TypeORM stack; add a small `src/config/database.config.ts` exporting its options as an `as Provider()` value consumed by `TypeOrmModule.forRootAsync()` (`type: 'postgres'`, URL/SSL/entity + migration paths from config); add a shared `src/config/data-source.ts` so the TypeORM CLI and the runtime use the same options; add a Postgres service to `docker-compose.yml` and `.env.example` vars. Atomic checks: (a) packages present in `package.json`/`package-lock.json`, (b) config provider exported and injected into `forRootAsync`, (c) `docker compose up -d postgres` starts local DB, (d) app boots and connects.
- **CLI(s)**: `npm install @nestjs/typeorm typeorm pg`, `npm install -D @types/pg tsx`, `docker compose up -d postgres`
- **Package(s)**: installed with `npm install @nestjs/typeorm typeorm pg` (first-party `@nestjs/typeorm`, ORM `typeorm`, driver `pg`) and `npm install -D @types/pg tsx` (typings + ESM TypeScript loader for the TypeORM CLI).
- **File(s)/Folder(s)**:
  - **Added**: `src/config/data-source.ts`, `docker-compose.yml`, `.env.example` (first task to introduce the tracked env template; later tasks list it as Modified)
  - **Modified**: `src/config/database.config.ts`, `src/app.module.ts`, `package.json`, `package-lock.json`
  - **Deleted**: None
- **Branch**: `feat/db-typeorm-postgres-config`
- **Commit**: `feat(db): install typeorm postgres and register async database config`
- **Testing**: unit test that the `forRootAsync` factory returns Postgres options from the config provider; `npm run typecheck`; boot smoke check against `docker compose up -d postgres` (app starts with `npm run start:dev`).

### `II-1-1b` — Add soft-delete base entity and interface
- **Description**: Add an abstract base entity with common `id`/`createdAt`/`updatedAt` columns and `@DeleteDateColumn() deletedAt`, plus a `SoftDeletable` interface/port for reusable repositories; enable decorator metadata in `tsconfig.json` if needed for TypeORM decorators. Atomic checks: (a) `deletedAt` is a `DeleteDateColumn`, (b) base entity/interface exported from an index, (c) default queries exclude soft-deleted rows and `withDeleted` includes them.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` (uses `typeorm` installed in `II-1-1a`)
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/database/entities/base.entity.ts`, `src/modules/database/entities/soft-deletable.interface.ts`, `src/modules/database/entities/index.ts`, `src/modules/database/entities/base.entity.spec.ts`
  - **Modified**: `tsconfig.json` (ensure `experimentalDecorators`/`emitDecoratorMetadata` for entity decorators)
  - **Deleted**: `None`
- **Branch**: `feat/db-soft-delete-base-entity`
- **Commit**: `feat(db): add soft-delete base entity and interface`
- **Testing**: unit test asserting `deletedAt` column metadata and that a repository's default query filters soft-deleted rows (`npm test -- src/modules/database/entities`); `npm run typecheck`.

### `II-1-1c` — Generate and apply initial migration
- **Description**: Generate the initial migration from the registered entities via the shared data source using the ESM-aware TypeORM CLI, register the migration in `data-source.ts`, add `migration:generate`/`migration:run` npm scripts, and apply it to the local Postgres instance. Atomic checks: (a) migration file under `src/modules/database/migrations/`, (b) migration listed in the data source options, (c) `migration:run` applies cleanly, (d) `deleted_at` column exists.
- **CLI(s)**: `npx tsx ./node_modules/typeorm/cli.js migration:generate src/modules/database/migrations/InitialSchema -d src/config/data-source.ts`, `npx tsx ./node_modules/typeorm/cli.js migration:run -d src/config/data-source.ts`, `docker compose up -d postgres`
- **Package(s)**: `None` (reuses `typeorm` and `tsx` from `II-1-1a`)
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/database/migrations/<timestamp>-InitialSchema.ts`
  - **Modified**: `src/config/data-source.ts`, `package.json` (migration scripts)
  - **Deleted**: `None`
- **Branch**: `feat/db-initial-migration`
- **Commit**: `feat(db): generate and apply initial typeorm migration`
- **Testing**: `npx tsx ./node_modules/typeorm/cli.js migration:show -d src/config/data-source.ts`; E2E test against test Postgres asserting `softDelete` sets `deletedAt`, `restore` clears it, and default queries hide soft-deleted rows (`npm run test:e2e -- database`).

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `II-1-1a`, `II-1-1b`, `II-1-1c` → `✅ Done`

