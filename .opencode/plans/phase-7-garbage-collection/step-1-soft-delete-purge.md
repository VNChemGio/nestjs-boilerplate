# Task Breakdown - Phase 7 (VII): Garbage Collection - Step 1: Soft Delete Purge

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format (`Description`, `CLI(s)`, `Package(s)`, `File(s)/Folder(s)`, `Branch`, `Commit`, `Testing`)
> **Execution**: Parallel stream Phase V ∥ VI ∥ VII
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Add a scheduled cron job that permanently purges soft-deleted records.

## Atomic Tasks

### `VII-1-1a` — Schedule soft delete purge cron
- **Description**: Register `@nestjs/schedule` in the app and add a `@Cron` job in a dedicated garbage-collection module with a configurable cron expression and retention window from config (exported `as Provider()`), plus a dry-run/logging flag. Atomic checks: (a) `ScheduleModule.forRoot()` registered, (b) cron fires on the configured schedule, (c) retention window read from config, (d) dry-run/logging wired into the job.
- **CLI(s)**: `npm install @nestjs/schedule`
- **Package(s)**: Installed with `npm install @nestjs/schedule` (first-party Nest package; reuses `@nestjs/config` from `I-3-5`).
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/garbage-collection/garbage-collection.module.ts`, `src/modules/garbage-collection/soft-delete-purge.cron.ts`, `src/config/garbage-collection.config.ts`
  - **Modified**: `src/app.module.ts`, `.env.example`, `package.json`, `package-lock.json`
  - **Deleted**: None
- **Branch**: `feat/db-soft-delete-purge-cron-setup`
- **Commit**: `feat(db): add soft delete purge cron setup`
- **Testing**: Unit test cron registration and schedule with `vi.useFakeTimers()` and mocked config; assert the job runs without error and respects the dry-run flag. Run `npm test`, `npm run test:cov`, `npm run lint`, `npm run typecheck`.

### `VII-1-1b` — Implement batch soft delete purge service
- **Description**: Add a `SoftDeletePurgeService` that batch-selects records whose `deletedAt` is older than the configured retention window and hard-deletes them through the TypeORM soft-delete setup from `II-1-1`, in configurable batches to avoid long locks, with structured logging of purged counts and dry-run support; wire it into the cron from `VII-1-1a`. Atomic checks: (a) only expired soft-deleted rows selected, (b) deletes in batches, (c) purged count logged, (d) dry-run performs no deletes.
- **CLI(s)**: `npx nest g service modules/garbage-collection/soft-delete-purge --flat`
- **Package(s)**: None new — reuses TypeORM/@nestjs/typeorm (`II-1-1`) and the scheduler (`VII-1-1a`).
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/garbage-collection/soft-delete-purge.service.ts`, `src/modules/garbage-collection/soft-delete-purge.service.spec.ts`
  - **Modified**: `src/modules/garbage-collection/soft-delete-purge.cron.ts`, `src/modules/garbage-collection/garbage-collection.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/db-soft-delete-purge-service`
- **Commit**: `feat(db): add soft delete purge service`
- **Testing**: Unit test with a mocked TypeORM repository (`vi.fn()`) covering selection of only rows past retention, batched deletes, dry-run no-op and logged counts; coverage thresholds. Run `npm test`, `npm run test:cov`, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VII-1-1a`, `VII-1-1b` → `✅ Done`
