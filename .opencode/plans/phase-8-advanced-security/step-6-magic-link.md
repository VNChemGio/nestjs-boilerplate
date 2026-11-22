# Task Breakdown - Phase 8 (VIII): Advanced Security - Step 6: Magic Link

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit, documented with the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Phase VIII tasks may run in parallel (from common `dev` base)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Split mapping**: roadmap `VIII-6-1` → `VIII-6-1a` (magic-link request flow) + `VIII-6-1b` (verify/exchange flow), each independently committable.

## Step Summary
Add passwordless magic-link authentication using signed tokens delivered by email.

## Atomic Tasks

### `VIII-6-1a` — Add the magic-link request flow
- **Description**: Implement `POST /auth/magic-link` to email a signed, short-lived, single-use link using the JWT util/token-issuer port, a mail template and config-driven TTL. Atomic checks: (a) signed expiring token with a purpose claim, (b) single-use enforced via cache, (c) email sent through the queue + template.
- **CLI(s)**: `None (config/code only)` — reuses `src/common/utils/jwt.ts`, `@nestjs/cache-manager`, and the BullMQ mail provider.
- **Package(s)**: `None` — reuses the existing JWT util, `@nestjs/cache-manager`, `@nestjs/bullmq`; no new npm package.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/use-cases/request-magic-link.use-case.ts`, `src/modules/auth/use-cases/request-magic-link.use-case.spec.ts`, `src/modules/auth/interfaces/magic-link.controller.ts`, `src/modules/mail/templates/magic-link.hbs`, `src/config/security/magic-link.config.ts`
  - **Modified**: `src/modules/auth/auth.module.ts`, `.env.example`
  - **Deleted**: None
- **Branch**: `feat/security-magic-link-request`
- **Commit**: `feat(security): add magic link request flow`
- **Testing**: Unit test token validity/signature, expiry, single-use and mail enqueue (`vi.fn()`); coverage thresholds, `npm run typecheck`, `npm run lint`.

### `VIII-6-1b` — Add the magic-link verify/exchange flow
- **Description**: Implement `GET /auth/magic-link/verify` to consume the link token and exchange it for the normal access/refresh token pair, rejecting replay. Atomic checks: (a) verify issues standard tokens, (b) replay fails, (c) consumed token invalidated via cache.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — reuses the token util and request flow from `VIII-6-1a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/use-cases/verify-magic-link.use-case.ts`, `src/modules/auth/use-cases/verify-magic-link.use-case.spec.ts`, `test/magic-link.e2e-spec.ts`
  - **Modified**: `src/modules/auth/auth.module.ts`, `src/modules/auth/interfaces/magic-link.controller.ts`
  - **Deleted**: None
- **Branch**: `feat/security-magic-link-verify`
- **Commit**: `feat(security): add magic link verify flow`
- **Testing**: E2E test request → verify issues tokens and replay fails (mock mail queue); full unit + E2E suites, coverage thresholds, `npm run typecheck`, `npm run lint`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `VIII-6-1a`, `VIII-6-1b` → `✅ Done`
