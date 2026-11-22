# Task Breakdown - Phase 10 (X): Custom Email & Runtime Config - Step 1: Custom Email & Runtime Config

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; each atomic task uses the 7-field format (Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing)
> **Execution**: Strict sequential Phase IX → X
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Decision log**: Phase X focuses on custom email provider and custom (runtime) configuration, not only email config. The bundled deliverable is split into the custom provider adapter and the runtime config store.

## Step Summary
Add a pluggable custom email provider and a custom runtime configuration store, plus the deferred provider/merge toggles. Each is an independently committable atomic task.

## Atomic Tasks

### `X-1-1a` — Add pluggable custom email provider adapter
- **Description**: Implement a user-selectable custom email provider adapter that satisfies the existing mail port, selectable by config, with a runtime setter so the active provider can be switched without code changes. Atomic checks: (a) custom provider adapter implements the mail port, (b) provider selectable by config, (c) swappable via a provider registry, (d) no duplicate delivery.
- **CLI(s)**: `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — built on the first-party `@nestjs/mail` port used in earlier phases.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/mail-provider.config.ts`, `src/modules/mail/providers/custom-mail.provider.ts`, `src/modules/mail/providers/custom-mail.provider.spec.ts`, `src/modules/mail/mail-provider.registry.ts`
  - **Modified**: `src/modules/mail/mail.module.ts`, `src/config/index.ts`
  - **Deleted**: `None`
- **Branch**: `feat/mail-custom-provider-adapter`
- **Commit**: `feat(mail): add pluggable custom email provider adapter`
- **Testing**: Unit test provider selection and port compliance with `vi.fn()` transport; E2E test switching provider via config sends through the custom adapter; coverage + lint + typecheck.

### `X-1-1b` — Add custom runtime configuration store and reload
- **Description**: Add a custom runtime configuration store (admin-editable settings backed by cache/DB from earlier phases) that mail and other modules consume, with change reload/propagation so values update while the app is running without restart. Atomic checks: (a) runtime config store + typed keys, (b) update API, (c) consumers receive changes on reload, (d) no restart required.
- **CLI(s)**: `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — uses `@nestjs/config` and the existing cache (`II-2-1`) / TypeORM (`II-1-1`) infrastructure.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/runtime-config.config.ts`, `src/modules/config/runtime-config.service.ts`, `src/modules/config/runtime-config.controller.ts`, `src/modules/config/runtime-config.service.spec.ts`, `src/modules/config/config.module.ts`
  - **Modified**: `src/app.module.ts`, `src/modules/mail/mail.module.ts`, `src/config/index.ts`
  - **Deleted**: `None`
- **Branch**: `feat/config-custom-runtime-config-store`
- **Commit**: `feat(config): add custom runtime configuration store and reload`
- **Testing**: Unit test runtime-config updates propagate to consumers with `vi.fn()`; E2E test updating a value takes effect without restart; coverage + lint + typecheck.

### `V-2-6` — Add provider enable/disable toggle *(carried from Phase V Step 2)*
- **Description**: Per-provider enable/disable control for registration/login, enforced by OAuth guards and reflected in docs. Atomic checks: (a) toggle config, (b) guard rejects disabled provider, (c) documented.
- **CLI(s)**: `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — uses existing OAuth/auth guards and `@nestjs/config`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/oauth/provider-toggle.config.ts`, `src/modules/auth/oauth/guards/provider-enabled.guard.ts`, `src/modules/auth/oauth/guards/provider-enabled.guard.spec.ts`, `test/oauth-provider-toggle.e2e-spec.ts`
  - **Modified**: `src/modules/auth/oauth/oauth.module.ts`, `src/config/oauth/oauth-provider.config.type.ts`, `src/config/oauth/google.config.ts`, `src/config/oauth/microsoft.config.ts`, `src/config/oauth/github.config.ts`, `src/config/oauth/apple.config.ts`, `src/config/oauth/x.config.ts`, `src/config/index.ts`, `.env.example`
  - **Deleted**: None
- **Branch**: `feat/auth-provider-enable-disable-toggle`
- **Commit**: `feat(auth): add provider enable/disable toggle`
- **Testing**: Unit test toggle enforcement with `vi.fn()` guards; E2E test disabled provider rejected on register/login; coverage + lint + typecheck.

### `V-2-7` — Add account merge enable/disable toggle *(carried from Phase V Step 2)*
- **Description**: Global toggle controlling whether OAuth account merge is allowed; enforced in the merge use-case. Atomic checks: (a) toggle config, (b) merge respects it, (c) documented behavior when disabled.
- **CLI(s)**: `npm test`, `npm run test:e2e`
- **Package(s)**: `None` — uses existing OAuth merge use-case and `@nestjs/config`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/oauth/merge-toggle.config.ts`, `test/oauth-account-merge-toggle.e2e-spec.ts`
  - **Modified**: `src/modules/auth/oauth/use-cases/link-or-create-oauth-user.use-case.ts`, `src/modules/auth/oauth/use-cases/link-or-create-oauth-user.use-case.spec.ts`, `src/config/index.ts`, `.env.example`
  - **Deleted**: None
- **Branch**: `feat/auth-account-merge-toggle`
- **Commit**: `feat(auth): add account merge enable/disable toggle`
- **Testing**: Unit test merge allowed vs disabled with `vi.fn()`; E2E test both paths (merge when enabled, reject/skip when disabled); coverage + lint + typecheck.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `X-1-1a`, `X-1-1b`, `V-2-6`, `V-2-7` → `✅ Done`
