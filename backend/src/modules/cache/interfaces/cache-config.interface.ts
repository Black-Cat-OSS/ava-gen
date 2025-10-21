/**
 * Конфигурация кеширования
 *
 * @interface CacheConfig
 */
export interface CacheConfig {
  /** Тип драйвера кеширования */
  type: 'redis' | 'memcached' | 'memory' | 'disabled';
  
  /** Уровень предупреждения о памяти (0-100) */
  warn_memory_level?: number;
  
  /** TTL настройки для разных типов данных */
  ttl?: {
    /** TTL для аватаров (секунды) */
    avatars?: number;
    /** TTL для метаданных (секунды) */
    metadata?: number;
    /** TTL для списков (секунды) */
    lists?: number;
    /** TTL по умолчанию (секунды) */
    default?: number;
  };
  
  /** Настройки Redis */
  redis?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    max_memory?: string;
    connection?: {
      maxRetries: number;
      retryDelay: number;
    };
  };
  
  /** Настройки Memcached */
  memcached?: {
    hosts: string[];
    max_memory?: number;
  };
  
  /** Настройки in-memory кеша */
  memory?: {
    max_items?: number;
    max_memory?: number;
  };
}
