import * as bcrypt from "bcrypt";
import { isArray } from "class-validator";

export class UtilsService {

    /**
  * convert entity to dto class instance
  * @param {{new(entity: E, options: any): T}} model
  * @param {E[] | E} entity
  * @param options
  * @returns {T[] | T}
  */
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E,
        options?: any,
    ): T;
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E[],
        options?: any,
    ): T[];
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E | E[],
        options?: any,
    ): T | T[] {
        if (isArray(entity)) {
            return (entity as E[]).map((u: E) => new model(u, options));
        }

        return new model(entity as E, options);
    }

    /**
   * generate hash from password or string
   * @param {string} password
   * @returns {string}
   */
    static generateHash(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    /**
   * validate text with hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
    static validateHash(password: string, hash: string): boolean {
        return bcrypt.compare(password, hash);
    }
}