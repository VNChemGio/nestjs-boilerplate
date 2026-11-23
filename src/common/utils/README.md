# `src/common/utils`

Swappable, **domain-free** utilities: hashing, encryption and JWT helpers.

Rules:

- No domain logic and no imports from any feature module's `domain/` layer.
- Cross-context capabilities (password hashing, tokens, encryption, ids) are declared as ports in
  `src/modules/shared/ports` and bound to adapters via DI tokens — never defined here.
- This folder remains the home for pure helper functions as later phases add them.
