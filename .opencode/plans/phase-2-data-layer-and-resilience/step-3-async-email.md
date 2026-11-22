# Task Breakdown - Phase 2 (II): Data Layer & Resilience - Step 3: Async Email

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit
> **Task format**: each atomic task uses the 7-field format — Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing
> **Execution**: Phase II tasks may run in parallel (from common `dev` base); conceptually depends on `II-2-2`
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Integrate an asynchronous email provider that dispatches mail through the BullMQ queue from `II-2-2`.

## Atomic Tasks

### `II-3-1a` — Define mail port and transport adapter
- **Description**: Install first-party `@nestjs/mail`; define a domain `MailPort` (`send({ to, subject, html, ... })`) and an adapter built on `Mailer` / `MailModule.forRootAsync()`. Select the transport from config: `FileMailTransport` writing `.eml` files in dev, `SmtpTransport` or `ResendTransport` in production; take `from` and transport settings from `src/config/mail.config.ts` exported as an `as Provider()` value. Atomic checks: (a) mail port interface, (b) adapter implements it via `Mailer.send()`, (c) env-based transport selection, (d) file transport works locally.
- **CLI(s)**: `npm install @nestjs/mail`
- **Package(s)**: installed with `npm install @nestjs/mail` — first-party package with built-in `FileMailTransport`, `SmtpTransport` and `ResendTransport` (no extra transport SDK required).
- **File(s)/Folder(s)**:
  - **Added**: `src/config/mail.config.ts`, `src/modules/mail/ports/mail.port.ts`, `src/modules/mail/adapters/nest-mail.adapter.ts`, `src/modules/mail/mail.module.ts`, `src/modules/mail/index.ts`, `src/modules/mail/adapters/nest-mail.adapter.spec.ts`
  - **Modified**: `src/app.module.ts`, `package.json`, `package-lock.json`, `.env.example`, `nest-cli.json` (assets for dev `.eml` output dir if needed)
  - **Deleted**: `None`
- **Branch**: `feat/mail-port-and-transport-adapter`
- **Commit**: `feat(mail): define mail port and transport adapter`
- **Testing**: unit test the adapter maps port args to `Mailer.send()` using `vi.fn()`; dev smoke check that `FileMailTransport` writes an `.eml` under `var/mail`; `npm test -- src/modules/mail`; `npm run typecheck`.

### `II-3-1b` — Add named mail queue producer and worker
- **Description**: Register a named `mail` queue through the queue port from `II-2-2b`; add a producer (`MailQueueService.enqueueSendMail`) and a worker/processor that resolves the `MailPort` and performs the actual send. Honour the in-memory queue fallback so local development works without Redis. Atomic checks: (a) named `mail` queue constant/token, (b) producer enqueues a typed job, (c) worker invokes the port, (d) memory fallback end-to-end works.
- **CLI(s)**: `None (code/config only; uses the queue port from II-2-2b)`
- **Package(s)**: `None` (uses `@nestjs/mail` from `II-3-1a` and the queue module from `II-2-2b`)
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/mail/mail-queue.constants.ts`, `src/modules/mail/mail-queue.producer.ts`, `src/modules/mail/mail-queue.processor.ts`, `src/modules/mail/mail-queue.producer.spec.ts`, `src/modules/mail/mail-queue.processor.spec.ts`
  - **Modified**: `src/modules/mail/mail.module.ts`, `src/app.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/mail-async-queue-producer-worker`
- **Commit**: `feat(mail): add named mail queue producer and worker`
- **Testing**: unit test producer enqueues a `mail.send` job and worker calls `MailPort.send` (`vi.fn()`); E2E-style test with the in-memory queue asserting the send was invoked exactly once; `npm test -- src/modules/mail`; coverage thresholds.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `II-3-1a`, `II-3-1b` → `✅ Done`

