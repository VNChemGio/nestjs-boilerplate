---
description: Roadmap-driven task breakdown for the current step (Plan -> Implement)
---

# Roadmap-Step Prompt: Break Down Current Step into Atomic Tasks

You are the planning agent for the **Enterprise Security & Reliability Boilerplate** (`nestjs-boilerplate`, NestJS 12.6.0 + Secure Auth).

## Source of Truth
- `.opencode/plans/roadmap.md` (English) — also registered in `.opencode/plans/opencode.json` `instructions`.
- "Executive Summary & Task List (Unified Table)" is the authoritative task list with `Task ID` and `Status` columns.
- Living document: update the `Status` column (`⬜ Planned` → `✅ Done`) when a task completes.

## Mission
Break down the **current step** into the smallest atomic tasks using the task format:

**`PHASE-STEP-TASKID`** (e.g., `III-1-2` = Phase III, Step 1, Task 2; `0-0-1` = Phase 0, Step 0, Task 1).

## Procedure
1. Read `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)" → determine the current phase/step from the header (`Project State`, `Status`) and the last completed step.
2. Split the step into atomic tasks (smallest possible, one commit per task), reusing the existing Task IDs where the step is already listed.
3. For each task, specify:
   - **Description**: atomic, testable, no over-engineering, aligned with the Final Decisions Log.
   - **Branch**: `<type>/<scope>-<kebab-subject>` cut from `dev` (`feat/...` for implementation, `chore/...` for Phase 0 tooling; e.g. `feat/auth-local-strategy-argon2`).
   - **Commit**: `type(scope): subject`.
   - **Testing**: Unit tests (`*.spec.ts`) + coverage thresholds + E2E tests (`*.e2e-spec.ts`).
4. Persist the breakdown to `.opencode/plans/<phase>-<step>/task-breakdown.md`.
5. Update the task `Status` in the Unified Table of `.opencode/plans/roadmap.md` when completed (`⬜ Planned` → `✅ Done`).

## Constraints
- Do NOT write implementation code during planning.
- Phase order: Phase 0 → Phase I → Phase II → Phase III → Phase IV → Phase V ∥ Phase VI ∥ Phase VII → Phase VIII → Phase IX → Phase X → Phase XI.
- Parallelism: tasks/steps inside Phase II, Phase V/VI/VII and Phase VIII may run in parallel from a common `dev` base; all other phases are strict sequential.
- Branch strategy: dedicated step branch from `dev` (branched from `master`); when tasks run in parallel, one branch per task from a common `dev` base; merge back at the Phase Gate.

## Phase Gate
- Pause at end of every step: full tests (Unit + E2E) → coverage thresholds → security audit & version sync → `git push` step branch → PR merge into `dev` → next step.

## Output
- Return the current step's task breakdown in markdown.
