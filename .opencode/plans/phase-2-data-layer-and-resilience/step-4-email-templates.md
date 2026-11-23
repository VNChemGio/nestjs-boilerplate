# Task Breakdown - Phase 2 (II): Data Layer & Resilience - Step 4: Email Templates

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit
> **Task format**: each atomic task uses the 7-field format — Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing
> **Execution**: Phase II tasks may run in parallel (from common `dev` base); conceptually depends on `II-3-1`
> **Branch base**: `dev`; **Branch prefix**: `feat/...`

## Step Summary
Add localized Handlebars email templates via nestjs-i18n, building on the async mail provider.

## Atomic Tasks

### `II-4-1a` — Register i18n module and Handlebars template engine
- **Description**: Install `@nestjs/i18n` and `handlebars`; register `I18nModule.forRootAsync()` with `JsonI18nLoader`, `defaultLocale: 'en'`, `supportedLocales: ['en']` (extendable), locale resolvers and a typed `Translations` shape; plug a Handlebars-backed `MailTemplateEngine` into `@nestjs/mail` (from `II-3-1a`) with the template directory resolved via `import.meta.dirname`; add template/catalog assets to `nest-cli.json`. Atomic checks: (a) i18n module registered, (b) Handlebars engine wired into `MailModule`, (c) assets copied to `dist`, (d) catalog keys type-checked.
- **CLI(s)**: `npm install @nestjs/i18n handlebars`
- **Package(s)**: installed with `npm install @nestjs/i18n handlebars` — first-party `@nestjs/i18n` for catalogs/locale, `handlebars` as the `MailTemplateEngine` for the already-installed `@nestjs/mail`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/i18n.config.ts`, `src/modules/mail/templates/handlebars-template.engine.ts`, `src/modules/mail/templates/handlebars-template.engine.spec.ts`, `src/i18n/en/mail.json`, `src/i18n/translations.ts`
  - **Modified**: `src/app.module.ts`, `src/modules/mail/mail.module.ts`, `nest-cli.json`, `tsconfig.json`, `package.json`, `package-lock.json`
  - **Deleted**: None
- **Branch**: `feat/mail-i18n-handlebars-engine`
- **Commit**: `feat(mail): configure i18n and handlebars template engine`
- **Testing**: unit test the engine renders a named `.hbs` template with a context and returns HTML; `npm run typecheck`; `npm run build` and assert templates/catalogs land in `dist`.

### `II-4-1b` — Add localized templates and render service
- **Description**: Add at least two localized templates (welcome, password reset) with locale variants (e.g. `welcome.en.hbs`) plus a shared layout, and add a render service that injects `I18nService`, reads typed catalog keys for subjects and returns `{ subject, html }`; expose `Mailable` classes for the mail adapter to send. DDD/SOLID: the render service is an application service returning a domain `Mailable`, while the Handlebars engine stays an infrastructure adapter. Atomic checks: (a) ≥2 templates, (b) localized variant resolves per locale, (c) render service returns HTML + localized subject, (d) mail adapter/queue uses the rendered mails.
- **CLI(s)**: `None (code/assets only; uses packages from II-4-1a)`
- **Package(s)**: `None` (reuses `@nestjs/i18n`, `handlebars` and `@nestjs/mail`)
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/mail/templates/layout.hbs`, `src/modules/mail/templates/welcome.en.hbs`, `src/modules/mail/templates/password-reset.en.hbs`, `src/modules/mail/services/template-render.service.ts`, `src/modules/mail/mailables/welcome.mail.ts`, `src/modules/mail/mailables/password-reset.mail.ts`, `src/modules/mail/services/template-render.service.spec.ts`
  - **Modified**: `src/i18n/translations.ts`, `src/i18n/en/mail.json`, `src/modules/mail/mail.module.ts`, `nest-cli.json` (template assets)
  - **Deleted**: `None`
- **Branch**: `feat/mail-localized-templates-render-service`
- **Commit**: `feat(mail): add localized handlebars templates and render service`
- **Testing**: unit test renders welcome and password-reset for two locales and asserts localized subjects/content; HTML snapshot via Vitest (`npm test -- src/modules/mail`); coverage thresholds.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `II-4-1a`, `II-4-1b` → `✅ Done`

