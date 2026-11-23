# Task Breakdown - Phase 1 (I): Foundation & Security Tooling - Step 2: Security Tooling & CI

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: no application code in this step; keep configuration/CI/docs simple per the roadmap's "Architecture & Design Conventions (DDD + SOLID)" (pragmatic, no over-engineering).
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; every atomic task uses the 7-field format: `Description`, `CLI(s)`, `Package(s)`, `File(s)/Folder(s)`, `Branch`, `Commit`, `Testing`
> **Execution**: Strict sequential within Phase I (merge each task before cutting the next branch)
> **Branch base**: `dev`; **Branch prefix**: `ci/...`
> **Split note**: umbrella roadmap task `I-2-3` (audit → test → coverage → docker) is split into `I-2-3a` … `I-2-3d`, one sub-task per pipeline stage; the roadmap Unified Table keeps `I-2-3` as the source-of-truth ID.

## Step Summary
Add repository security automation: Dependabot, CodeQL, the main GitHub Actions pipeline (audit → test → coverage → docker, split into four atomic stage commits), Snyk, Codacy, and SonarCloud — all targeting `ubuntu-24.04`.

## Atomic Tasks

### `I-2-1` — Add Dependabot configuration for ubuntu-24.04
- **Description**: Add `.github/dependabot.yml` with two ecosystems: `npm` (root `/`, weekly schedule, grouped minor/patch updates, `dependencies` label, reviewers/assignees) and `github-actions` (root `/`, weekly schedule, grouped updates). Add a YAML comment noting the CI runner baseline is `ubuntu-24.04`. Atomic checks: (a) file is valid YAML, (b) both `package-ecosystem` entries present, (c) `schedule.interval: weekly`, `groups` and labels/reviewers configured.
- **CLI(s)**: `mkdir -p .github`; `yamllint .github/dependabot.yml` (or `npx prettier --check .github/dependabot.yml` using the formatter from `I-1-1b`).
- **Package(s)**: `None` — configuration file only; no new npm dependency.
- **File(s)/Folder(s)**:
  - **Added**: `.github/dependabot.yml`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `ci/sec-dependabot-config`
- **Commit**: `ci(sec): add dependabot configuration for ubuntu-24.04`
- **Testing**: YAML lint/parse validation; no application unit/E2E code. Verify both ecosystems and the weekly schedule manually.

### `I-2-2` — Add CodeQL workflow on ubuntu-24.04
- **Description**: Add `.github/workflows/codeql.yml` with `runs-on: ubuntu-24.04`, a `javascript-typescript` language matrix, least-privilege permissions (`contents: read`, `actions: read`, `security-events: write`), and push/PR (to `dev`/`master`) + weekly `schedule` triggers using `github/codeql-action/init` → `analyze`. Atomic checks: (a) valid workflow YAML, (b) `security-events: write` present, (c) `schedule:` trigger and language matrix present.
- **CLI(s)**: `mkdir -p .github/workflows`; `actionlint .github/workflows/codeql.yml` (if available); `gh workflow view codeql` (post-merge verification).
- **Package(s)**: `None` — workflow uses `github/codeql-action/*` resolved in CI; no npm install.
- **File(s)/Folder(s)**:
  - **Added**: `.github/workflows/codeql.yml`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `ci/sec-codeql-workflow`
- **Commit**: `ci(sec): add codeql workflow on ubuntu-24.04`
- **Testing**: Workflow YAML parse; `actionlint` if available; confirm `security-events: write`, the schedule trigger and the language matrix.

### `I-2-3a` — Add the audit job to the GitHub Actions pipeline (create ci.yml)
- **Description**: Create `.github/workflows/ci.yml` with push/PR triggers (to `dev`/`master`) and the first, root job `audit` on `runs-on: ubuntu-24.04`: pinned `actions/checkout` + `actions/setup-node` (Node 22 with `cache: npm`), `npm ci`, then `npm audit --audit-level=high`. This establishes the workflow file and the head of the `needs:` DAG. Atomic checks: (a) workflow file exists and parses, (b) `audit` job runs `npm audit`, (c) `runs-on: ubuntu-24.04`.
- **CLI(s)**: `mkdir -p .github/workflows`; `actionlint .github/workflows/ci.yml`; locally validate with `npm ci && npm audit --audit-level=high`.
- **Package(s)**: `None` — reuses the existing lockfile and npm scripts; no new npm dependency.
- **File(s)/Folder(s)**:
  - **Added**: `.github/workflows/ci.yml`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `ci/sec-pipeline-audit-job`
- **Commit**: `ci(sec): add audit job to github actions pipeline`
- **Testing**: `actionlint`/YAML parse; locally run `npm audit --audit-level=high`; confirm `audit` is the DAG root (no `needs:`).

### `I-2-3b` — Add the test job to the GitHub Actions pipeline
- **Description**: Extend `.github/workflows/ci.yml` with a `test` job that declares `needs: audit`, runs on `ubuntu-24.04`, repeats checkout/setup-node/cache/`npm ci`, and executes `npm run test:unit` followed by `npm run test:e2e`. Atomic checks: (a) `test` job has `needs: audit`, (b) both test scripts are invoked, (c) workflow still parses.
- **CLI(s)**: `actionlint .github/workflows/ci.yml`; locally `npm run test:unit && npm run test:e2e`.
- **Package(s)**: `None` — reuses the Vitest scripts and dependencies from `I-1-3`.
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `.github/workflows/ci.yml` (first created by `I-2-3a`)
  - **Deleted**: `None`
- **Branch**: `ci/sec-pipeline-test-job`
- **Commit**: `ci(sec): add test job to github actions pipeline`
- **Testing**: `actionlint`/YAML parse; locally run both test scripts; confirm `needs: audit` in the DAG.

### `I-2-3c` — Add the coverage gate job to the GitHub Actions pipeline
- **Description**: Extend `.github/workflows/ci.yml` with a `coverage` job (`needs: test`, `runs-on: ubuntu-24.04`) that runs `npm run test:cov` so the Vitest coverage thresholds gate the pipeline, then uploads the coverage directory with `actions/upload-artifact` for the Codacy workflow (`I-2-5`). Atomic checks: (a) `coverage` job has `needs: test`, (b) `test:cov` step present, (c) artifact path matches the Vitest coverage output directory.
- **CLI(s)**: `actionlint .github/workflows/ci.yml`; locally `npm run test:cov` (deliberately drop below a threshold once to verify the gate fails, then restore).
- **Package(s)**: `None` — uses the coverage tooling installed in `I-1-3`.
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `.github/workflows/ci.yml` (first created by `I-2-3a`)
  - **Deleted**: `None`
- **Branch**: `ci/sec-pipeline-coverage-gate`
- **Commit**: `ci(sec): add coverage gate job to github actions pipeline`
- **Testing**: `actionlint`/YAML parse; locally confirm `npm run test:cov` enforces thresholds and the artifact path matches `coverage/`.

### `I-2-3d` — Add the docker build job to the GitHub Actions pipeline
- **Description**: Extend `.github/workflows/ci.yml` with the final `docker` job (`needs: coverage`, `runs-on: ubuntu-24.04`) that builds the image with `docker/build-push-action` (or `docker build .`), completing the DAG `audit → test → coverage → docker`. Atomic checks: (a) `docker` job has `needs: coverage`, (b) a build step is present, (c) full four-stage DAG verified. Dependency note: the production `Dockerfile` is delivered in `XI-1-1a`; until it lands, gate this job or point it at a temporary build context so CI stays green (do not add a `Dockerfile` here — that would conflict with `XI-1-1a`).
- **CLI(s)**: `actionlint .github/workflows/ci.yml`; locally `docker build .` once the `Dockerfile` from `XI-1-1a` is available.
- **Package(s)**: `None` — uses standard Docker build actions in CI.
- **File(s)/Folder(s)**:
  - **Added**: `None`
  - **Modified**: `.github/workflows/ci.yml` (first created by `I-2-3a`)
  - **Deleted**: `None`
- **Branch**: `ci/sec-pipeline-docker-build`
- **Commit**: `ci(sec): add docker build job to github actions pipeline`
- **Testing**: `actionlint`/YAML parse; verify the complete `needs` DAG; smoke `docker build .` when the `Dockerfile` exists (post `XI-1-1a`).

### `I-2-4` — Add Snyk workflow test
- **Description**: Add `.github/workflows/snyk.yml` on `ubuntu-24.04` running `snyk/actions` (`snyk test`) with the `SNYK_TOKEN` repository secret, `permissions: contents: read`, and push/PR + weekly `schedule` triggers. Atomic checks: (a) `SNYK_TOKEN` secret referenced, (b) `snyk test` step present, (c) `schedule:` trigger present.
- **CLI(s)**: `npx snyk test` (local validation, requires token); `actionlint .github/workflows/snyk.yml`.
- **Package(s)**: `None` committed — Snyk CLI is invoked via `npx snyk test` locally and `snyk/actions` in CI; the `SNYK_TOKEN` secret is configured in repository settings.
- **File(s)/Folder(s)**:
  - **Added**: `.github/workflows/snyk.yml`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `ci/sec-snyk-workflow`
- **Commit**: `ci(sec): add snyk workflow test`
- **Testing**: `actionlint`/YAML validation; confirm `SNYK_TOKEN` secret name is documented and referenced correctly, and the `snyk test` step + schedule exist.

### `I-2-5` — Add Codacy workflow
- **Description**: Add `.github/workflows/codacy.yml` on `ubuntu-24.04` that downloads the coverage artifact uploaded by `I-2-3c` and uploads it via `codacy/codacy-coverage-reporter-action` using the `CODACY_PROJECT_TOKEN` secret (trigger on `workflow_run` of CI or on push). Atomic checks: (a) coverage download/upload steps present, (b) token secret referenced, (c) correct `runs-on`.
- **CLI(s)**: `actionlint .github/workflows/codacy.yml`; locally verify the coverage artifact path matches `npm run test:cov` output.
- **Package(s)**: `None` — the Codacy coverage reporter is pulled by the CI action, not installed as an npm dependency.
- **File(s)/Folder(s)**:
  - **Added**: `.github/workflows/codacy.yml`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `ci/sec-codacy-workflow`
- **Commit**: `ci(sec): add codacy workflow`
- **Testing**: `actionlint`/YAML validation; confirm the token secret and that the coverage artifact path matches the `npm run test:cov` output (`coverage/`).

### `I-2-6` — Add Sonar Cloud workflow
- **Description**: Add `.github/workflows/sonarcloud.yml` on `ubuntu-24.04` with `actions/checkout` at `fetch-depth: 0` (required for PR analysis), `SonarSource/sonarqube-scan-action`, the `SONAR_TOKEN` and `SONAR_PROJECT_KEY` secrets, push/PR triggers, and least-privilege permissions (`contents: read`, `pull-requests: read`). Atomic checks: (a) scan step present, (b) both secrets referenced, (c) `fetch-depth: 0` on checkout.
- **CLI(s)**: `actionlint .github/workflows/sonarcloud.yml`.
- **Package(s)**: `None` — SonarCloud scan runs via `SonarSource/sonarqube-scan-action` in CI; no npm install.
- **File(s)/Folder(s)**:
  - **Added**: `.github/workflows/sonarcloud.yml`
  - **Modified**: `None`
  - **Deleted**: `None`
- **Branch**: `ci/sec-sonarcloud-workflow`
- **Commit**: `ci(sec): add sonar cloud workflow`
- **Testing**: `actionlint`/YAML validation; confirm `fetch-depth: 0` on the checkout step and both secret references.

## Phase Gate (end of step)
- [ ] All workflow YAML parses / actionlint passes
- [ ] Full unit + E2E tests and coverage thresholds pass
- [ ] Security audit & version sync pass
- [ ] `git push` each step branch → PR → merge into `dev` (strict sequential: `I-2-1` → `I-2-2` → `I-2-3a` → `I-2-3b` → `I-2-3c` → `I-2-3d` → `I-2-4` → `I-2-5` → `I-2-6`)
- [ ] Update Status for `I-2-1`, `I-2-2`, `I-2-3`, `I-2-4`, `I-2-5`, `I-2-6` → `✅ Done` in the roadmap Unified Table (umbrella ID `I-2-3` covers `I-2-3a` … `I-2-3d`)
