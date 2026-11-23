import { createHmac, timingSafeEqual } from 'node:crypto';
import type { TokenIssuer } from '../ports/token-issuer.port.js';

const DEV_SECRET = 'dev-only-token-secret-replace-me';

/**
 * Default/dev adapter for {@link TokenIssuer}.
 *
 * Minimal compact HMAC-SHA256 token, sufficient for the shared-kernel
 * conformance smoke checks. Production auth (JWT RS256 + `kid`) rebinds the
 * `TOKEN_ISSUER` token in a later phase.
 */
export class HmacTokenIssuer implements TokenIssuer {
  private readonly secret: string;

  constructor(secret: string = process.env.TOKEN_ISSUER_SECRET ?? DEV_SECRET) {
    this.secret = secret;
  }

  async issue(payload: Record<string, unknown>): Promise<string> {
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    ).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${header}.${body}.${this.sign(`${header}.${body}`)}`;
  }

  async verify(token: string): Promise<Record<string, unknown>> {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) {
      throw new Error('Malformed token');
    }

    const expected = Buffer.from(this.sign(`${header}.${body}`));
    const actual = Buffer.from(signature);
    if (
      actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)
    ) {
      throw new Error('Invalid token signature');
    }

    return JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8'),
    ) as Record<string, unknown>;
  }

  private sign(data: string): string {
    return createHmac('sha256', this.secret).update(data).digest('base64url');
  }
}
