# Task Breakdown - Phase 5 (V): OAuth Integration - Step 1: OAuth Foundation

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Parallel stream Phase V ∥ VI ∥ VII (from common `dev` base); within phase, steps sequential
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Decision log**: Generic OAuth2 + multiple providers (1 task each); merge rules with verified-email gate; set password for OAuth-created accounts; no duplicate users per email. Provider/merge toggles are documented here for context but executed in Phase X (`V-2-6`, `V-2-7`). Roadmap `V-1-1` is split into `V-1-1a` (generic strategy/guard/normalizer port) + `V-1-1b` (link-or-create use-case and merge rules), each independently committable.

## Step Summary
Build the generic OAuth2 strategy foundation with account merge logic, reused by all concrete providers in Step 2.

## Atomic Tasks

### `V-1-1a` — Add generic OAuth2 strategy, guard and profile normalizer port
- **Description**: Create an abstract/generic OAuth2 strategy + guard that normalizes every provider profile to the `sub` claim through a profile-normalizer port and enforces a verified-email gate. Atomic checks: (a) reusable generic strategy base + profile normalizer port, (b) unverified email rejected without leaking provider data, (c) guard registered through `OAuthModule`.
- **CLI(s)**: `npx nest g module oauth --no-spec`, `npx nest g guard oauth2 --no-spec`
- **Package(s)**: installed with `npm install @nestjs/passport passport passport-oauth2` and `npm install -D @types/passport-oauth2`; reuses `@nestjs/jwt` from Phase IV.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/oauth/oauth.module.ts`, `src/modules/auth/oauth/strategies/oauth2.strategy.ts`, `src/modules/auth/oauth/guards/oauth2.guard.ts`, `src/modules/auth/oauth/ports/oauth-profile-normalizer.port.ts`, `src/modules/auth/oauth/strategies/oauth2.strategy.spec.ts`
  - **Modified**: `src/modules/auth/auth.module.ts`, `src/app.module.ts`, `package.json`, `package-lock.json`
  - **Deleted**: None
- **Branch**: `feat/auth-oauth2-generic-strategy`
- **Commit**: `feat(auth): add generic oauth2 strategy foundation`
- **Testing**: Unit tests (Vitest, `vi.fn()`) cover profile normalization to `sub` and rejection of unverified emails; full unit suite, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `V-1-1b` — Add OAuth link-or-create use-case with account merge
- **Description**: Add the link-or-create use-case that links to an existing verified-email user or creates a new one with a generated password via the Argon2 port, so no duplicate users are created per email; errors map to `UnauthorizedException` without leaking provider data. Atomic checks: (a) existing verified user linked not duplicated, (b) new OAuth users get a random password via Argon2, (c) errors map to `UnauthorizedException`.
- **CLI(s)**: `None (code only)`
- **Package(s)**: `None` — reuses `@nestjs/passport`/`passport-oauth2` from `V-1-1a` and the Argon2 port from `III-1-2a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/oauth/use-cases/link-or-create-oauth-user.use-case.ts`, `src/modules/auth/oauth/use-cases/link-or-create-oauth-user.use-case.spec.ts`, `test/oauth-foundation.e2e-spec.ts`
  - **Modified**: `src/modules/user/domain/entities/user.entity.ts`, `src/modules/auth/oauth/oauth.module.ts`
  - **Deleted**: None
- **Branch**: `feat/auth-oauth2-account-merge`
- **Commit**: `feat(auth): add oauth link-or-create with account merge`
- **Testing**: Unit tests cover merge with an existing verified email, creation of a new user with a password set, and rejection on unverified email; E2E `npm run test:e2e` checks the callback flow with a mocked provider profile; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `V-1-1a`, `V-1-1b` → `✅ Done`
