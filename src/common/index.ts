/**
 * Domain-free helpers shared across bounded contexts.
 *
 * `src/common/` must never import from a feature module's `domain/` layer.
 */
export * from './utils/index.js';
