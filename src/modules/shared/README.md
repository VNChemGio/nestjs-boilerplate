# Shared kernel (`src/modules/shared`)

This folder is the **shared kernel** of the application. It enables the
pragmatic DDD + SOLID structure described in `.opencode/plans/roadmap.md`.

## Bounded contexts = feature modules

Each feature lives in `src/modules/<context>/` and owns its own layers. Folders
appear as a context grows — they are not created empty up front.

| Layer          | Folder                                               | Contains                                                                 | Dependency rule                                                     |
| :------------- | :--------------------------------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------ |
| Domain         | `domain/`                                            | Entities, value objects, domain services, port interfaces, domain events | Pure types/behaviour — no Nest, TypeORM, Redis or HTTP imports      |
| Application    | `application/` (auth: `use-cases/`)                  | Use cases / application services, query handlers                         | Orchestrates through ports; no transport or persistence details     |
| Infrastructure | `infrastructure/`, `adapters/`                       | TypeORM repositories, Keyv/Redis, BullMQ, mail, crypto adapters          | Implements domain/application ports; injected via tokens            |
| Interfaces     | `interfaces/`, controllers, DTOs, strategies, guards | HTTP controllers, request DTOs, Passport strategies/guards               | Thin translation between transport and use cases; no business rules |

`src/common/` (including `src/common/utils/`) holds generic, domain-free code
and must never import from a feature module's `domain/`.

## SOLID mapping

- **SRP** — one use case or adapter per class.
- **OCP** — add a new adapter and rebind its token instead of editing a use case.
- **LSP** — any adapter must be replaceable by another implementation of the
  same port; enforced by the conformance spec in
  `shared-ports.conformance.spec.ts`.
- **ISP** — ports stay narrow and consumer-specific.
- **DIP** — domain and application layers depend only on port interfaces and
  DI tokens, never on concrete infrastructure.

## Port bindings (DI tokens)

`SharedModule` binds every cross-context port token to a default (dev) adapter:

| Port token           | Interface           | Default adapter                                        |
| :------------------- | :------------------ | :----------------------------------------------------- |
| `PASSWORD_HASHER`    | `PasswordHasher`    | `ScryptPasswordHasher` (argon2id in a later phase)     |
| `TOKEN_ISSUER`       | `TokenIssuer`       | `HmacTokenIssuer` (JWT RS256 + `kid` in a later phase) |
| `ENCRYPTION_SERVICE` | `EncryptionService` | `AesGcmEncryptionService`                              |
| `ID_GENERATOR`       | `IdGenerator`       | `UuidIdGenerator`                                      |

To use a port, inject it by token:

```ts
constructor(@Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher) {}
```

To substitute a production mechanism, rebind the token in a feature module —
do **not** edit the port or its consumers:

```ts
{ provide: PASSWORD_HASHER, useClass: Argon2idPasswordHasher }
```

Each port has a conformance spec executed against **all** of its adapters,
including the in-memory/dev fallback, so substitutions are provably safe.
Default adapters here are first-class implementations, not test-only stubs.
