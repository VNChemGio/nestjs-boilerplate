# Task Breakdown - Phase 4 (IV): Basic Authentication - Step 3: Authorization (RBAC)

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format: **Description**, **CLI(s)**, **Package(s)**, **File(s)/Folder(s)**, **Branch**, **Commit**, **Testing**
> **Execution**: Strict sequential (Phase IV Step 3 after Step 2)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Split mapping**: roadmap `IV-3-1` → `IV-3-1a` (role model, decorator and guard) + `IV-3-1b` (role seeding and admin API protection), each independently committable.

## Step Summary
Implement role-based access control (RBAC) on top of authenticated identities.

## Atomic Tasks

### `IV-3-1a` — Add RBAC role model, decorator and guard
- **Description**: Define the roles/permissions model, a `@Roles()` decorator and a `RolesGuard` that reads verified JWT claims; allow/deny by role and handle missing claims while unauthenticated requests still return 401 rather than 403. Atomic checks: (a) roles enum/entity, (b) decorator + guard registered globally or per-controller, (c) permission check reads verified JWT claims, (d) unauthenticated requests still return 401.
- **CLI(s)**: `npx nest g guard roles --no-spec`, `npx nest g decorator roles --no-spec` (fall back to a hand-written decorator if the CLI generator is unavailable)
- **Package(s)**: `None` — implemented with first-party `@nestjs/common` guards/decorators; no new package.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/domain/role.enum.ts`, `src/modules/auth/decorators/roles.decorator.ts`, `src/modules/auth/guards/roles.guard.ts`, `src/modules/auth/guards/roles.guard.spec.ts`
  - **Modified**: `src/modules/auth/auth.module.ts`, `src/common/utils/jwt.ts`
  - **Deleted**: None
- **Branch**: `feat/auth-rbac-model-guard`
- **Commit**: `feat(auth): add rbac role model decorator and guard`
- **Testing**: Unit tests (Vitest, `vi.fn()`) verify the guard allows/denies by role, handles missing claims and leaves unauthenticated requests as 401; full unit suite, coverage thresholds, `npm run lint`, `npm run typecheck`.

### `IV-3-1b` — Seed roles and protect admin APIs
- **Description**: Seed the default roles and apply the `@Roles()` decorator/RolesGuard from `IV-3-1a` to the admin user CRUD endpoints from `III-2-1b`. Atomic checks: (a) roles seeded, (b) admin routes guarded, (c) admin returns 200, non-admin 403, no token 401.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — reuses the guard from `IV-3-1a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/auth/seeds/roles.seed.ts`, `test/auth-rbac.e2e-spec.ts`
  - **Modified**: `src/app.module.ts`, `src/modules/auth/auth.module.ts`, `src/modules/admin/controllers/admin-users.controller.ts`
  - **Deleted**: None
- **Branch**: `feat/auth-rbac-admin-protection`
- **Commit**: `feat(auth): seed roles and protect admin apis`
- **Testing**: E2E `npm run test:e2e` asserts the admin endpoint returns 200 for an admin, 403 for a non-admin, 401 for no token; full unit + E2E suites, coverage thresholds, `npm run lint`, `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `IV-3-1a`, `IV-3-1b` → `✅ Done`
