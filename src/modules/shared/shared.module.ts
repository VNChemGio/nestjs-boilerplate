import { Module } from '@nestjs/common';
import {
  AesGcmEncryptionService,
  HmacTokenIssuer,
  ScryptPasswordHasher,
  UuidIdGenerator,
} from './adapters/index.js';
import {
  ENCRYPTION_SERVICE,
  ID_GENERATOR,
  PASSWORD_HASHER,
  TOKEN_ISSUER,
} from './ports/index.js';

/**
 * Shared kernel of the application.
 *
 * Every cross-context port token is bound here to a default (dev) adapter.
 * A feature module can rebind any token to its own adapter (e.g. argon2id for
 * `PASSWORD_HASHER`) without editing the ports or the use cases that consume
 * them — Dependency Inversion + Open/Closed in practice.
 */
@Module({
  providers: [
    { provide: PASSWORD_HASHER, useClass: ScryptPasswordHasher },
    { provide: TOKEN_ISSUER, useClass: HmacTokenIssuer },
    { provide: ENCRYPTION_SERVICE, useClass: AesGcmEncryptionService },
    { provide: ID_GENERATOR, useClass: UuidIdGenerator },
  ],
  exports: [PASSWORD_HASHER, TOKEN_ISSUER, ENCRYPTION_SERVICE, ID_GENERATOR],
})
export class SharedModule {}
