/**
 * DIP port for generating opaque identifiers (e.g. `sub` claims, job ids).
 */
export const ID_GENERATOR = Symbol('ID_GENERATOR');

export interface IdGenerator {
  newId(): string;
}
