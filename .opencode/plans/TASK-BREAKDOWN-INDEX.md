# Master Task Breakdown Index

> Companion to `.opencode/plans/roadmap.md` (source of truth).
> **Structure**: one easy-to-named folder per phase; every step of that phase is a file inside it:
> `.opencode/plans/<phase-folder>/<step-file>.md`
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit. Every atomic task carries all seven fields: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)** (Added / Modified / Deleted), **Branch**, **Commit**, **Testing**. Oversized roadmap tasks are split into suffixed sub-tasks (e.g. `II-1-1a`, `IV-1-2b`, `VIII-5-1b`) so each is independently committable; the roadmap's Unified Table keeps the umbrella IDs as the source of truth, and now lists every final split ID directly beneath its umbrella row, as do the table below and the linked step files. Each task's **File(s)/Folder(s)** lists every concrete path it creates or changes; paths already present on `dev` or created by an earlier task are listed as **Modified** (never as **Added**). Git-ignored runtime artifacts (`.env`, `keys/*.pem`) are never listed as committed files.
> **Status legend**: ⬜ Planned → ✅ Done (update in the roadmap Unified Table on completion).

## Execution Order
Phase 0 → I → II → III → IV → V ∥ VI ∥ VII → VIII → IX → X → XI
(∥ = parallel from a common `dev` base; all other transitions strict sequential.)

## Architecture & Design Conventions (DDD + SOLID)
This breakdown follows the roadmap's "Architecture & Design Conventions (DDD + SOLID)" section: one bounded context per `src/modules/<context>/` with `domain/` (entities, value objects, ports), `application/` (use cases), `infrastructure/` (adapters) and `interfaces/` (controllers/DTOs); `src/modules/shared/` is the shared-kernel port/adapter layer and `src/common/` is domain-free. Concrete infrastructure is injected via port tokens (DIP), adapters are substitutable (LSP) and narrow (ISP), and every port has a conformance spec that runs against all adapters — introduced by `I-1-2` and repeated by each later port task. Apply these patterns only where they add value (swappable mechanisms and complex security flows); config, CI and docs tasks stay simple. The per-step headers restate the applicable subset.

## Coverage Summary

### Phase 0 — AI Tool & Plan Setup
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 0 — AI Tool & Plan Setup | [step-0-ai-tool-and-plan-setup.md](phase-0-ai-tool-and-plan-setup/step-0-ai-tool-and-plan-setup.md) | `0-0-1a`, `0-0-1b`, `0-0-2` (roadmap `0-0-1`, `0-0-2`) | Sequential |

### Phase I — Foundation & Security Tooling
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — Foundation & Scaffolding | [step-1-foundation-and-scaffolding.md](phase-1-foundation-and-security-tooling/step-1-foundation-and-scaffolding.md) | `I-1-1a`, `I-1-1b`, `I-1-2` … `I-1-8` | Sequential |
| Step 2 — Security Tooling & CI | [step-2-security-tooling-and-ci.md](phase-1-foundation-and-security-tooling/step-2-security-tooling-and-ci.md) | `I-2-1`, `I-2-2`, `I-2-3a`, `I-2-3b`, `I-2-3c`, `I-2-3d`, `I-2-4`, `I-2-5`, `I-2-6` | Sequential |
| Step 3 — Security Headers, Config & OpenAPI | [step-3-security-headers-config-and-openapi.md](phase-1-foundation-and-security-tooling/step-3-security-headers-config-and-openapi.md) | `I-3-1` … `I-3-3`, `I-3-4a`, `I-3-4b`, `I-3-4c`, `I-3-5a`, `I-3-5b`, `I-3-5c`, `I-3-5d`, `I-3-6`, `I-3-7` | Sequential |

### Phase II — Data Layer & Resilience
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — Database | [step-1-database.md](phase-2-data-layer-and-resilience/step-1-database.md) | `II-1-1a`, `II-1-1b`, `II-1-1c` | Parallel (Phase II) |
| Step 2 — Cache & Queue Infrastructure | [step-2-cache-and-queue-infrastructure.md](phase-2-data-layer-and-resilience/step-2-cache-and-queue-infrastructure.md) | `II-2-1a`, `II-2-1b`, `II-2-2a`, `II-2-2b` | Parallel (Phase II) |
| Step 3 — Async Email | [step-3-async-email.md](phase-2-data-layer-and-resilience/step-3-async-email.md) | `II-3-1a`, `II-3-1b` | Parallel (Phase II) |
| Step 4 — Email Templates | [step-4-email-templates.md](phase-2-data-layer-and-resilience/step-4-email-templates.md) | `II-4-1a`, `II-4-1b` | Parallel (Phase II) |
| Step 5 — Basic Infra Configs | [step-5-basic-infra-configs.md](phase-2-data-layer-and-resilience/step-5-basic-infra-configs.md) | `II-5-1`, `II-5-2`, `II-5-3`, `II-5-4`, `II-5-5` | Parallel (Phase II) |

### Phase III — User Management
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — User Domain Model | [step-1-user-domain-model.md](phase-3-user-management/step-1-user-domain-model.md) | `III-1-1`, `III-1-2a`, `III-1-2b` | Sequential |
| Step 2 — Admin User APIs | [step-2-admin-user-apis.md](phase-3-user-management/step-2-admin-user-apis.md) | `III-2-1a`, `III-2-1b` | Sequential |

### Phase IV — Basic Authentication
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — Local Auth & JWT RS256 | [step-1-local-auth-and-jwt-rs256.md](phase-4-basic-authentication/step-1-local-auth-and-jwt-rs256.md) | `IV-1-1a`, `IV-1-1b`, `IV-1-2a`, `IV-1-2b`, `IV-1-2c` | Sequential |
| Step 2 — Token Lifecycle & Revocation | [step-2-token-lifecycle-and-revocation.md](phase-4-basic-authentication/step-2-token-lifecycle-and-revocation.md) | `IV-2-1`, `IV-2-2a`, `IV-2-2b`, `IV-2-3`, `IV-2-4a`, `IV-2-4b`, `IV-2-4c`, `IV-2-4d` | Sequential |
| Step 3 — Authorization (RBAC) | [step-3-authorization.md](phase-4-basic-authentication/step-3-authorization.md) | `IV-3-1a`, `IV-3-1b` | Sequential |

### Phase V — OAuth Integration
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — OAuth Foundation | [step-1-oauth-foundation.md](phase-5-oauth-integration/step-1-oauth-foundation.md) | `V-1-1a`, `V-1-1b` | ∥ V/VI/VII |
| Step 2 — OAuth Providers & Toggles | [step-2-oauth-providers-and-toggles.md](phase-5-oauth-integration/step-2-oauth-providers-and-toggles.md) | `V-2-0`, `V-2-1`, `V-2-2`, `V-2-3`, `V-2-4`, `V-2-5`, `V-2-6` (@ X), `V-2-7` (@ X) | `V-2-0` first → providers ∥ V/VI/VII |

### Phase VI — End-User APIs
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — Registration & Login APIs | [step-1-registration-and-login-apis.md](phase-6-end-user-apis/step-1-registration-and-login-apis.md) | `VI-1-1a`, `VI-1-1b` | ∥ V/VI/VII |
| Step 2 — Password Recovery | [step-2-password-recovery.md](phase-6-end-user-apis/step-2-password-recovery.md) | `VI-2-1a`, `VI-2-1b` | ∥ V/VI/VII |
| Step 3 — Change Password | [step-3-change-password.md](phase-6-end-user-apis/step-3-change-password.md) | `VI-3-1` | ∥ V/VI/VII |

### Phase VII — Garbage Collection
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — Soft Delete Purge | [step-1-soft-delete-purge.md](phase-7-garbage-collection/step-1-soft-delete-purge.md) | `VII-1-1a`, `VII-1-1b` | ∥ V/VI/VII |
| Step 2 — Email Queue Control | [step-2-email-queue-control.md](phase-7-garbage-collection/step-2-email-queue-control.md) | `VII-2-1a`, `VII-2-1b` | ∥ V/VI/VII |

### Phase VIII — Advanced Security
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — Timing Attack Defense | [step-1-timing-attack-defense.md](phase-8-advanced-security/step-1-timing-attack-defense.md) | `VIII-1-1` | Parallel (Phase VIII) |
| Step 2 — Weak Password Check | [step-2-weak-password-check.md](phase-8-advanced-security/step-2-weak-password-check.md) | `VIII-2-1a`, `VIII-2-1b` | Parallel (Phase VIII) |
| Step 3 — MFA / 2FA | [step-3-mfa-and-2fa.md](phase-8-advanced-security/step-3-mfa-and-2fa.md) | `VIII-3-1a`, `VIII-3-1b`, `VIII-3-2a`, `VIII-3-2b` | Parallel (Phase VIII) |
| Step 4 — Device Token | [step-4-device-token.md](phase-8-advanced-security/step-4-device-token.md) | `VIII-4-1a`, `VIII-4-1b` | Parallel (Phase VIII) |
| Step 5 — OTP | [step-5-otp.md](phase-8-advanced-security/step-5-otp.md) | `VIII-5-1a`, `VIII-5-1b` | Parallel (Phase VIII) |
| Step 6 — Magic Link | [step-6-magic-link.md](phase-8-advanced-security/step-6-magic-link.md) | `VIII-6-1a`, `VIII-6-1b` | Parallel (Phase VIII) |
| Step 7 — Account Lockout & Self-Unlock | [step-7-account-lockout-and-self-unlock.md](phase-8-advanced-security/step-7-account-lockout-and-self-unlock.md) | `VIII-7-1a`, `VIII-7-1b` | Parallel (Phase VIII) |
| Step 8 — Audit Logging & Secrets Rotation | [step-8-audit-logging-and-secrets-rotation.md](phase-8-advanced-security/step-8-audit-logging-and-secrets-rotation.md) | `VIII-8-1a`, `VIII-8-1b`, `VIII-8-2a`, `VIII-8-2b` | Parallel (Phase VIII) |

### Phase IX — Security Hardening & Observability
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — Security Add-ons & Hardening | [step-1-security-add-ons-and-hardening.md](phase-9-security-hardening-and-observability/step-1-security-add-ons-and-hardening.md) | `IX-1-1`, `IX-1-2`, `IX-1-4`, `IX-1-5a`, `IX-1-5b`, `IX-1-6a`, `IX-1-6b`, `IX-1-7`, `IX-1-8` | Sequential (IX) |
| Step 2 — Observability & Compliance | [step-2-observability-and-compliance.md](phase-9-security-hardening-and-observability/step-2-observability-and-compliance.md) | `IX-2-1a`, `IX-2-1b`, `IX-2-2`, `IX-2-3a`, `IX-2-3b`, `IX-2-3c` | Sequential (IX) |
| Step 3 — Release & Tag | [step-3-release-and-tag.md](phase-9-security-hardening-and-observability/step-3-release-and-tag.md) | `IX-3-1`, `IX-3-2` | Sequential (IX) |

### Phase X — Custom Email & Runtime Config
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — Custom Email & Runtime Config | [step-1-custom-email-and-runtime-config.md](phase-10-custom-email-and-runtime-config/step-1-custom-email-and-runtime-config.md) | `X-1-1a`, `X-1-1b`, `V-2-6`, `V-2-7` | Sequential |

### Phase XI — Infrastructure & Benchmark
| Step | Breakdown File | Task IDs | Execution |
| :--- | :--- | :--- | :--- |
| Step 1 — Infrastructure & Benchmark | [step-1-infrastructure-and-benchmark.md](phase-11-infrastructure-and-benchmark/step-1-infrastructure-and-benchmark.md) | `XI-1-1a`, `XI-1-1b`, `XI-1-2` | Sequential (final) |

## Notes / Discrepancies (from roadmap)
- **Atomic splits** (roadmap umbrella ID → suffixed IDs, all documented in their step files): `0-0-1` → `0-0-1a`/`0-0-1b`; `I-1-1` → `I-1-1a`/`I-1-1b`; `I-2-3` → `I-2-3a`/`I-2-3b`/`I-2-3c`/`I-2-3d`; `I-3-4` → `I-3-4a`/`I-3-4b`/`I-3-4c`; `I-3-5` → `I-3-5a`/`I-3-5b`/`I-3-5c`/`I-3-5d`; `II-1-1` → `II-1-1a`/`II-1-1b`/`II-1-1c`; `II-2-1` → `II-2-1a`/`II-2-1b`; `II-2-2` → `II-2-2a`/`II-2-2b`; `II-3-1` → `II-3-1a`/`II-3-1b`; `II-4-1` → `II-4-1a`/`II-4-1b`; `III-1-2` → `III-1-2a`/`III-1-2b`; `III-2-1` → `III-2-1a`/`III-2-1b`; `IV-1-1` → `IV-1-1a`/`IV-1-1b`; `IV-1-2` → `IV-1-2a`/`IV-1-2b`/`IV-1-2c`; `IV-2-2` → `IV-2-2a`/`IV-2-2b`; `IV-2-4` → `IV-2-4a`/`IV-2-4b`/`IV-2-4c`/`IV-2-4d`; `IV-3-1` → `IV-3-1a`/`IV-3-1b`; `V-1-1` → `V-1-1a`/`V-1-1b`; `VI-1-1` → `VI-1-1a`/`VI-1-1b`; `VI-2-1` → `VI-2-1a`/`VI-2-1b`; `VII-1-1` → `VII-1-1a`/`VII-1-1b`; `VII-2-1` → `VII-2-1a`/`VII-2-1b`; `VIII-2-1` → `VIII-2-1a`/`VIII-2-1b`; `VIII-3-1` → `VIII-3-1a`/`VIII-3-1b`; `VIII-3-2` → `VIII-3-2a`/`VIII-3-2b`; `VIII-4-1` → `VIII-4-1a`/`VIII-4-1b`; `VIII-5-1` → `VIII-5-1a`/`VIII-5-1b`; `VIII-6-1` → `VIII-6-1a`/`VIII-6-1b`; `VIII-7-1` → `VIII-7-1a`/`VIII-7-1b`; `VIII-8-1` → `VIII-8-1a`/`VIII-8-1b`; `VIII-8-2` → `VIII-8-2a`/`VIII-8-2b`; `IX-1-5` → `IX-1-5a`/`IX-1-5b`; `IX-1-6` → `IX-1-6a`/`IX-1-6b`; `IX-2-1` → `IX-2-1a`/`IX-2-1b`; `IX-2-3` → `IX-2-3a`/`IX-2-3b`/`IX-2-3c`; `X-1-1` → `X-1-1a`/`X-1-1b`; `XI-1-1` → `XI-1-1a`/`XI-1-1b`.
- **`V-2-0` (derived shared base)** — roadmap umbrella IDs `V-2-1` … `V-2-5` remain the source of truth; `V-2-0` is a preparatory, independently committable task carved out of the strategy/normalizer scaffolding those providers would otherwise duplicate. It introduces no new umbrella ID or status; the five providers become thin adapters over its `Oauth2ProviderStrategyFactory`, shared config type and `StandardOauthProfileNormalizer` (GitHub/Apple supply custom normalizers via the override hook). Merge `V-2-0` to `dev` before cutting the provider branches.
- `.opencode/prompts/roadmap-step.md` notes that the roadmap is "also registered in `.opencode/plans/opencode.json` `instructions`"; the actual config is the repo-root `opencode.json`. Phase 0 tasks above reference the correct root path.
- `IX-1-3` is absent in the Unified Table — no breakdown created (intentional; do not invent a task).
- `V-2-6` / `V-2-7` (provider + merge toggles) are listed in the Unified Table under Phase X Step 1; they are documented in both `V-2` (context) and `X-1` (execution), with identical Branch, Commit and File(s)/Folder(s) lists kept in sync (including `src/config/oauth/oauth-provider.config.type.ts` as Modified).
- `I-3-6` and `IX-3-1` are both "update version badge" tasks at different lifecycle points (pre-release vs v12.0.0 tag).
- Roadmap's `IX-1-6` (field encryption) is marked "evaluate first" per Final Decisions Log #6.
- **Parallel-phase creation order**: Phase II tasks may branch in parallel, but tasks that list `.env.example` / `docker-compose.yml` / `src/config/index.ts` as Modified depend on the sibling task that first adds them (`II-1-1a` or `II-5-1`). Merge those creators into `dev` before merging dependents so the listed paths exist.
- **`I-2-3d` (CI docker build job) dependency**: the `Dockerfile` it builds is delivered later by `XI-1-1a`; until that phase lands, gate the job or use a temporary build context so the pipeline stays green. No `Dockerfile` is added in Phase I Step 2 (keeps `XI-1-1a` as the first creator).
- **Phase I Step 3 ordering — headers vs Swagger**: `I-3-1` adds `app.useSecurityHeaders()` first; `I-3-4a` must insert `setupOpenApi(app)` immediately above that call so the final order is "Swagger before security headers". The sequential merge order is intentional; no task is reordered.
- **Phase I Step 3 ordering — env validation wiring**: `I-3-2` only defines the Joi schema + typed `Env` (it installs `joi`, not `@nestjs/config`); `I-3-5a` installs `@nestjs/config` and wires `validationSchema: validateEnv` into `ConfigModule.forRoot`. `II-5-1` later "ensures" the global registration, so no config wiring is duplicated in `I-3-2`.
- **Phase I Step 3 — Faker dependency owner**: `@faker-js/faker` is installed as a devDependency by `I-1-7` for test fixtures; `I-3-7` promotes it to a runtime `dependency` because Swagger example helpers under `src/common/fixtures/` are imported by DTO decorators in production builds (no imports from `test/`).

## Dev-Baseline File-List Rules (file-list reconciliation)
Every `File(s)/Folder(s)` section was refreshed against the tree present on `dev` and against the earlier task that first creates each path:

- **Present on `dev` ⇒ Modified**: scaffold/test/config files already tracked (`src/main.ts`, `src/app.*`, `src/common/utils/*`, `src/modules/shared/*`, `test/app.e2e-spec.ts`, `package.json`, `package-lock.json`, `tsconfig*.json`, `nest-cli.json`, `vitest.config*.ts`, `.husky/pre-commit`, `.prettierrc`, `.oxlintrc.json`, `.lintstagedrc.mjs`, `opencode.json`, `README.md`, `AGENTS.md`) are **never** listed as Added by a task; `I-1-1a` lists them all as Modified.
- **First creator determines Added**: `.env.example` and `docker-compose.yml` are first created by `II-1-1a` (Added) and Modified by later tasks; `src/config/index.ts` is first added by `II-5-1`; `src/config/validation/env.validation.ts` by `I-3-2`; `src/config/openapi/setup-openapi.ts` by `I-3-4a`; `src/config/config.module.ts` by `I-3-5a`; `src/config/app.config.ts` by `I-3-5b` (Modified later by `II-5-1`); `src/config/auth.config.ts` by `I-3-5c`; `src/config/database.config.ts` by `I-3-5d` (Modified by `II-1-1a`); `src/common/dto/example.dto.ts` by `I-3-3` (Modified by `I-3-7`); `src/common/fixtures/swagger-examples.ts` by `I-3-7`; `src/config/throttler.config.ts` by `II-5-3`; `src/config/resilience.config.ts` by `II-5-5`; `src/config/idempotency.config.ts` by `II-5-4`; `src/config/mail.config.ts` by `II-3-1a`; `src/config/alerts.config.ts` by `IX-2-3a`; `src/modules/auth/*` by `IV-1-1a`/`IV-1-1b`; `src/modules/security/*` by `VIII-2-1a`; `.github/workflows/ci.yml` by `I-2-3a` (Modified by `I-2-3b`/`I-2-3c`/`I-2-3d`).
- **Git-ignored runtime artifacts are never committed paths**: `.env` is git-ignored; generated key material (`keys/private.pem`, `keys/public.pem`, `keys/apple-private.p8`, `keys/jwt-<kid>.pem`) is git-ignored and is described in CLI/Description but omitted from Added/Modified/Deleted.
- **Dependency installs ⇒ package files Modified**: any task whose CLI runs `npm install` / `npm install -D` lists `package.json` and `package-lock.json` as Modified (both already exist on `dev`, so they are never Added); tasks that only reuse a package installed by an earlier task do not list them.
- **Shared/port layer** — `src/modules/shared/` (already on `dev`) owns `PASSWORD_HASHER`, `TOKEN_ISSUER`, `ENCRYPTION_SERVICE` and `ID_GENERATOR` ports plus their adapters; feature modules bind/rebind the port tokens instead of redefining them.
- **Auth use-cases** — `src/modules/auth/use-cases/` (not `application/use-cases/`); auth endpoints live in `src/modules/auth/auth.controller.ts` with `src/modules/auth/auth.service.ts`, and new auth-only controllers under `src/modules/auth/interfaces/` (`device.controller.ts`, `magic-link.controller.ts`).
- **User entity/repository** — `src/modules/user/domain/entities/user.entity.ts`, `src/modules/user/domain/repositories/user.repository.port.ts` and `src/modules/user/infrastructure/repositories/typeorm-user-info.repository.ts` (not a flat `user.entity.ts`/`user.repository.ts`).
- **Admin CRUD** — `src/modules/admin/controllers/admin-users.controller.ts` and `src/modules/admin/services/admin-users.service.ts` (not `src/modules/user/user.controller.ts`).
- **Mail templates/processor** — `src/modules/mail/templates/` for `.hbs` files and the Handlebars engine; `src/modules/mail/mail-queue.processor.ts` and `src/modules/mail/adapters/nest-mail.adapter.ts` for the queue/adapter.
- **Config barrel** — `src/config/index.ts` is the single barrel; later tasks list it as Modified when they register their config.
- **OAuth toggles** — `src/config/oauth/provider-toggle.config.ts` and `src/config/oauth/merge-toggle.config.ts`; `V-2-6`/`V-2-7` are documented in Phase V and executed in Phase X using these same paths.
- **OAuth provider base** — `src/config/oauth/` is first populated by `V-2-0` with `oauth-provider.config.type.ts`; the factory (`src/modules/auth/oauth/strategies/oauth2-provider.strategy.factory.ts`) and `StandardOauthProfileNormalizer` (`src/modules/auth/oauth/normalizers/standard-oauth-profile.normalizer.ts`) are also first added by `V-2-0`. Per-provider `*.config.ts` / `*.strategy.ts` files are thin adapters Added by `V-2-1` … `V-2-5`; GitHub and Apple add their own normalizer under `src/modules/auth/oauth/normalizers/`.

## Per-Step Conventions (from `.opencode/prompts/roadmap-step.md`)
- Each atomic task entry includes all seven fields: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)** (Added / Modified / Deleted), **Branch**, **Commit**, **Testing**.
- One atomic task = one commit. Tasks that bundle several independently committable deliverables are split into suffixed sub-tasks (`<TASK-ID>a`, `<TASK-ID>b`, …), each with its own branch, commit, CLI, packages, files and testing.
- Branch names: `<type>/<scope>-<kebab-subject>` cut from `dev` (`feat/...` implementation, `chore/...` Phase 0 tooling).
- Commit messages: `type(scope): subject`.
- Testing: unit (`*.spec.ts`) + coverage thresholds + E2E (`*.e2e-spec.ts`).
- Phase Gate at end of every step: full tests → coverage → security audit & version sync → push → PR merge → status update.

## Structure History
- Reorganized from per-step folders (`.opencode/plans/<phase>-<step>/task-breakdown.md`) to one easy-to-named folder per phase with one file per step (`.opencode/plans/<phase-folder>/<step-file>.md`).
- Task breakdown refreshed: every step file reconciled its Added/Modified/Deleted lists against the current `dev` tree and earlier tasks; oversized umbrella tasks split into suffixed sub-tasks; this index regenerated to match.
