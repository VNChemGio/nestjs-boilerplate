# Task Breakdown - Phase 3 (III): User Management - Step 2: Admin User APIs

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit
> **Task format**: each atomic task uses the 7-field format — Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing
> **Execution**: Strict sequential (Phase III Step 2 after Step 1)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Split mapping**: roadmap `III-2-1` → `III-2-1a` (module, DTOs and guard) + `III-2-1b` (CRUD controller/service and tests), each independently committable.

## Step Summary
Expose admin CRUD APIs for user add/edit/delete, protected and documented.

## Atomic Tasks

### `III-2-1a` — Add admin module, DTOs and guard placeholder
- **Description**: Create the `AdminModule`, request DTOs (Standard Schema / `class-validator` as configured) for create/update, and an admin guard placeholder; export the user repository/service needed by the CRUD handlers from `III-1-1`/`III-1-2b`. Atomic checks: (a) admin module registered, (b) DTO validation with whitelist/transform, (c) guard placeholder available, (d) user repository exported for admin use.
- **CLI(s)**: `npx nest g module admin`
- **Package(s)**: `None` (reuses `class-validator`/`class-transformer` from `I-3-3`)
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/admin/admin.module.ts`, `src/modules/admin/dto/create-user.dto.ts`, `src/modules/admin/dto/update-user.dto.ts`, `src/modules/admin/guards/admin.guard.ts`
  - **Modified**: `src/app.module.ts`, `src/modules/user/user.module.ts` (export repository for admin use)
  - **Deleted**: `None`
- **Branch**: `feat/user-admin-module-dtos-guard`
- **Commit**: `feat(user): add admin module dtos and guard placeholder`
- **Testing**: unit test DTO validation (whitelist/transform) and guard placeholder behavior; `npm run typecheck` and `npm run lint`.

### `III-2-1b` — Add admin CRUD controller and service
- **Description**: Implement `POST /admin/users`, `PATCH /admin/users/:id`, `DELETE /admin/users/:id` using the user repository port from `III-1-1`, Swagger docs with Faker examples from `I-3-7`, the guard placeholder from `III-2-1a`, and soft delete from `II-1-1b` on DELETE. Atomic checks: (a) three endpoints, (b) soft delete used, (c) guard applied, (d) Swagger metadata present.
- **CLI(s)**: `npx nest g controller admin/users --no-spec`, `npx nest g service admin/users --no-spec`
- **Package(s)**: `None` (reuses `typeorm` from `II-1-1a`, `@nestjs/swagger` + Faker from `I-3-4a`/`I-1-7`)
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/admin/controllers/admin-users.controller.ts`, `src/modules/admin/services/admin-users.service.ts`, `src/modules/admin/controllers/admin-users.controller.spec.ts`, `src/modules/admin/services/admin-users.service.spec.ts`, `test/admin-users.e2e-spec.ts`
  - **Modified**: `src/modules/admin/admin.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/user-admin-crud-apis`
- **Commit**: `feat(user): add admin crud controller and service`
- **Testing**: unit tests for service CRUD with a mocked repository (`vi.fn()`); E2E tests for all three endpoints (201/200/200, validation error 400, not-found 404, soft-delete on DELETE) via `npm run test:e2e -- admin-users`; coverage thresholds; `npm run typecheck` and `npm run lint`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `III-2-1a`, `III-2-1b` → `✅ Done`

