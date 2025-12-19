/**
 * Исключение ошибки операции кеширования
 *
 * @class CacheOperationException
 */
export class CacheOperationException extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly key?: string,
  ) {
    super(`Cache operation failed (${operation})${key ? ` for key: ${key}` : ''}: ${message}`);
    this.name = 'CacheOperationException';
  }
}
