import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import type { PasswordHasher } from '../ports/password-hasher.port.js';

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

function deriveKey(
  plain: string,
  salt: string,
  length: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(plain, salt, length, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(key);
    });
  });
}

/**
 * Default/dev adapter for {@link PasswordHasher}.
 *
 * Dependency-free scrypt fallback. Replace with an argon2id adapter in the
 * later auth phases by rebinding the `PASSWORD_HASHER` token — no consumer
 * changes required.
 */
export class ScryptPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH).toString('hex');
    const derived = await deriveKey(plain, salt, KEY_LENGTH);
    return `scrypt$${salt}$${derived.toString('hex')}`;
  }

  async verify(plain: string, hash: string): Promise<boolean> {
    const [scheme, salt, expectedHex] = hash.split('$');
    if (scheme !== 'scrypt' || !salt || !expectedHex) {
      return false;
    }

    const expected = Buffer.from(expectedHex, 'hex');
    const actual = await deriveKey(plain, salt, expected.length);
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }
}
