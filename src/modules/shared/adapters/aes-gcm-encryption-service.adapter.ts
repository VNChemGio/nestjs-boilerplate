import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import type { EncryptionService } from '../ports/encryption-service.port.js';

const DEV_KEY_HEX = '00'.repeat(32);
const IV_LENGTH = 12;

/**
 * Default/dev adapter for {@link EncryptionService}.
 *
 * AES-256-GCM with a random IV per encryption. The 32-byte key is read from
 * `ENCRYPTION_KEY` (64 hex chars) with a dev-only fallback. Later phases may
 * rebind the token to a key-rotating adapter without touching consumers.
 */
export class AesGcmEncryptionService implements EncryptionService {
  private readonly keyHex: string;

  constructor(keyHex: string = process.env.ENCRYPTION_KEY ?? DEV_KEY_HEX) {
    this.keyHex = keyHex;
  }

  async encrypt(plaintext: string): Promise<string> {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv('aes-256-gcm', this.key(), iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    return [iv, cipher.getAuthTag(), ciphertext]
      .map((part) => part.toString('base64url'))
      .join(':');
  }

  async decrypt(payload: string): Promise<string> {
    const [iv, tag, ciphertext] = payload
      .split(':')
      .map((part) => Buffer.from(part, 'base64url'));
    if (!iv || !tag || !ciphertext) {
      throw new Error('Malformed ciphertext');
    }

    const decipher = createDecipheriv('aes-256-gcm', this.key(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString('utf8');
  }

  private key(): Buffer {
    const key = Buffer.from(this.keyHex, 'hex');
    if (key.length !== 32) {
      throw new Error(
        'ENCRYPTION_KEY must be 32 bytes encoded as 64 hex characters',
      );
    }
    return key;
  }
}
