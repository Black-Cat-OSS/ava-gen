import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RedisCacheService } from '../redis-cache.service';
import { YamlConfigService } from '../../../../config/modules/yaml-driver/yaml-config.service';
import Redis from 'ioredis';

// Mock ioredis
vi.mock('ioredis', () => {
  const mockRedis = {
    ping: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    exists: vi.fn(),
    mget: vi.fn(),
    mset: vi.fn(),
    keys: vi.fn(),
    flushdb: vi.fn(),
    info: vi.fn(),
    quit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };

  const Redis = vi.fn(() => mockRedis);
  Redis.prototype = mockRedis;

  return { default: Redis };
});

describe('RedisCacheService', () => {
  let service: RedisCacheService;
  let mockConfigService: YamlConfigService;
  let mockRedis: any;

  beforeEach(() => {
    mockConfigService = {
      getCacheConfig: vi.fn().mockReturnValue({
        type: 'redis',
        redis: {
          host: 'localhost',
          port: 6379,
          password: '',
          db: 0,
          max_memory: '256mb',
          connection: {
            maxRetries: 3,
            retryDelay: 2000
          }
        },
        ttl: {
          avatars: 86400,
          metadata: 3600,
          lists: 300,
          exists: 300,
          default: 3600
        }
      })
    } as any;

    // Get the mocked Redis instance
    const Redis = vi.mocked(await import('ioredis')).default;
    mockRedis = new Redis();
    
    service = new RedisCacheService(mockConfigService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Connection Management', () => {
    it('should initialize connection on module init', async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      
      await service.onModuleInit();
      
      expect(mockRedis.ping).toHaveBeenCalled();
    });

    it('should handle connection errors during init', async () => {
      mockRedis.ping.mockRejectedValue(new Error('Connection failed'));
      
      await expect(service.onModuleInit()).rejects.toThrow();
    });

    it('should quit connection on module destroy', async () => {
      mockRedis.quit.mockResolvedValue('OK');
      
      await service.onModuleDestroy();
      
      expect(mockRedis.quit).toHaveBeenCalled();
    });

    it('should reconnect when connection is lost', async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      
      await service.reconnect();
      
      expect(mockRedis.quit).toHaveBeenCalled();
      expect(mockRedis.ping).toHaveBeenCalled();
    });
  });

  describe('Basic Operations', () => {
    beforeEach(async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should set and get a value', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const serializedValue = JSON.stringify(value);

      mockRedis.set.mockResolvedValue('OK');
      mockRedis.get.mockResolvedValue(serializedValue);

      await service.set(key, value);
      const result = await service.get(key);

      expect(mockRedis.set).toHaveBeenCalledWith(key, serializedValue, 'EX', 3600);
      expect(mockRedis.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await service.get('non-existent-key');
      
      expect(result).toBeNull();
    });

    it('should delete a key', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockRedis.set.mockResolvedValue('OK');
      mockRedis.del.mockResolvedValue(1);

      await service.set(key, value);
      await service.del(key);

      expect(mockRedis.del).toHaveBeenCalledWith(key);
    });

    it('should check if key exists', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockRedis.set.mockResolvedValue('OK');
      mockRedis.exists.mockResolvedValue(1);

      await service.set(key, value);
      const exists = await service.has(key);

      expect(mockRedis.exists).toHaveBeenCalledWith(key);
      expect(exists).toBe(true);
    });
  });

  describe('TTL Functionality', () => {
    beforeEach(async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should set TTL when specified', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const ttl = 100;

      mockRedis.set.mockResolvedValue('OK');

      await service.set(key, value, ttl);

      expect(mockRedis.set).toHaveBeenCalledWith(key, JSON.stringify(value), 'EX', ttl);
    });

    it('should use default TTL when not specified', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockRedis.set.mockResolvedValue('OK');

      await service.set(key, value);

      expect(mockRedis.set).toHaveBeenCalledWith(key, JSON.stringify(value), 'EX', 3600);
    });

    it('should handle zero TTL (no expiration)', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockRedis.set.mockResolvedValue('OK');

      await service.set(key, value, 0);

      expect(mockRedis.set).toHaveBeenCalledWith(key, JSON.stringify(value));
    });
  });

  describe('Batch Operations', () => {
    beforeEach(async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should get multiple keys', async () => {
      const entries = [
        { key: 'key1', value: { data: 'value1' } },
        { key: 'key2', value: { data: 'value2' } },
        { key: 'key3', value: { data: 'value3' } }
      ];

      const serializedValues = entries.map(e => JSON.stringify(e.value));
      mockRedis.mget.mockResolvedValue(serializedValues);

      const keys = entries.map(e => e.key);
      const results = await service.mget(keys);

      expect(mockRedis.mget).toHaveBeenCalledWith(keys);
      expect(results).toEqual(entries.map(e => e.value));
    });

    it('should set multiple keys', async () => {
      const entries = [
        { key: 'key1', value: { data: 'value1' }, ttl: 1000 },
        { key: 'key2', value: { data: 'value2' }, ttl: 2000 },
        { key: 'key3', value: { data: 'value3' } }
      ];

      mockRedis.mset.mockResolvedValue('OK');

      await service.mset(entries);

      expect(mockRedis.mset).toHaveBeenCalledWith([
        'key1', JSON.stringify(entries[0].value),
        'key2', JSON.stringify(entries[1].value),
        'key3', JSON.stringify(entries[2].value)
      ]);
    });

    it('should handle mixed existing and non-existing keys in mget', async () => {
      mockRedis.mget.mockResolvedValue([JSON.stringify({ data: 'value1' }), null]);

      const results = await service.mget(['key1', 'key2']);
      
      expect(results).toEqual([{ data: 'value1' }, null]);
    });
  });

  describe('Clear Operations', () => {
    beforeEach(async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should clear all keys', async () => {
      mockRedis.flushdb.mockResolvedValue('OK');

      await service.clear();

      expect(mockRedis.flushdb).toHaveBeenCalled();
    });

    it('should clear keys by pattern', async () => {
      const pattern = 'avatar:*';
      const keys = ['avatar:1', 'avatar:2'];

      mockRedis.keys.mockResolvedValue(keys);
      mockRedis.del.mockResolvedValue(2);

      await service.clear(pattern);

      expect(mockRedis.keys).toHaveBeenCalledWith(pattern);
      expect(mockRedis.del).toHaveBeenCalledWith(...keys);
    });
  });

  describe('Memory Management', () => {
    beforeEach(async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should get memory usage statistics', async () => {
      const mockInfo = `# Memory
used_memory:1048576
used_memory_human:1.00M
maxmemory:268435456
maxmemory_human:256.00M
used_memory_percentage:0.39`;

      mockRedis.info.mockResolvedValue(mockInfo);

      const stats = await service.getMemoryUsage();

      expect(stats).toEqual({
        used: 1048576,
        limit: 268435456,
        percentage: 0.39,
        itemCount: undefined
      });
    });

    it('should handle missing memory info gracefully', async () => {
      mockRedis.info.mockResolvedValue('');

      const stats = await service.getMemoryUsage();

      expect(stats).toEqual({
        used: 0,
        limit: 0,
        percentage: 0,
        itemCount: undefined
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should handle Redis connection errors gracefully', async () => {
      mockRedis.get.mockRejectedValue(new Error('Connection lost'));

      const result = await service.get('test-key');

      expect(result).toBeNull();
    });

    it('should handle serialization errors', async () => {
      const key = 'test-key';
      const circularRef: any = {};
      circularRef.self = circularRef;

      await expect(service.set(key, circularRef)).rejects.toThrow();
    });

    it('should handle deserialization errors', async () => {
      mockRedis.get.mockResolvedValue('invalid-json');

      const result = await service.get('test-key');

      expect(result).toBeNull();
    });
  });

  describe('Connection State', () => {
    it('should track connection state', () => {
      expect(service.isConnected()).toBe(false);
    });

    it('should update connection state on successful connection', async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      
      await service.onModuleInit();
      
      expect(service.isConnected()).toBe(true);
    });

    it('should update connection state on connection loss', async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      await service.onModuleInit();
      
      // Simulate connection error
      mockRedis.get.mockRejectedValue(new Error('Connection lost'));
      
      await service.get('test-key');
      
      expect(service.isConnected()).toBe(false);
    });
  });

  describe('Type Safety', () => {
    beforeEach(async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      await service.onModuleInit();
    });

    it('should preserve types when storing and retrieving', async () => {
      const stringValue = 'test-string';
      const numberValue = 42;
      const objectValue = { nested: { data: 'test' } };
      const arrayValue = [1, 2, 3];

      mockRedis.set.mockResolvedValue('OK');
      mockRedis.get
        .mockResolvedValueOnce(JSON.stringify(stringValue))
        .mockResolvedValueOnce(JSON.stringify(numberValue))
        .mockResolvedValueOnce(JSON.stringify(objectValue))
        .mockResolvedValueOnce(JSON.stringify(arrayValue));

      await service.set('string', stringValue);
      await service.set('number', numberValue);
      await service.set('object', objectValue);
      await service.set('array', arrayValue);

      expect(await service.get('string')).toBe(stringValue);
      expect(await service.get('number')).toBe(numberValue);
      expect(await service.get('object')).toEqual(objectValue);
      expect(await service.get('array')).toEqual(arrayValue);
    });
  });
});
