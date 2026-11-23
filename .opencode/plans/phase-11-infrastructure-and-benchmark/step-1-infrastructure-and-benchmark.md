# Task Breakdown - Phase 11 (XI): Infrastructure & Benchmark - Step 1: Infrastructure & Benchmark

> Source of truth: `.opencode/plans/roadmap.md` → "Executive Summary & Task List (Unified Table)"
> **Architecture (DDD + SOLID)**: no application code in this step; keep configuration/CI/docs simple per the roadmap's "Architecture & Design Conventions (DDD + SOLID)" (pragmatic, no over-engineering).
> **Format**: `PHASE-STEP-TASKID` — one atomic task = one commit; each atomic task uses the 7-field format (Description, CLI(s), Package(s), File(s)/Folder(s), Branch, Commit, Testing)
> **Execution**: Strict sequential Phase X → XI (final phase)
> **Branch base**: `dev`; **Branch prefix**: `feat/...`/`chore/...`

## Step Summary
Add production deployment infrastructure and a performance benchmark, completing the roadmap. The bundled infrastructure deliverable is split into container/deploy config and CI/CD pipeline + docs.

## Atomic Tasks

### `XI-1-1a` — Add production Docker/deploy config
- **Description**: Add production container/deployment configuration on an `ubuntu-24.04` base: multi-stage `Dockerfile`, `docker-compose.yml` wiring Postgres/Redis and the app, reverse proxy/TLS config, and health/readiness probes. Atomic checks: (a) Docker/compose manifests present and build, (b) health/readiness probes defined, (c) env-based secrets externalized via `.env.example`, (d) services come up healthy.
- **CLI(s)**: `docker compose build`, `docker compose up -d`, `docker compose ps`, `docker compose logs`
- **Package(s)**: `None` — container/runtime config only; no new npm dependency.
- **File(s)/Folder(s)**:
  - **Added**: `Dockerfile`, `.dockerignore`, `docker-compose.prod.yml`, `deploy/nginx.conf`
  - **Modified**: `docker-compose.yml`, `.env.example`, `src/main.ts`, `package.json`
  - **Deleted**: None
- **Branch**: `feat/infra-docker-deploy-config`
- **Commit**: `feat(infra): add production docker and deploy config`
- **Testing**: Config/lint validation of manifests; smoke E2E against a compose stack (health endpoint returns 200); verify no secrets committed.

### `XI-1-1b` — Add production CI/CD deploy workflow and docs
- **Description**: Add the production CI/CD deploy workflow that builds/pushes the image and deploys the compose stack on `ubuntu-24.04`, consuming secrets from the repository/secret store, plus documented deployment and rollback steps. Atomic checks: (a) deploy workflow present, (b) secrets externalized via GitHub secrets/OIDC (no plaintext), (c) deploy/rollback steps documented, (d) workflow triggers on release tag.
- **CLI(s)**: `gh workflow run deploy.yml`, `gh secret set ...` (secret registration), `git push origin v12.0.0` (release-tag trigger)
- **Package(s)**: `None` — CI/CD configuration only.
- **File(s)/Folder(s)**:
  - **Added**: `.github/workflows/deploy.yml`, `docs/deployment.md`
  - **Modified**: `README.md`, `.github/workflows/ci.yml`
  - **Deleted**: None
- **Branch**: `feat/infra-production-cicd-deploy`
- **Commit**: `feat(infra): add production CI/CD deploy workflow and docs`
- **Testing**: Workflow YAML/lint validation; dry-run `gh workflow run` against a staging env; documentation review for complete deploy/rollback steps and secret handling.

### `XI-1-2` — Add performance benchmark
- **Description**: Add a reproducible performance benchmark script (e.g., `autocannon` or k6) covering key auth flows (register/login) and protected endpoints, with documented baseline thresholds and CI-friendly invocation that exits non-zero when below threshold. Atomic checks: (a) benchmark script, (b) scenarios documented, (c) thresholds/baseline recorded, (d) CI-friendly exit codes.
- **CLI(s)**: `npm install -D autocannon`, `npm run benchmark`, `npx autocannon ...`
- **Package(s)**: installed as a dev dependency with `npm install -D autocannon` (alternative: k6 binary, no npm install).
- **File(s)/Folder(s)**:
  - **Added**: `benchmarks/auth-flow.bench.mjs`, `benchmarks/protected-endpoint.bench.mjs`, `docs/performance-baseline.md`, `benchmarks/README.md`
  - **Modified**: `package.json` (`benchmark` script), `.gitignore` (results artifact), `package-lock.json`
  - **Deleted**: `None`
- **Branch**: `chore/perf-performance-benchmark`
- **Commit**: `chore(perf): add performance benchmark`
- **Testing**: Run benchmark in a controlled env; record results as a baseline artifact; verify script exits non-zero below thresholds; `npm run lint` + `npm run typecheck`.

## Phase Gate (end of step — FINAL)
- [ ] Full unit tests + coverage thresholds pass
- [ ] E2E tests pass
- [ ] Security audit & version sync pass
- [ ] `git push` step branch → PR → merge into `dev`
- [ ] Update Status `XI-1-1a`, `XI-1-1b`, `XI-1-2` → `✅ Done`
- [ ] Final roadmap reconciliation: all statuses `✅ Done`, project state updated from DRAFT
