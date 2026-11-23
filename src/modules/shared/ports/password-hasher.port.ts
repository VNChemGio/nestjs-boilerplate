/**
 * DIP port for hashing and verifying passwords.
 *
 * Application/use-case layers depend on this interface through the
 * {@link PASSWORD_HASHER} token, never on a concrete hashing adapter.
 */
export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  verify(plain: string, hash: string): Promise<boolean>;
}
