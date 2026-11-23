/**
 * DIP port for issuing and verifying security tokens.
 *
 * The concrete mechanism (JWT RS256, HMAC, opaque tokens, ...) is an adapter
 * detail; consumers only know the {@link TOKEN_ISSUER} token.
 */
export const TOKEN_ISSUER = Symbol('TOKEN_ISSUER');

export interface TokenIssuer {
  issue(payload: Record<string, unknown>): Promise<string>;
  verify(token: string): Promise<Record<string, unknown>>;
}
