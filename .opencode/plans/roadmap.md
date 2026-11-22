# Master Roadmap: Enterprise Security & Reliability Boilerplate

**Feature**: Enterprise Security & Reliability Boilerplate  
**Short Name**: `nestjs-boilerplate`  
**Repository**: `VnDevTop/nestjs-boilerplate`  
**Base Branch**: `dev` (from `master`)  
**Date**: 2026-11-22  
**Compliance Targets**: HIPAA §164.312, ISO 27001, OWASP ASVS  
**Framework Baseline**: Latest NestJS (native `@nestjs/observe`, native `app.useSecurityHeaders()`, graceful shutdown via `enableShutdownHooks()`)  
**Runner & OS Base**: `ubuntu-24.04` (planned — CI workflows not yet scaffolded)

## Executive Summary & Task List (Unified Table)

| Phase | Step | Task ID | Task | Status |
| :---- | :--- | :------------ | --- | :--- |
| Phase 0: AI Tool & Plan Setup | Step 0 | `0-0-1` | `chore(ai): setup ai tool configuration for roadmap and plan files` | ✅ Done |
| Phase 0: AI Tool & Plan Setup | Step 0 | `0-0-2` | `chore(ai): add ai prompt templates for roadmap planning workflow` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 1 | `I-1-1` | `chore(core): initialize nestjs 12 scaffolding and git quality gates` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 1 | `I-1-2` | `feat(arch): add module structure with solid layout` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 1 | `I-1-3` | `chore(core): add vitest unit and e2e scaffolding with coverage thresholds` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 1 | `I-1-4` | `chore(project): add LICENSE file` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 1 | `I-1-5` | `chore(project): add SECURITY.md policy` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 1 | `I-1-6` | `chore(project): add CHANGELOG.md` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 1 | `I-1-7` | `chore(test): add faker library for generating test data and fixtures` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 1 | `I-1-8` | `feat(core): add logger setup (ConsoleLogger in dev, JSON logger in prod via createAppLogger)` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 2 | `I-2-1` | `ci(sec): add dependabot configuration for ubuntu-24.04` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 2 | `I-2-2` | `ci(sec): add codeql workflow on ubuntu-24.04` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 2 | `I-2-3` | `ci(sec): add github actions pipeline (audit → test → coverage → docker)` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 2 | `I-2-4` | `ci(sec): add snyk workflow test` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 2 | `I-2-5` | `ci(sec): add codacy workflow` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 2 | `I-2-6` | `ci(sec): add sonar cloud workflow` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 3 | `I-3-1` | `feat(sec): add native security headers via useSecurityHeaders` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 3 | `I-3-2` | `feat(config): add typed env with joi validation` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 3 | `I-3-3` | `feat(config): add global validation pipe with whitelist and transform` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 3 | `I-3-4` | `feat(config): add openapi swagger with bearer security scheme (+ @scalar/nestjs-api-reference, setupOpenApi in separate file, executed before useSecurityHeaders; 2 instances: user/admin, admin disabled in production)` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 3 | `I-3-5` | `feat(config): add core configuration module with @nestjs/config and registerAs` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 3 | `I-3-6` | `chore(release): update package.json version badge` | ⬜ Planned |
| Phase I: Foundation, Scaffolding & Security Tooling | Step 3 | `I-3-7` | `feat(api): add openapi swagger examples via faker data` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 1 | `II-1-1` | `feat(db): setup typeorm postgres with soft delete` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 1 | `II-1-1a` | `feat(db): install typeorm postgres and register async database config` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 1 | `II-1-1b` | `feat(db): add soft-delete base entity and interface` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 1 | `II-1-1c` | `feat(db): generate and apply initial typeorm migration` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 2 | `II-2-1` | `feat(infra): setup keyv redis cache with boilerplate namespace` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 2 | `II-2-1a` | `feat(infra): install keyv redis cache dependencies and config` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 2 | `II-2-1b` | `feat(infra): register global keyv cache module with memory fallback` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 2 | `II-2-2` | `feat(infra): setup bullmq queues with memory fallback` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 2 | `II-2-2a` | `feat(infra): install bullmq and register async queue config` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 2 | `II-2-2b` | `feat(infra): add queue port and in-memory fallback adapter` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 3 | `II-3-1` | `feat(mail): integrate async email provider via bullmq queue` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 3 | `II-3-1a` | `feat(mail): define mail port and transport adapter` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 3 | `II-3-1b` | `feat(mail): add named mail queue producer and worker` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 4 | `II-4-1` | `feat(mail): add nestjs i18n handlebars email templates` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 4 | `II-4-1a` | `feat(mail): configure i18n and handlebars template engine` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 4 | `II-4-1b` | `feat(mail): add localized handlebars templates and render service` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 5 | `II-5-1` | `feat(infra): add @nestjs/config with basic configuration setup` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 5 | `II-5-2` | `feat(infra): add http client for outbound calls (basic config)` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 5 | `II-5-3` | `feat(infra): add @nestjs/throttler with basic throttle config` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 5 | `II-5-4` | `feat(infra): add idempotency (basic config)` | ⬜ Planned |
| Phase II: Data Layer, Resilience & Local Dev Fallbacks | Step 5 | `II-5-5` | `feat(infra): add resilience / circuit breaker (basic config)` | ⬜ Planned |
| Phase III: User Management | Step 1 | `III-1-1` | `feat(user): design user entity with sub claim for local and oauth identities` | ⬜ Planned |
| Phase III: User Management | Step 1 | `III-1-2` | `feat(user): add local user password constraints (argon2 + queryBuilder user info check, oauth-ready)` | ⬜ Planned |
| Phase III: User Management | Step 1 | `III-1-2a` | `feat(user): add argon2id password hasher adapter` | ⬜ Planned |
| Phase III: User Management | Step 1 | `III-1-2b` | `feat(user): add querybuilder user info check oauth-ready` | ⬜ Planned |
| Phase III: User Management | Step 2 | `III-2-1` | `feat(user): add admin apis for user add/edit/delete` | ⬜ Planned |
| Phase III: User Management | Step 2 | `III-2-1a` | `feat(user): add admin module dtos and guard placeholder` | ⬜ Planned |
| Phase III: User Management | Step 2 | `III-2-1b` | `feat(user): add admin crud controller and service` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 1 | `IV-1-1` | `feat(auth): implement local strategy with argon2 password verification` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 1 | `IV-1-1a` | `feat(auth): implement local strategy with argon2 password verification` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 1 | `IV-1-1b` | `feat(auth): expose local login endpoint` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 1 | `IV-1-2` | `feat(auth): issue and verify jwt access and refresh tokens with rs256 key pair` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 1 | `IV-1-2a` | `feat(auth): add rs256 key pair config with kid` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 1 | `IV-1-2b` | `feat(auth): issue and verify jwt access and refresh tokens with rs256 key pair` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 1 | `IV-1-2c` | `feat(auth): register jwt strategy and guard` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-1` | `feat(auth): implement refresh token mechanism` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-2` | `feat(auth): add redis token blacklist and logout revocation` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-2a` | `feat(auth): add token blacklist port and adapters` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-2b` | `feat(auth): add logout revocation` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-3` | `feat(auth): add refresh token theft detection via reuse detection` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-4` | `feat(auth): add multi-level revocation (account / device / session / user)` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-4a` | `feat(auth): add revocation scope model and account-level revocation` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-4b` | `feat(auth): add user-level revocation` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-4c` | `feat(auth): add device-level revocation` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 2 | `IV-2-4d` | `feat(auth): add session-level revocation` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 3 | `IV-3-1` | `feat(auth): implement rbac` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 3 | `IV-3-1a` | `feat(auth): add rbac role model decorator and guard` | ⬜ Planned |
| Phase IV: Basic Authentication | Step 3 | `IV-3-1b` | `feat(auth): seed roles and protect admin apis` | ⬜ Planned |
| Phase V: OAuth Integration | Step 1 | `V-1-1` | `feat(auth): add generic oauth2 strategy foundation with account merge` | ⬜ Planned |
| Phase V: OAuth Integration | Step 1 | `V-1-1a` | `feat(auth): add generic oauth2 strategy foundation` | ⬜ Planned |
| Phase V: OAuth Integration | Step 1 | `V-1-1b` | `feat(auth): add oauth link-or-create with account merge` | ⬜ Planned |
| Phase V: OAuth Integration | Step 2 | `V-2-0` | `feat(auth): add reusable oauth2 provider strategy base` | ⬜ Planned |
| Phase V: OAuth Integration | Step 2 | `V-2-1` | `feat(auth): integrate oauth2 google provider` | ⬜ Planned |
| Phase V: OAuth Integration | Step 2 | `V-2-2` | `feat(auth): integrate oauth2 microsoft provider` | ⬜ Planned |
| Phase V: OAuth Integration | Step 2 | `V-2-3` | `feat(auth): integrate oauth2 github provider` | ⬜ Planned |
| Phase V: OAuth Integration | Step 2 | `V-2-4` | `feat(auth): integrate oauth2 apple provider` | ⬜ Planned |
| Phase V: OAuth Integration | Step 2 | `V-2-5` | `feat(auth): integrate oauth2 x provider` | ⬜ Planned |
| Phase VI: End-user APIs | Step 1 | `VI-1-1` | `feat(auth): add end-user apis register/login` | ⬜ Planned |
| Phase VI: End-user APIs | Step 1 | `VI-1-1a` | `feat(auth): add end-user register api` | ⬜ Planned |
| Phase VI: End-user APIs | Step 1 | `VI-1-1b` | `feat(auth): add end-user login api` | ⬜ Planned |
| Phase VI: End-user APIs | Step 2 | `VI-2-1` | `feat(auth): add forgot/reset password apis` | ⬜ Planned |
| Phase VI: End-user APIs | Step 2 | `VI-2-1a` | `feat(auth): add forgot password request api` | ⬜ Planned |
| Phase VI: End-user APIs | Step 2 | `VI-2-1b` | `feat(auth): add reset password handler` | ⬜ Planned |
| Phase VI: End-user APIs | Step 3 | `VI-3-1` | `feat(auth): add change password api` | ⬜ Planned |
| Phase VII: Garbage Collection | Step 1 | `VII-1-1` | `feat(db): add soft delete purge cron` | ⬜ Planned |
| Phase VII: Garbage Collection | Step 1 | `VII-1-1a` | `feat(db): add soft delete purge cron setup` | ⬜ Planned |
| Phase VII: Garbage Collection | Step 1 | `VII-1-1b` | `feat(db): add soft delete purge service` | ⬜ Planned |
| Phase VII: Garbage Collection | Step 2 | `VII-2-1` | `feat(mail): add email queue abandonment and send status control` | ⬜ Planned |
| Phase VII: Garbage Collection | Step 2 | `VII-2-1a` | `feat(mail): add email queue job abandonment` | ⬜ Planned |
| Phase VII: Garbage Collection | Step 2 | `VII-2-1b` | `feat(mail): add email send status control` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 1 | `VIII-1-1` | `feat(auth): add timing attack defense with dummy hash` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 2 | `VIII-2-1` | `feat(security): add weak password check (breach list)` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 2 | `VIII-2-1a` | `feat(security): add password policy port and breach-list adapter` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 2 | `VIII-2-1b` | `feat(security): enforce weak password check in all password flows` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 3 | `VIII-3-1` | `feat(security): add mfa / 2fa` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 3 | `VIII-3-1a` | `feat(security): add mfa totp enrollment and toggle` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 3 | `VIII-3-1b` | `feat(security): add MFA login TOTP verify challenge` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 3 | `VIII-3-2` | `feat(security): add totp secrets encryption and recovery codes` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 3 | `VIII-3-2a` | `feat(security): add totp secrets encryption` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 3 | `VIII-3-2b` | `feat(security): add TOTP recovery codes` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 4 | `VIII-4-1` | `feat(security): add device token` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 4 | `VIII-4-1a` | `feat(security): add device token port and adapter` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 4 | `VIII-4-1b` | `feat(security): embed and validate device tokens` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 5 | `VIII-5-1` | `feat(security): add otp` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 5 | `VIII-5-1a` | `feat(security): add otp port and adapter` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 5 | `VIII-5-1b` | `feat(security): add otp request and verify endpoints` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 6 | `VIII-6-1` | `feat(security): add magic link` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 6 | `VIII-6-1a` | `feat(security): add magic link request flow` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 6 | `VIII-6-1b` | `feat(security): add magic link verify flow` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 7 | `VIII-7-1` | `feat(auth): add account lockout on consecutive failed attempts with user self-unlock via identity verification` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 7 | `VIII-7-1a` | `feat(auth): add account lockout on consecutive failed attempts` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 7 | `VIII-7-1b` | `feat(auth): add user self-unlock via identity verification` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 8 | `VIII-8-1` | `feat(sec): add security audit logging` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 8 | `VIII-8-1a` | `feat(sec): add security audit logging` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 8 | `VIII-8-1b` | `feat(sec): instrument sensitive events with audit logging` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 8 | `VIII-8-2` | `feat(crypto): add secrets rotation workflow` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 8 | `VIII-8-2a` | `feat(crypto): add secrets rotation service with versioning` | ⬜ Planned |
| Phase VIII: Advanced Security | Step 8 | `VIII-8-2b` | `feat(crypto): add secrets rotation workflow` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-1` | `feat(security): add sliding window rate limiting` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-2` | `feat(resilience): add circuit breaker for third party calls` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-4` | `feat(crypto): add aes-256-gcm key rotation` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-5` | `feat(common): add idempotency key middleware for critical writes` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-5a` | `feat(common): add idempotency package and config` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-5b` | `feat(common): add idempotency key middleware for critical writes` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-6` | `feat(db): add aes-256-gcm field level encryption at rest` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-6a` | `feat(crypto): add aes-256-gcm crypto util and port` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-6b` | `feat(db): add aes-256-gcm field level encryption at rest` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-7` | `feat(security): add dual rate limit (per IP + per account)` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 1 | `IX-1-8` | `feat(auth): add temporary + permanent account lockout` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 2 | `IX-2-1` | `feat(observability): add open telemetry prometheus metrics endpoint` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 2 | `IX-2-1a` | `feat(observability): bootstrap opentelemetry sdk and instrumentation` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 2 | `IX-2-1b` | `feat(observability): expose prometheus metrics endpoint` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 2 | `IX-2-2` | `docs(security): map implementation to hipaa iso27001 owasp audit` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 2 | `IX-2-3` | `feat(observability): add alerts & notifications (Telegram, Slack, Discord, operator mail)` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 2 | `IX-2-3a` | `feat(observability): add alerting module and event routing` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 2 | `IX-2-3b` | `feat(observability): add telegram slack discord notifier adapters` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 2 | `IX-2-3c` | `feat(observability): add operator email notifier adapter` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 3 | `IX-3-1` | `chore(release): update package.json version badge` | ⬜ Planned |
| Phase IX: Security Add-ons & Hardening (+ Observability & Compliance) | Step 3 | `IX-3-2` | `chore(release): tag release v12.0.0` | ⬜ Planned |
| Phase X: Custom Email & Runtime Configuration | Step 1 | `X-1-1` | `feat(mail): add custom email provider and custom configuration` | ⬜ Planned |
| Phase X: Custom Email & Runtime Configuration | Step 1 | `X-1-1a` | `feat(mail): add pluggable custom email provider adapter` | ⬜ Planned |
| Phase X: Custom Email & Runtime Configuration | Step 1 | `X-1-1b` | `feat(config): add custom runtime configuration store and reload` | ⬜ Planned |
| Phase X: Custom Email & Runtime Configuration | Step 1 | `V-2-6` | `feat(auth): add provider enable/disable toggle` | ⬜ Planned |
| Phase X: Custom Email & Runtime Configuration | Step 1 | `V-2-7` | `feat(auth): add account merge enable/disable toggle` | ⬜ Planned |
| Phase XI: Infrastructure & Benchmark | Step 1 | `XI-1-1` | `feat(infra): add production infrastructure setup` | ⬜ Planned |
| Phase XI: Infrastructure & Benchmark | Step 1 | `XI-1-1a` | `feat(infra): add production docker and deploy config` | ⬜ Planned |
| Phase XI: Infrastructure & Benchmark | Step 1 | `XI-1-1b` | `feat(infra): add production CI/CD deploy workflow and docs` | ⬜ Planned |
| Phase XI: Infrastructure & Benchmark | Step 1 | `XI-1-2` | `chore(perf): add performance benchmark` | ⬜ Planned |

## Purpose

Design and build a production-ready, highly secure NestJS 12 enterprise boilerplate that delivers secure-by-default foundation capabilities across architecture, data persistence, zero-trust security, multi-tier auth, dev fallbacks, testing, and delivery pipelines.

**Finalized Goal**: Build a NestJS user-management boilerplate where users can authenticate via email + password (local account) or OpenID (federated). Start from the simplest NestJS implementation (passport-jwt basic auth) and then add advanced security in later phases, avoiding over-engineering. Use DDD/Solid principles so encryption/decryption mechanisms can be swapped easily as needed.

## Phases and Steps

Execution proceeds in strict order, one phase at a time; phases with independent tasks may run in parallel when they do not block each other:

**Phase 0 → Phase I → Phase II → Phase III → Phase IV → Phase V → Phase VI → Phase VII → Phase VIII → Phase IX → Phase X → Phase XI**

Within each phase, steps execute in ascending chronological order.

⚠️ **Phase Gate Rule (Pause & Push Policy)**:
- At the end of every completed **step**, execution **MUST PAUSE**. The developer must run full automated test suites (Unit + E2E), verify coverage thresholds, execute continuous package security audit & version sync, `git push` the step branch, and merge the Pull Request (PR) before commencing the next step.
- Before commencing the next step, prefer built-in libraries available in NestJS v12 such as config, http-client, idempotency, resilience, and split config files into smaller ones, each preferably exporting the config to import into an `as Provider()` for the Async Module options (`.forRootAsync`, `.registerAsync`).

## Final Decisions Log (New Draft)

1. **Architecture**: add task `I-1-2` – module structure with solid layout, so hashing / encryption / token services can be swapped easily (Solid friendly, no DDD).

2. **Basic auth first**: Phase IV basic only (local + JWT RS256); compliance tasks deferred to Phase X.

3. **Security hardening**: merge anti-scanning (`VIII-1-1`), weak password (`VIII-2-1`), MFA (`VIII-3-1`), rate limiting (`IX-1-1`), lockout (`VIII-7-1`), idempotency (`IX-1-5`) into one hardening step after basic auth.

4. **JWT**: RS256 key pair + kid (`IV-1-2` basic, rotation via `IX-1-4`).

5. **Blacklist**: Redis + memory fallback + TTL cleanup (`IV-2-2`).

6. **Field encryption**: evaluate before implementing (`IX-1-6`).

7. **OAuth2**: generic foundation plus a common reusable provider base (`V-2-0`, strategy factory + standard profile normalizer); each provider task (`V-2-1` … `V-2-5`) is a thin adapter over that base; merge rules with verified-email gate; set password for OAuth-created accounts; no duplicate users per email.

8. **Utils**: single folder `src/common/utils/` with multiple util files (password-hashing, encryption, jwt).

9. **Provider toggle** (`V-2-6`): allow / disable registration / login per provider.

10. **Account merge toggle** (`V-2-7`): allow / disable user account merge.

11. **Phase X – Custom (Email & Runtime Config)**: Phase X focuses on custom email provider and custom configuration when the system is running (runtime), not only email config.

12. **Infrastructure & Benchmark**: Phase XI focuses on production infrastructure setup and performance benchmark.

## Execution Order

**Phase 0 → Phase I → Phase II → Phase III → Phase IV → Phase V → Phase VI → Phase VII → Phase VIII → Phase IX → Phase X → Phase XI**

Execution order follows the simplified phase structure (easy → hard, with places where parallel execution is allowed):

1. **Strict sequential**: Phase 0 → Phase I → Phase II → Phase III → Phase IV.

2. **Parallel**: Phase II — the steps/tasks of the phase may be implemented in parallel (checkout branch/task from a common base).

3. **Parallel stream**: Phase V & Phase VI & Phase VII run **in parallel** (the steps/tasks of each phase may also run in parallel if they do not lock each other; checkout branch/task from a common base).

4. **Parallel**: Phase VIII — the steps/tasks of the phase may be implemented in parallel (checkout branch/task from a common base).

5. **Strict sequential**: Phase IX → Phase X (Phase X: custom email, custom config as needed).

→ **Final flow**: Phase 0 → Phase I → Phase II → Phase III → Phase IV → Phase V ∥ Phase VI ∥ Phase VII → Phase VIII → Phase IX → Phase X → Phase XI.

**Parallel execution policy**: when tasks do not lock each other, the developer may checkout a separate branch (from a common base branch/commit) and implement in parallel; each task = 1 branch/commit; then merge back to base before the next phase according to the Phase Gate.

## Branch Strategy per Step

Every implementation **step** is developed on its own dedicated step branch, created from the integration base `dev` (branched from `master`). The step branch remains open until the **Phase Gate** (end of step) — after full automated test suites (Unit + E2E), coverage thresholds, security audit and version sync pass, the developer must `git push` the step branch and merge the Pull Request (PR) before commencing the next step.

**Branch naming convention**: `feat/<scope>-<kebab-subject>` (e.g., commit `feat(auth): implement local strategy with argon2 password verification` → branch `feat/auth-local-strategy-argon2`).

## Release & Pull Request Timeline

- **Naming**: Repository short name: `nestjs-boilerplate` (GitHub: `VnDevTop/nestjs-boilerplate`); step branches are cut from `dev` and named `feat/<scope>-<kebab-subject>` (Phase 0 uses `chore/<scope>-<kebab-subject>`); release tag format: `vX.Y.Z` (current release target: `v12.0.0`, not yet tagged).

- **Push & PR**: After each completed **step** (Phase Gate) → run full test suites, verify coverage thresholds, execute package security audit & version sync → `git push` the step branch → create Pull Request (PR) → merge PR before commencing the next step.

- **Release version**: After Phase IX completion → task `IX-3-2` → tag release `v12.0.0` → update version badge in package.json (task `IX-3-1`).

## Security & Compliance Traceability Matrix

| Security & Compliance Requirement | HIPAA §164.312 Target | ISO 27001 | OWASP ASVS | Implementation Location |
| :----------------------------------------- | :---------------------------- | :-------- | :--------- | :----------------------------------- |
| **Argon2id & Timing Attack Mitigation**    | §164.312(d) Access Control    | A.9.4     | V2.1       | `src/modules/auth/crypto/`           |
| **Native Security Headers**                | §164.312(e) Transmission      | A.13.1    | V14.4      | `src/main.ts` (`useSecurityHeaders`) |
| **Field-Level AES-256-GCM Encryption**     | §164.312(a)(2) Encryption     | A.10.1    | V8.3       | `src/common/crypto/`                 |
| **JWT Key Rotation (kid) & Revocation**  | §164.312(d) Session Integrity | A.9.2     | V3.5       | `src/modules/auth/strategies/`       |
| **Redis Blacklist & Dev Fallbacks**        | §164.312(c) Integrity Control | A.12.3    | V3.3       | `src/common/cache/`                  |
| **CodeQL & Dependabot on ubuntu-24.04**   | §164.312(b) Audit Controls    | A.12.6    | V14.2      | `.github/workflows/`                 |
| **Idempotency & Rate Limiting**            | §164.312(c) System Integrity  | A.12.1    | V11.1      | `src/common/middleware/`             |
