# Task Breakdown - Phase 3 (III): User Management - Step 1: User Domain Model

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit
> **Task format**: each atomic task uses the 7-field format — Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing
> **Execution**: Strict sequential Phase II → III → IV
> **Branch base**: `dev`; **Branch prefix**: `feat/...`
> **Split mapping**: roadmap `III-1-2` → `III-1-2a` (Argon2id hasher port binding) + `III-1-2b` (queryBuilder user-info check + password column), each independently committable.

## Step Summary
Design the user entity supporting both local and OAuth identities via a `sub` claim, with Argon2 password constraints and an OAuth-ready shape.

## Atomic Tasks

### `III-1-1` — Design user entity with sub claim for local and oauth identities
- **Description**: Define the User entity/schema (extending the soft-delete base entity from `II-1-1b`) with a `sub` (subject) column that uniquely identifies local and federated identities, a unique email gate, and fields for provider linkage (`provider`, `providerAccountId`, identity type). Atomic checks: (a) `sub` column present + unique, (b) email unique, (c) supports multiple identity types, (d) entity registered with TypeORM.
- **CLI(s)**: `npx nest g module user`
- **Package(s)**: `None` (uses `typeorm` from `II-1-1a` and the base entity from `II-1-1b`)
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/user/domain/entities/user.entity.ts`, `src/modules/user/domain/entities/identity-provider.enum.ts`, `src/modules/user/domain/repositories/user.repository.port.ts`, `src/modules/user/user.module.ts`, `src/modules/user/domain/entities/user.entity.spec.ts`
  - **Modified**: `src/config/data-source.ts` (register the entity)
  - **Deleted**: `None`
- **Branch**: `feat/user-entity-sub-claim-identities`
- **Commit**: `feat(user): design user entity with sub claim for local and oauth identities`
- **Testing**: unit test entity construction and column/uniqueness metadata (`npm test -- src/modules/user`); E2E test duplicate `sub`/email rejected against test Postgres (`npm run test:e2e -- user`); `npm run typecheck`.

### `III-1-2a` — Add Argon2id password hasher adapter
- **Description**: Install `argon2` and provide an Argon2id adapter bound to the existing `PASSWORD_HASHER` port from `I-1-2`, replacing the scrypt scaffold binding for local accounts; hash parameters come from typed config. Atomic checks: (a) Argon2id adapter implements the port, (b) the port is rebound to the new adapter, (c) hashes are self-contained and verify correctly, (d) no raw password is logged.
- **CLI(s)**: `npm install argon2`
- **Package(s)**: installed with `npm install argon2` — Argon2id hasher plugged into the existing `PASSWORD_HASHER` port token (introduced in Phase I via `src/modules/shared/`); no new port needed.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/user/infrastructure/adapters/argon2-password-hasher.adapter.ts`, `src/modules/user/infrastructure/adapters/argon2-password-hasher.adapter.spec.ts`
  - **Modified**: `src/modules/user/user.module.ts` (bind `PASSWORD_HASHER` to the Argon2 adapter), `src/modules/shared/shared.module.ts`, `package.json`, `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `feat/user-argon2-password-hasher`
- **Commit**: `feat(user): add argon2id password hasher adapter`
- **Testing**: unit test real Argon2 hash → verify through the port with a `vi.fn()` spy; wrong password returns `false`; `npm test -- src/modules/user`; coverage thresholds; `npm run typecheck`.

### `III-1-2b` — Add queryBuilder user-info check (oauth-ready)
- **Description**: Add a nullable, `select: false` password column for local accounts (federated users have none) and a queryBuilder-based user-info check helper for login/lookup that works for both local and OAuth users. Atomic checks: (a) password nullable for OAuth users, (b) password never selected by default, (c) queryBuilder info check returns the right shape for both identity types.
- **CLI(s)**: `None (config/code only)`
- **Package(s)**: `None` — uses `typeorm` installed in `II-1-1a` and the Argon2 adapter from `III-1-2a`.
- **File(s)/Folder(s)**:
  - **Added**: `src/modules/user/infrastructure/repositories/typeorm-user-info.repository.ts`, `src/modules/user/infrastructure/repositories/typeorm-user-info.repository.spec.ts`, `src/modules/user/application/queries/user-info.query.ts`
  - **Modified**: `src/modules/user/domain/entities/user.entity.ts`, `src/modules/user/user.module.ts`
  - **Deleted**: `None`
- **Branch**: `feat/user-querybuilder-user-info-check`
- **Commit**: `feat(user): add querybuilder user info check oauth-ready`
- **Testing**: unit test the queryBuilder helper returning the correct user-info shape for local vs OAuth users and that password is excluded from default selects; `npm test -- src/modules/user`; coverage thresholds; `npm run typecheck`.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `III-1-1`, `III-1-2a`, `III-1-2b` → `✅ Done`

