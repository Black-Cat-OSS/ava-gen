/**
 * Исключение превышения лимита памяти кеша
 *
 * @class CacheMemoryException
 */
export class CacheMemoryException extends Error {
  constructor(
    message: string,
    public readonly memoryUsage: number,
  ) {
    super(`Cache memory limit exceeded (${memoryUsage.toFixed(2)}%): ${message}`);
    this.name = 'CacheMemoryException';
  }
}
