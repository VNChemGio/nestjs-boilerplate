import { readFileSync } from 'node:fs';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module.js';
import { SharedModule } from './shared.module.js';
import {
  ENCRYPTION_SERVICE,
  ID_GENERATOR,
  PASSWORD_HASHER,
  TOKEN_ISSUER,
  type EncryptionService,
  type IdGenerator,
  type PasswordHasher,
  type TokenIssuer,
} from './ports/index.js';

/** Generic contract every PasswordHasher adapter must satisfy (LSP). */
async function expectPasswordHasherConformance(
  hasher: PasswordHasher,
): Promise<void> {
  expect(typeof hasher.hash).toBe('function');
  expect(typeof hasher.verify).toBe('function');

  const hash = await hasher.hash('correct horse battery staple');
  expect(hash).not.toBe('correct horse battery staple');
  expect(await hasher.verify('correct horse battery staple', hash)).toBe(true);
  expect(await hasher.verify('wrong password', hash)).toBe(false);
}

/** Generic contract every TokenIssuer adapter must satisfy (LSP). */
async function expectTokenIssuerConformance(
  issuer: TokenIssuer,
): Promise<void> {
  expect(typeof issuer.issue).toBe('function');
  expect(typeof issuer.verify).toBe('function');

  const token = await issuer.issue({ sub: 'user-123' });
  expect(typeof token).toBe('string');
  await expect(issuer.verify(token)).resolves.toMatchObject({
    sub: 'user-123',
  });
  await expect(issuer.verify(`${token}tampered`)).rejects.toThrow();
}

/** Generic contract every EncryptionService adapter must satisfy (LSP). */
async function expectEncryptionServiceConformance(
  service: EncryptionService,
): Promise<void> {
  expect(typeof service.encrypt).toBe('function');
  expect(typeof service.decrypt).toBe('function');

  const ciphertext = await service.encrypt('sensitive value');
  expect(ciphertext).not.toBe('sensitive value');
  await expect(service.decrypt(ciphertext)).resolves.toBe('sensitive value');
  await expect(service.decrypt('not:ciphertext')).rejects.toThrow();
}

/** Generic contract every IdGenerator adapter must satisfy (LSP). */
function expectIdGeneratorConformance(generator: IdGenerator): void {
  expect(typeof generator.newId).toBe('function');

  const first = generator.newId();
  const second = generator.newId();
  expect(typeof first).toBe('string');
  expect(first).not.toBe(second);
}

describe('Shared kernel — DDD port/adapter conformance', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SharedModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('compiles the shared kernel module (module wiring smoke)', () => {
    expect(module).toBeDefined();
  });

  it('resolves every port token to an adapter (DIP)', () => {
    expect(module.get(PASSWORD_HASHER)).toBeDefined();
    expect(module.get(TOKEN_ISSUER)).toBeDefined();
    expect(module.get(ENCRYPTION_SERVICE)).toBeDefined();
    expect(module.get(ID_GENERATOR)).toBeDefined();
  });

  it('PASSWORD_HASHER adapter satisfies its port contract (LSP)', async () => {
    await expectPasswordHasherConformance(
      module.get<PasswordHasher>(PASSWORD_HASHER),
    );
  });

  it('TOKEN_ISSUER adapter satisfies its port contract (LSP)', async () => {
    await expectTokenIssuerConformance(module.get<TokenIssuer>(TOKEN_ISSUER));
  });

  it('ENCRYPTION_SERVICE adapter satisfies its port contract (LSP)', async () => {
    await expectEncryptionServiceConformance(
      module.get<EncryptionService>(ENCRYPTION_SERVICE),
    );
  });

  it('ID_GENERATOR adapter satisfies its port contract (LSP)', () => {
    expectIdGeneratorConformance(module.get<IdGenerator>(ID_GENERATOR));
  });

  it('documents the four-layer convention and port bindings', () => {
    const readme = readFileSync(
      new URL('./README.md', import.meta.url),
      'utf8',
    );
    for (const expected of [
      'domain/',
      'application/',
      'infrastructure/',
      'interfaces/',
      'PASSWORD_HASHER',
      'TOKEN_ISSUER',
      'ENCRYPTION_SERVICE',
      'ID_GENERATOR',
    ]) {
      expect(readme).toContain(expected);
    }
  });

  it('wires the shared kernel into the root module', async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    expect(appModule.get(PASSWORD_HASHER)).toBeDefined();
    await appModule.close();
  });
});
