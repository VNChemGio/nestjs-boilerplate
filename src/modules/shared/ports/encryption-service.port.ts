/**
 * DIP port for reversible field-level encryption.
 *
 * Swapping the algorithm means rebinding {@link ENCRYPTION_SERVICE} to a new
 * adapter — use cases that encrypt/decrypt data stay untouched (OCP).
 */
export const ENCRYPTION_SERVICE = Symbol('ENCRYPTION_SERVICE');

export interface EncryptionService {
  encrypt(plaintext: string): Promise<string>;
  decrypt(ciphertext: string): Promise<string>;
}
