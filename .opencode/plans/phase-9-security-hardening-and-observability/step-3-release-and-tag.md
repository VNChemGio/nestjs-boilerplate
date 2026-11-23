# Task Breakdown - Phase 9 (IX): Security Hardening & Observability - Step 3: Release & Tag

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: no application code in this step; keep configuration/CI/docs simple per the roadmap's "Architecture & Design Conventions (DDD + SOLID)" (pragmatic, no over-engineering).
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; each atomic task uses the 7-field format (Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing)
> **Execution**: Strict sequential Phase IX Step 3 after Step 2; Phase IX → Phase X strict sequential
> **Branch base**: `dev`; **Branch prefix**: `chore/...`

## Step Summary
Finalize the v12.0.0 release after Phase IX: update version badge and tag the release. Both release tasks remain separate and independently committable.

## Atomic Tasks

### `IX-3-1` — Update package.json version badge
- **Description**: Set `package.json` version to `12.0.0`, sync the version badge in `README.md`, and add a CHANGELOG entry. Atomic checks: (a) version = 12.0.0, (b) badge consistent, (c) CHANGELOG entry added, (d) lockfile version synced.
- **CLI(s)**: `npm version 12.0.0 --no-git-tag-version` (updates `package.json`/`package-lock.json` without creating a tag), `npm run lint`
- **Package(s)**: `None` — version metadata change only; no new dependency.
- **File(s)/Folder(s)**:
  - **Added**: `None` (new CHANGELOG section within existing file)
  - **Modified**: `package.json`, `package-lock.json`, `README.md` (version badge), `CHANGELOG.md`
  - **Deleted**: `None`
- **Branch**: `chore/release-update-version-badge-v12`
- **Commit**: `chore(release): update package.json version badge`
- **Testing**: No unit/E2E code; verify version consistency across badge, `package.json`, lockfile, and CHANGELOG.

### `IX-3-2` — Tag release v12.0.0
- **Description**: Create an annotated git tag `v12.0.0` on the release commit from `dev`, with release notes summarizing the Phase IX security/hardening/observability features. Atomic checks: (a) annotated tag exists, (b) points to correct commit, (c) notes published, (d) tag pushed to origin.
- **CLI(s)**: `git tag -a v12.0.0 -m "Release v12.0.0"`, `git push origin v12.0.0`, `gh release create v12.0.0 --generate-notes`
- **Package(s)**: `None`
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `chore/release-tag-v12-0-0`
- **Commit**: `chore(release): tag release v12.0.0`
- **Testing**: No unit/E2E code; verify with `git tag`, `git show v12.0.0`, and that the GitHub release notes are published.

## Phase Gate (end of step)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `IX-3-1`, `IX-3-2` → `✅ Done`
