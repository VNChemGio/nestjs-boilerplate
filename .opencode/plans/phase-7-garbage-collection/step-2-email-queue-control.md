# Task Breakdown - Phase 7 (VII): Garbage Collection - Step 2: Email Queue Control

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format (`Description`, `CLI(s)`, `Package(s)`, `File(s)/Folder(s)`, `Branch`, `Commit`, `Testing`)
> **Execution**: Parallel stream Phase V ∥ VI ∥ VII
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Add abandonment handling and send-status control for the email queue.

## Atomic Tasks

### `VII-2-1a` — Abandon stale email queue jobs
- **Description**: Add stale-job abandonment for the `mail` queue from `II-2-2b`/`II-3-1b`: track each job's enqueued-at timestamp and, after a configured timeout, mark/fail and remove stuck jobs so they cannot block the queue, leaving fresh/in-flight jobs untouched. Atomic checks: (a) stale jobs detected after timeout, (b) jobs marked abandoned/failed, (c) timeout configurable via a config provider, (d) fresh jobs unaffected.
- **CLI(s)**: `None (code only — extends the existing mail queue adapter/consumer from II-3-1)`
- **Package(s)**: None new — reuses `@nestjs/bullmq` (`II-2-2b`), the mail port/adapter (`II-3-1a`/`II-3-1b`) and built-in timers.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/mail/mail-abandonment.service.ts`, `src/modules/mail/mail-abandonment.service.spec.ts`
  - **Modified**: `src/modules/mail/mail-queue.processor.ts`, `src/modules/mail/mail.module.ts`, `src/config/mail.config.ts`, `.env.example`
  - **Deleted**: None
- **Branch**: `feat/mail-queue-abandonment`
- **Commit**: `feat(mail): add email queue job abandonment`
- **Testing**: Unit test with `vi.useFakeTimers()` that a job past the timeout is abandoned while a fresh job is untouched, and that the timeout comes from config; coverage thresholds. Run `npm test`, `npm run test:cov`, `npm run lint`, `npm run typecheck`.

### `VII-2-1b` — Add email send status control
- **Description**: Track per-job mail send status (`queued` → `sending` → `sent | failed | abandoned`) in the mail adapter and expose query/update plus retry/abandon control methods through a status service and an optional guarded controller. Atomic checks: (a) status states modeled, (b) transitions on enqueue/send/fail/abandon including `VII-2-1a`, (c) service query/control methods, (d) status endpoint guarded and documented.
- **CLI(s)**: `npx nest g controller modules/mail/mail-status --flat` and `npx nest g service modules/mail/mail-status --flat`
- **Package(s)**: None new — reuses `@nestjs/bullmq` (`II-2-2`) and the mail port/adapter (`II-3-1`).
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/mail/mail-status.controller.ts`, `src/modules/mail/mail-status.service.ts`, `src/modules/mail/mail-status.service.spec.ts`, `test/mail-status.e2e-spec.ts`
  - **Modified**: `src/modules/mail/adapters/nest-mail.adapter.ts`, `src/modules/mail/mail-queue.processor.ts`, `src/modules/mail/mail.module.ts`
  - **Deleted**: None
- **Branch**: `feat/mail-send-status-control`
- **Commit**: `feat(mail): add email send status control`
- **Testing**: Unit test status transitions and query/control methods with a mocked queue/adapter; E2E test the guarded status query endpoint; coverage thresholds. Run `npm test`, `npm run test:e2e`, `npm run test:cov`, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VII-2-1a`, `VII-2-1b` → `✅ Done`
