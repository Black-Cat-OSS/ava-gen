/**
 * Исключение ошибки подключения к кешу
 *
 * @class CacheConnectionException
 */
export class CacheConnectionException extends Error {
  constructor(
    message: string,
    public readonly driver: string,
  ) {
    super(`Cache connection error (${driver}): ${message}`);
    this.name = 'CacheConnectionException';
  }
}
