/**
 * Public entry point for application bounded contexts (feature modules).
 *
 * Each feature lives under `src/modules/<context>/` with its own `domain/`,
 * `application/`, `infrastructure/` and `interfaces/` layers. Only the shared
 * kernel is re-exported here so contexts can depend on a stable public API.
 */
export * from './shared/index.js';
