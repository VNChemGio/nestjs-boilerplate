# Task Breakdown - Phase 5 (V): OAuth Integration - Step 2: OAuth Providers & Toggles

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: follow the roadmap's "Architecture & Design Conventions (DDD + SOLID)" — bounded context per feature module with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters), `interfaces/` (controllers/DTOs); depend on port tokens (DIP), keep adapters substitutable via conformance tests (LSP) and ports narrow (ISP). Apply pragmatically — no ports or aggregates where a plain config/DTO will do.
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Parallel stream Phase V ∥ VI ∥ VII; `V-2-0` (common provider base) is built and merged to `dev` first, then the five provider tasks (`V-2-1` … `V-2-5`) may be parallelized on top of it from the common base (each provider = 1 branch/commit)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Note**: Toggles `V-2-6`/`V-2-7` are listed in the Unified Table under Phase X Step 1 but kept here for provider context — execute them per Phase X ordering.
> **Note**: Roadmap umbrella IDs (`V-2-1` … `V-2-7`) remain the source of truth. `V-2-0` is a derived shared-base task carved out of the strategy/normalizer scaffolding repeated by the provider tasks, so each provider stays a thin adapter; it adds no new roadmap umbrella ID or status.

## Step Summary
Build a reusable OAuth2 provider base (strategy factory + standard profile normalizer) on top of the generic foundation, then integrate five OAuth2 providers as thin adapters over it, plus provider/merge enable-disable toggles.

## Atomic Tasks

### `V-2-0` — Add reusable OAuth2 provider base (strategy factory + standard profile normalizer)
- **Description**: Build the shared base that the concrete providers in this step extend. Provide an `Oauth2ProviderStrategyFactory` that turns a standard-provider config (provider name, authorize/token/profile endpoints, scopes, profile field mapping, optional Passport strategy class defaulting to `passport-oauth2`) into a registered `@nestjs/passport` strategy, plus a `StandardOauthProfileNormalizer` infrastructure adapter implementing the `OAuthProfileNormalizer` port from `V-1-1a` with the shared `sub`/email mapping and verified-email gate, so new providers extend the base without changing the use-case (OCP). Atomic checks: (a) factory produces a working strategy from config only, (b) standard normalizer maps `sub`/`id` + primary email and rejects unverified email without leaking provider data, (c) both are exported and registered through `OAuthModule`. Provider-specific quirks (Apple `form_post`/ES256, GitHub emails endpoint) stay in the provider tasks via the normalizer override hook, not in this base.
- **CLI(s)**: `None (code only)` — built on packages already installed by `V-1-1a`.
- **Package(s)**: `None` — reuses `@nestjs/passport`, `passport-oauth2` and the `OAuthProfileNormalizer` port from `V-1-1a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/oauth/strategies/oauth2-provider.strategy.factory.ts`, `src/modules/auth/oauth/strategies/oauth2-provider.strategy.factory.spec.ts`, `src/modules/auth/oauth/normalizers/standard-oauth-profile.normalizer.ts`, `src/modules/auth/oauth/normalizers/standard-oauth-profile.normalizer.spec.ts`, `src/config/oauth/oauth-provider.config.type.ts`
  - **Modified**: `src/modules/auth/oauth/oauth.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/auth-oauth2-common-provider-base`
- **Commit**: `feat(auth): add reusable oauth2 provider strategy base`
- **Testing**: Unit tests (Vitest, `vi.fn()`) cover strategy creation from config, standard `sub`/email normalization, verified-email rejection, and the normalizer override hook; full unit suite, coverage thresholds, `npm run lint`, `npm run typecheck`. E2E coverage is provided by each provider task (`V-2-1` … `V-2-5`).

### `V-2-1` — Integrate OAuth2 Google provider
- **Description**: Implement the Google adapter on the common base from `V-2-0`: supply endpoints/scopes through a `registerAs` config + `.env` and pass the `passport-google-oauth20` strategy class to `Oauth2ProviderStrategyFactory`; use the shared `StandardOauthProfileNormalizer` for the Google profile (verified `email`, `sub`). Atomic checks: (a) Google strategy registered through the factory, (b) profile→`sub` mapping with verified-email gate from the shared normalizer, (c) config via `registerAs` provider, (d) callback issues the app's JWT pair.
- **CLI(s)**: `None (config/code only)` — files created by hand to follow the common base's layout.
- **Package(s)**: installed with `npm install passport-google-oauth20` and `npm install -D @types/passport-google-oauth20`; reuses the factory, shared config type and normalizer from `V-2-0` plus `@nestjs/passport` from `V-1-1a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/oauth/google.config.ts`, `src/modules/auth/oauth/strategies/google.strategy.ts`, `src/modules/auth/oauth/strategies/google.strategy.spec.ts`, `test/oauth-google.e2e-spec.ts`
  - **Modified**: `src/modules/auth/oauth/oauth.module.ts`, `.env.example`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/auth-oauth2-google-provider`
- **Commit**: `feat(auth): integrate oauth2 google provider`
- **Testing**: Unit test Google profile normalization via the shared normalizer and verified-email gate; E2E mocked callback issues tokens; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `V-2-2` — Integrate OAuth2 Microsoft provider
- **Description**: Same pattern as `V-2-1` for Microsoft (Azure AD / common tenant): thin adapter over the `V-2-0` base that passes the `passport-microsoft` strategy class to the factory and uses the shared standard normalizer. Atomic checks: (a) strategy registered through the factory, (b) profile mapping to `sub` with verified-email gate, (c) config via `registerAs` provider + `.env`, (d) callback issues the app's JWT pair.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: installed with `npm install passport-microsoft` and `npm install -D @types/passport-microsoft`; reuses the factory, shared config type and normalizer from `V-2-0` plus `@nestjs/passport` from `V-1-1a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/oauth/microsoft.config.ts`, `src/modules/auth/oauth/strategies/microsoft.strategy.ts`, `src/modules/auth/oauth/strategies/microsoft.strategy.spec.ts`, `test/oauth-microsoft.e2e-spec.ts`
  - **Modified**: `src/modules/auth/oauth/oauth.module.ts`, `.env.example`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/auth-oauth2-microsoft-provider`
- **Commit**: `feat(auth): integrate oauth2 microsoft provider`
- **Testing**: Unit profile mapping test; E2E mocked callback; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `V-2-3` — Integrate OAuth2 GitHub provider
- **Description**: Same pattern for GitHub OAuth2, built on the `V-2-0` base: pass the `passport-github2` strategy class to the factory and supply a GitHub-specific normalizer through the factory's override hook — GitHub exposes no verified-email flag by default, so it must gate on primary verified email via the emails endpoint (or reject when unverifiable). Atomic checks: (a) strategy registered through the factory, (b) profile mapping to `sub` with that verified-email gate, (c) config via `registerAs` provider, (d) callback issues tokens.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: installed with `npm install passport-github2` and `npm install -D @types/passport-github2`; reuses the factory and shared config type from `V-2-0` plus `@nestjs/passport` from `V-1-1a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/oauth/github.config.ts`, `src/modules/auth/oauth/strategies/github.strategy.ts`, `src/modules/auth/oauth/strategies/github.strategy.spec.ts`, `src/modules/auth/oauth/normalizers/github-oauth-profile.normalizer.ts`, `src/modules/auth/oauth/normalizers/github-oauth-profile.normalizer.spec.ts`, `test/oauth-github.e2e-spec.ts`
  - **Modified**: `src/modules/auth/oauth/oauth.module.ts`, `.env.example`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/auth-oauth2-github-provider`
- **Commit**: `feat(auth): integrate oauth2 github provider`
- **Testing**: Unit test profile mapping plus the unverified/no-email rejection path; E2E mocked callback; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `V-2-4` — Integrate OAuth2 Apple provider
- **Description**: Same pattern for Apple, reusing the `V-2-0` base for the normalizer port and callback/JWT wiring while keeping its `form_post` response handling and ES256 `client_secret` generation (from the Apple `.p8` key) provider-specific; an Apple normalizer is supplied through the factory's override hook. Atomic checks: (a) strategy registered through the factory, (b) profile mapping via the Apple normalizer, (c) client secret signed with `kid`/`iss`/`iat`/`exp` from config, (d) callback issues tokens.
- **CLI(s)**: `openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -out keys/apple-private.p8`
- **Package(s)**: installed with `npm install passport-apple`; client secret signed with the existing `@nestjs/jwt`/`node:crypto` from Phase IV — no additional signing library; reuses the factory and shared config type from `V-2-0`.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/oauth/apple.config.ts`, `src/modules/auth/oauth/strategies/apple.strategy.ts`, `src/modules/auth/oauth/apple-client-secret.util.ts`, `src/modules/auth/oauth/normalizers/apple-oauth-profile.normalizer.ts`, `src/modules/auth/oauth/normalizers/apple-oauth-profile.normalizer.spec.ts`, `src/modules/auth/oauth/strategies/apple.strategy.spec.ts`, `test/oauth-apple.e2e-spec.ts` (the `.p8` key is generated locally and git-ignored, so it is not a committed path)
  - **Modified**: `src/modules/auth/oauth/oauth.module.ts`, `.env.example`, `.gitignore`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/auth-oauth2-apple-provider`
- **Commit**: `feat(auth): integrate oauth2 apple provider`
- **Testing**: Unit tests for profile mapping and client-secret JWT claims/signature; E2E mocked `form_post` callback; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `V-2-5` — Integrate OAuth2 X provider
- **Description**: Same pattern for X (Twitter) OAuth2: use `Oauth2ProviderStrategyFactory` from `V-2-0` with its default `passport-oauth2` strategy class, X authorize/token/profile endpoints and the shared standard normalizer. Atomic checks: (a) strategy registered through the factory, (b) profile mapping to `sub` with the verified-email gate where available, (c) config via `registerAs` provider, (d) callback issues tokens.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — reuses `passport-oauth2` from `V-1-1a` and the factory/shared config type/normalizer from `V-2-0`; no new provider package.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/oauth/x.config.ts`, `src/modules/auth/oauth/strategies/x.strategy.ts`, `src/modules/auth/oauth/strategies/x.strategy.spec.ts`, `test/oauth-x.e2e-spec.ts`
  - **Modified**: `src/modules/auth/oauth/oauth.module.ts`, `.env.example`
  - **Deleted**: `None`
- **Branch**: `feat/auth-oauth2-x-provider`
- **Commit**: `feat(auth): integrate oauth2 x provider`
- **Testing**: Unit profile mapping test; E2E mocked callback; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `V-2-6` — Add provider enable/disable toggle *(phase X)*
- **Description**: Add per-provider enable/disable config (registration/login) read through `@nestjs/config`; disabled providers are not registered and their routes are rejected. Atomic checks: (a) toggle config per provider, (b) guard rejects a disabled provider, (c) auth endpoints reflect enabled providers only. Executed per Phase X ordering.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — uses `@nestjs/config` already installed.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/oauth/provider-toggle.config.ts`, `src/modules/auth/oauth/guards/provider-enabled.guard.ts`, `src/modules/auth/oauth/guards/provider-enabled.guard.spec.ts`, `test/oauth-provider-toggle.e2e-spec.ts`
  - **Modified**: `src/modules/auth/oauth/oauth.module.ts`, `src/config/oauth/oauth-provider.config.type.ts`, `src/config/oauth/google.config.ts`, `src/config/oauth/microsoft.config.ts`, `src/config/oauth/github.config.ts`, `src/config/oauth/apple.config.ts`, `src/config/oauth/x.config.ts`, `src/config/index.ts`, `.env.example`
  - **Deleted**: None
- **Branch**: `feat/auth-provider-enable-disable-toggle`
- **Commit**: `feat(auth): add provider enable/disable toggle`
- **Testing**: Unit test toggle enforcement; E2E test disabled provider login rejected; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `V-2-7` — Add account merge enable/disable toggle *(phase X)*
- **Description**: Add a global toggle to allow/disable user account merge in the generic OAuth flow. Atomic checks: (a) toggle config, (b) merge use-case respects it, (c) behavior when disabled (reject or duplicate handling per policy). Executed per Phase X ordering.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — uses `@nestjs/config` already installed.
- **File(s)/Folder(s)**:
  - **Added**: `src/config/oauth/merge-toggle.config.ts`, `test/oauth-account-merge-toggle.e2e-spec.ts`
  - **Modified**: `src/modules/auth/oauth/use-cases/link-or-create-oauth-user.use-case.ts`, `src/modules/auth/oauth/use-cases/link-or-create-oauth-user.use-case.spec.ts`, `src/config/index.ts`, `.env.example`
  - **Deleted**: None
- **Branch**: `feat/auth-account-merge-toggle`
- **Commit**: `feat(auth): add account merge enable/disable toggle`
- **Testing**: Unit test merge allowed vs disabled; E2E test both paths; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass for each provider
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] `V-2-0` merged to `dev` before the provider branches (`V-2-1` … `V-2-5`) are cut/merged, so the providers build on the common base
- [ ] Update Status `V-2-1`, `V-2-2`, `V-2-3`, `V-2-4`, `V-2-5` (and `V-2-6`, `V-2-7` at phase X) → `✅ Done` (umbrella IDs; derived `V-2-0` has no roadmap status)
