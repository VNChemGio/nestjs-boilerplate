import { randomUUID } from 'node:crypto';
import type { IdGenerator } from '../ports/id-generator.port.js';

/** Default adapter for {@link IdGenerator} backed by `crypto.randomUUID()`. */
export class UuidIdGenerator implements IdGenerator {
  newId(): string {
    return randomUUID();
  }
}
