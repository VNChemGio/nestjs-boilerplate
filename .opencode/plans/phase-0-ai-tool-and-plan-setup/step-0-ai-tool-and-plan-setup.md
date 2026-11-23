# Task Breakdown - Phase 0: AI Tool & Plan Setup - Step 0: AI Tool & Plan Setup

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: no application code in this step; keep configuration/CI/docs simple per the roadmap's "Architecture & Design Conventions (DDD + SOLID)" (pragmatic, no over-engineering).
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format: `Description`, `CLI(s)`, `Package(s)`, `File(s)/Folder(s)` (Added / Modified / Deleted), `Branch`, `Commit`, `Testing`
> **Execution**: Strict sequential (Phase 0 first)
> **Branch base**: `dev` (branched from `master`)
> **Branch prefix**: `chore/...` (Phase 0 tooling)
> **Split mapping**: roadmap `0-0-1` → `0-0-1a` + `0-0-1b` (two distinct, independently committable deliverables: config bootstrap vs. instruction registration); roadmap `0-0-2` → `0-0-2` (single prompt template = one commit). Task IDs below are the final split IDs; the roadmap keeps the umbrella IDs.

## Step Summary
Establish the AI tooling configuration and prompt templates that drive the roadmap-driven planning and implementation workflow. No application code is written in this phase. Three atomic commits total: two for the OpenCode tool configuration (`opencode.json`) and one for the prompt template.

## Atomic Tasks

### `0-0-1a` — Bootstrap root OpenCode config (`$schema` + `model`)
- **Description**: Create the root `opencode.json` with a valid `$schema` (`https://opencode.ai/config.json`) and a pinned `model` (the resolvable `<provider>/<model>` id used by this project, e.g. `opencode/hy4-flash-free`). This establishes the OpenCode CLI tool configuration for the repo before any project instructions are registered. Atomic checks: (a) config file exists at repo root, (b) `$schema` is the official OpenCode schema URL, (c) `model` is set to a resolvable `<provider>/<model>` id, (d) file parses as valid JSON.
- **CLI(s)**: `npx opencode --help` (confirm the repo-root config is discovered); `npx opencode models` (confirm the pinned model id resolves); config authored directly, no generator CLI.
- **Package(s)**: `None` — OpenCode CLI is invoked via `npx opencode`; no dependency is added to `package.json`.
- **File(s)/Folder(s)**:
  - **Added**: `opencode.json`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `chore/ai-bootstrap-opencode-config`
- **Commit**: `chore(ai): add root opencode config with schema and model`
- **Testing**: No unit/E2E code. Validate `opencode.json` parses as JSON and contains `$schema` + `model`; run `npx opencode models` to confirm the model id resolves.

### `0-0-1b` — Register roadmap and plan files as project instructions
- **Description**: Extend `opencode.json` `instructions` array with `.opencode/plans/roadmap.md` (the source of truth) and the plan files under `.opencode/plans/` so OpenCode loads the roadmap as a project instruction on every launch. Atomic checks: (a) `instructions` contains `.opencode/plans/roadmap.md`, (b) the referenced file is present and readable, (c) OpenCode starts with the roadmap loaded as an instruction.
- **CLI(s)**: `npx opencode` (launch and confirm the roadmap loads as an instruction); config authored directly.
- **Package(s)**: `None`.
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `opencode.json` (`instructions` array)
  - **Deleted**: `None`
- **Branch**: `chore/ai-register-roadmap-instructions`
- **Commit**: `chore(ai): register roadmap and plan files as project instructions`
- **Testing**: No unit/E2E code. Assert `instructions` includes the roadmap path; run `npx opencode` and confirm the roadmap is present among the loaded instructions.

### `0-0-2` — Add AI prompt template for roadmap planning workflow
- **Description**: Add prompt template `.opencode/prompts/roadmap-step.md` implementing the Plan → Implement breakdown workflow (frontmatter `description`, Source of truth, Mission, Procedure, Constraints, Phase Gate, Output). The template documents the 7-field atomic-task format and the `PHASE-STEP-TASKID` naming convention, enabling `opencode run --prompt "roadmap-step"`. Atomic checks: (a) file created under `.opencode/prompts/`, (b) frontmatter `description` present, (c) references the roadmap as source of truth, (d) lists all 7 atomic-task fields, (e) is consumed by `npx opencode run --prompt "roadmap-step"`.
- **CLI(s)**: `mkdir -p .opencode/prompts` (if needed); `npx opencode run --prompt "roadmap-step"` (verify consumption); template authored directly.
- **Package(s)**: `None` — prompt template is a markdown file, no npm package.
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `.opencode/prompts/roadmap-step.md` (present on `dev`; refresh frontmatter/workflow sections only)
  - **Deleted**: `None`
- **Branch**: `chore/ai-add-roadmap-step-prompt`
- **Commit**: `chore(ai): add ai prompt templates for roadmap planning workflow`
- **Testing**: No unit/E2E code. Verify frontmatter parses and that `npx opencode run --prompt "roadmap-step"` consumes the template and emits the expected 7-field atomic-task breakdown format.

## Phase Gate (end of step)
- [x] Full unit tests (`*.spec.ts`) + coverage thresholds — N/A for tooling phase
- [x] E2E tests (`*.e2e-spec.ts`) — N/A
- [x] Security audit & version sync — N/A
- [x] `git push` step branch → PR → merge into `dev`
- [x] Update Status `⬜ Planned → ✅ Done` for `0-0-1`, `0-0-2` in roadmap Unified Table
