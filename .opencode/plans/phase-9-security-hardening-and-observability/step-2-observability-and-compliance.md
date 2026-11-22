# Task Breakdown - Phase 9 (IX): Security Hardening & Observability - Step 2: Observability & Compliance

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; each atomic task uses the 7-field format (Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing)
> **Execution**: Strict sequential Phase IX Step 2 after Step 1
> **Branch base**: `dev`; **Branch prefix**: `feat/...`/`docs/...`
> **Split mapping**: roadmap `IX-2-1` → `IX-2-1a` (OTel SDK bootstrap + instrumentation) + `IX-2-1b` (Prometheus metrics endpoint), each independently committable.

## Step Summary
Add Prometheus metrics via OpenTelemetry, map implementation to compliance frameworks, and add multi-channel alerting. The bundled alerting deliverable is split into the core notifier foundation and per-channel adapters.

## Atomic Tasks

### `IX-2-1a` — Bootstrap the OpenTelemetry SDK and instrumentation
- **Description**: Configure the OpenTelemetry SDK (HTTP, auth, queue instrumentation) and bootstrap it before app creation, with config-driven enable/disable. Atomic checks: (a) OTel SDK configured and bootstrapped before the app, (b) auto/manual instrumentations registered, (c) config toggle present.
- **CLI(s)**: `npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-prometheus @opentelemetry/api`, `npm test`
- **Package(s)**: installed with `npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-prometheus @opentelemetry/api`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/otel.config.ts`, `src/common/observability/otel.setup.ts`, `src/common/observability/instrumentation.ts`
  - **Modified**: `src/main.ts` (initialize OTel before app creation), `src/config/index.ts`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/observability-otel-bootstrap`
- **Commit**: `feat(observability): bootstrap opentelemetry sdk and instrumentation`
- **Testing**: Unit test counter/histogram increments with `vi.fn()` and config enable/disable; coverage + lint + typecheck.

### `IX-2-1b` — Expose the Prometheus metrics endpoint
- **Description**: Add a config-driven `/metrics` controller that returns Prometheus text with the expected metric names and can be disabled. Atomic checks: (a) `/metrics` returns Prometheus text with expected metric names, (b) endpoint can be disabled/configured.
- **CLI(s)**: `npm run test:e2e`
- **Package(s)**: `None` — reuses the OTel SDK/exporter from `IX-2-1a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/common/observability/metrics.controller.ts`, `src/common/observability/metrics.controller.spec.ts`, `test/metrics.e2e-spec.ts`
  - **Modified**: `src/app.module.ts`
  - **Deleted**: None
- **Branch**: `feat/observability-prometheus-metrics-endpoint`
- **Commit**: `feat(observability): expose prometheus metrics endpoint`
- **Testing**: E2E test `/metrics` exposes expected metric names and 200; disabled-env test returns 404; full unit + E2E suites, coverage + lint + typecheck.

### `IX-2-2` — Map implementation to HIPAA / ISO27001 / OWASP audit
- **Description**: Produce a compliance traceability document expanding the roadmap's Security & Compliance Traceability Matrix: each requirement → control → implementation location → test evidence, covering HIPAA §164.312, ISO 27001, and OWASP ASVS. Atomic checks: (a) doc exists under `docs/`, (b) all three frameworks covered, (c) implementation paths reference real files, (d) test evidence linked.
- **CLI(s)**: `None (documentation only)`
- **Package(s)**: `None`
- **File(s)/Folder(s)**:
  - **Added**: `docs/security-compliance-traceability.md`
  - **Modified**: `README.md`
  - **Deleted**: None
- **Branch**: `docs/security-compliance-traceability-audit`
- **Commit**: `docs(security): map implementation to hipaa iso27001 owasp audit`
- **Testing**: No unit/E2E code; documentation review for completeness and accuracy of implementation paths and evidence links.

### `IX-2-3a` — Add alerting module, notifier port and event routing
- **Description**: Add the core alerting foundation: a notifier port, an alert dispatcher that routes audit/security events and health failures to enabled notifier adapters, and config-driven global/channel enable-disable flags with secrets sourced from config. Atomic checks: (a) notifier port + dispatcher, (b) event→alert routing, (c) config-driven enable/disable, (d) no secret leakage.
- **CLI(s)**: `npm install @nestjs/event-emitter`, `npm test`
- **Package(s)**: installed with `npm install @nestjs/event-emitter` (first-party; prefer over a custom event bus).
- **File(s)/Folder(s)**:
  - **Added**: `src/config/alerts.config.ts`, `src/modules/alerts/alerts.module.ts`, `src/modules/alerts/alert-dispatcher.service.ts`, `src/modules/alerts/notifier.port.ts`, `src/modules/alerts/alert-dispatcher.service.spec.ts`
  - **Modified**: `src/app.module.ts`, `src/config/index.ts`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/observability-alerts-core-routing`
- **Commit**: `feat(observability): add alerting module and event routing`
- **Testing**: Unit test dispatcher routes events only to enabled notifiers via `vi.fn()` adapters and respects enable flags; verify secrets never appear in payloads; coverage + lint + typecheck.

### `IX-2-3b` — Add chat webhook notifier adapters (Telegram, Slack, Discord)
- **Description**: Implement notifier adapters for Telegram, Slack, and Discord that post formatted alerts to configured webhook URLs via native `fetch`, register them with the dispatcher from `IX-2-3a`, and honour each channel's enable flag and secret config. Atomic checks: (a) three adapters implement the notifier port, (b) channel-specific payload formatting, (c) webhook URL from config, (d) enable flags respected.
- **CLI(s)**: `npm test`
- **Package(s)**: `None` — uses native `fetch` (Node 22+) and `@nestjs/config`; no new npm package.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/alerts/adapters/telegram.notifier.ts`, `src/modules/alerts/adapters/slack.notifier.ts`, `src/modules/alerts/adapters/discord.notifier.ts`, `src/modules/alerts/adapters/chat-notifiers.spec.ts`
  - **Modified**: `src/modules/alerts/alerts.module.ts`, `src/config/alerts.config.ts`
  - **Deleted**: `None`
- **Branch**: `feat/observability-chat-notifier-adapters`
- **Commit**: `feat(observability): add telegram slack discord notifier adapters`
- **Testing**: Unit test each adapter formats its payload and calls `fetch` with `vi.fn()`, respects enable flags, and omits secrets; coverage + lint + typecheck.

### `IX-2-3c` — Add operator email notifier adapter
- **Description**: Implement the operator-email notifier adapter that sends alerts to configured operator mailboxes through the existing async mail queue producer from `II-3-1b`, with an i18n Handlebars template, registered with the dispatcher from `IX-2-3a`. Atomic checks: (a) adapter implements the notifier port, (b) enqueues mail via the mail queue, (c) operator recipients from config, (d) enable flag respected and no secret leakage.
- **CLI(s)**: `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — built on `@nestjs/mail` and `@nestjs/bullmq` from earlier phases.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/alerts/adapters/operator-mail.notifier.ts`, `src/modules/alerts/adapters/operator-mail.notifier.spec.ts`, `src/modules/mail/templates/operator-alert.hbs`, `src/i18n/en/alerts.json`
  - **Modified**: `src/modules/alerts/alerts.module.ts`, `src/config/alerts.config.ts`
  - **Deleted**: None
- **Branch**: `feat/observability-operator-mail-notifier`
- **Commit**: `feat(observability): add operator email notifier adapter`
- **Testing**: Unit test adapter enqueues the alert email with `vi.fn()` and respects enable flags; E2E test queued mail lands for configured recipient; coverage + lint + typecheck.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass (`/metrics`)
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `IX-2-1a`, `IX-2-1b`, `IX-2-2`, `IX-2-3a`, `IX-2-3b`, `IX-2-3c` → `✅ Done`
