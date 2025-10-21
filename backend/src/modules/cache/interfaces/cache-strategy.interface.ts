/**
 * Интерфейс стратегии кеширования
 *
 * Определяет единый API для всех драйверов кеширования (Redis, Memcached, Memory).
 * Все драйверы должны реализовывать этот интерфейс для обеспечения совместимости.
 *
 * @interface ICacheStrategy
 */
export interface ICacheStrategy {
  /**
   * Получение значения из кеша
   *
   * @param {string} key - Ключ для поиска
   * @returns {Promise<T | null>} Значение или null если не найдено
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Сохранение значения в кеш
   *
   * @param {string} key - Ключ для сохранения
   * @param {T} value - Значение для сохранения
   * @param {number} [ttl] - Время жизни в секундах (опционально)
   * @returns {Promise<void>}
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Удаление значения из кеша
   *
   * @param {string} key - Ключ для удаления
   * @returns {Promise<void>}
   */
  del(key: string): Promise<void>;

  /**
   * Очистка кеша
   *
   * @param {string} [pattern] - Паттерн для удаления (опционально)
   * @returns {Promise<void>}
   */
  clear(pattern?: string): Promise<void>;

  /**
   * Проверка существования ключа в кеше
   *
   * @param {string} key - Ключ для проверки
   * @returns {Promise<boolean>} true если ключ существует
   */
  has(key: string): Promise<boolean>;

  /**
   * Получение нескольких значений за один запрос
   *
   * @param {string[]} keys - Массив ключей
   * @returns {Promise<(T | null)[]>} Массив значений
   */
  mget<T>(keys: string[]): Promise<(T | null)[]>;

  /**
   * Сохранение нескольких значений за один запрос
   *
   * @param {Array<{key: string; value: T; ttl?: number}>} entries - Массив записей
   * @returns {Promise<void>}
   */
  mset<T>(entries: Array<{key: string; value: T; ttl?: number}>): Promise<void>;

  /**
   * Получение статистики использования памяти
   *
   * @returns {Promise<CacheMemoryStats>} Статистика памяти
   */
  getMemoryUsage(): Promise<CacheMemoryStats>;
}

/**
 * Статистика использования памяти кеша
 *
 * @interface CacheMemoryStats
 */
export interface CacheMemoryStats {
  /** Использовано байт */
  used: number;
  /** Лимит в байтах */
  limit: number;
  /** Процент использования (0-100) */
  percentage: number;
  /** Количество элементов в кеше (опционально) */
  itemCount?: number;
}
