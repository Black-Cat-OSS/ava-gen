import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemcachedCacheService } from '../memcached-cache.service';
import { YamlConfigService } from '../../../../config/modules/yaml-driver/yaml-config.service';

// Mock memcached
vi.mock('memcached', () => {
  const mockMemcached = {
    connect: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    touch: vi.fn(),
    getMulti: vi.fn(),
    setMulti: vi.fn(),
    flush: vi.fn(),
    end: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };

  const Memcached = vi.fn(() => mockMemcached);
  Memcached.prototype = mockMemcached;

  return { default: Memcached };
});

describe('MemcachedCacheService', () => {
  let service: MemcachedCacheService;
  let mockConfigService: YamlConfigService;
  let mockMemcached: any;

  beforeEach(() => {
    mockConfigService = {
      getCacheConfig: vi.fn().mockReturnValue({
        type: 'memcached',
        memcached: {
          hosts: ['localhost:11211'],
          max_memory: 256
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

    // Get the mocked Memcached instance
    const Memcached = vi.mocked(await import('memcached')).default;
    mockMemcached = new Memcached();
    
    service = new MemcachedCacheService(mockConfigService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Connection Management', () => {
    it('should initialize connection on module init', async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      
      await service.onModuleInit();
      
      expect(mockMemcached.connect).toHaveBeenCalled();
    });

    it('should handle connection errors during init', async () => {
      mockMemcached.connect.mockImplementation((callback) => callback(new Error('Connection failed')));
      
      await expect(service.onModuleInit()).rejects.toThrow();
    });

    it('should end connection on module destroy', async () => {
      mockMemcached.end.mockImplementation((callback) => callback());
      
      await service.onModuleDestroy();
      
      expect(mockMemcached.end).toHaveBeenCalled();
    });

    it('should reconnect when connection is lost', async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      
      await service.reconnect();
      
      expect(mockMemcached.end).toHaveBeenCalled();
      expect(mockMemcached.connect).toHaveBeenCalled();
    });
  });

  describe('Basic Operations', () => {
    beforeEach(async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      await service.onModuleInit();
    });

    it('should set and get a value', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const serializedValue = JSON.stringify(value);

      mockMemcached.set.mockImplementation((k, v, ttl, callback) => callback());
      mockMemcached.get.mockImplementation((k, callback) => callback(null, serializedValue));

      await service.set(key, value);
      const result = await service.get(key);

      expect(mockMemcached.set).toHaveBeenCalledWith(key, serializedValue, 3600, expect.any(Function));
      expect(mockMemcached.get).toHaveBeenCalledWith(key, expect.any(Function));
      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
      mockMemcached.get.mockImplementation((k, callback) => callback(null, null));

      const result = await service.get('non-existent-key');
      
      expect(result).toBeNull();
    });

    it('should delete a key', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockMemcached.set.mockImplementation((k, v, ttl, callback) => callback());
      mockMemcached.del.mockImplementation((k, callback) => callback());

      await service.set(key, value);
      await service.del(key);

      expect(mockMemcached.del).toHaveBeenCalledWith(key, expect.any(Function));
    });

    it('should check if key exists', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockMemcached.set.mockImplementation((k, v, ttl, callback) => callback());
      mockMemcached.get.mockImplementation((k, callback) => callback(null, JSON.stringify(value)));

      await service.set(key, value);
      const exists = await service.has(key);

      expect(mockMemcached.get).toHaveBeenCalledWith(key, expect.any(Function));
      expect(exists).toBe(true);
    });
  });

  describe('TTL Functionality', () => {
    beforeEach(async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      await service.onModuleInit();
    });

    it('should set TTL when specified', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const ttl = 100;

      mockMemcached.set.mockImplementation((k, v, ttl, callback) => callback());

      await service.set(key, value, ttl);

      expect(mockMemcached.set).toHaveBeenCalledWith(key, JSON.stringify(value), ttl, expect.any(Function));
    });

    it('should use default TTL when not specified', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockMemcached.set.mockImplementation((k, v, ttl, callback) => callback());

      await service.set(key, value);

      expect(mockMemcached.set).toHaveBeenCalledWith(key, JSON.stringify(value), 3600, expect.any(Function));
    });

    it('should handle zero TTL (no expiration)', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockMemcached.set.mockImplementation((k, v, ttl, callback) => callback());

      await service.set(key, value, 0);

      expect(mockMemcached.set).toHaveBeenCalledWith(key, JSON.stringify(value), 0, expect.any(Function));
    });
  });

  describe('Batch Operations', () => {
    beforeEach(async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      await service.onModuleInit();
    });

    it('should get multiple keys', async () => {
      const entries = [
        { key: 'key1', value: { data: 'value1' } },
        { key: 'key2', value: { data: 'value2' } },
        { key: 'key3', value: { data: 'value3' } }
      ];

      const mockResults = {
        key1: JSON.stringify(entries[0].value),
        key2: JSON.stringify(entries[1].value),
        key3: JSON.stringify(entries[2].value)
      };

      mockMemcached.getMulti.mockImplementation((keys, callback) => callback(null, mockResults));

      const keys = entries.map(e => e.key);
      const results = await service.mget(keys);

      expect(mockMemcached.getMulti).toHaveBeenCalledWith(keys, expect.any(Function));
      expect(results).toEqual(entries.map(e => e.value));
    });

    it('should set multiple keys', async () => {
      const entries = [
        { key: 'key1', value: { data: 'value1' }, ttl: 1000 },
        { key: 'key2', value: { data: 'value2' }, ttl: 2000 },
        { key: 'key3', value: { data: 'value3' } }
      ];

      mockMemcached.setMulti.mockImplementation((data, ttl, callback) => callback());

      await service.mset(entries);

      const expectedData = {
        key1: JSON.stringify(entries[0].value),
        key2: JSON.stringify(entries[1].value),
        key3: JSON.stringify(entries[2].value)
      };

      expect(mockMemcached.setMulti).toHaveBeenCalledWith(expectedData, 3600, expect.any(Function));
    });

    it('should handle mixed existing and non-existing keys in mget', async () => {
      const mockResults = {
        key1: JSON.stringify({ data: 'value1' }),
        key2: null
      };

      mockMemcached.getMulti.mockImplementation((keys, callback) => callback(null, mockResults));

      const results = await service.mget(['key1', 'key2']);
      
      expect(results).toEqual([{ data: 'value1' }, null]);
    });
  });

  describe('Clear Operations', () => {
    beforeEach(async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      await service.onModuleInit();
    });

    it('should clear all keys', async () => {
      mockMemcached.flush.mockImplementation((callback) => callback());

      await service.clear();

      expect(mockMemcached.flush).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle clear operation errors gracefully', async () => {
      mockMemcached.flush.mockImplementation((callback) => callback(new Error('Flush failed')));

      // Should not throw, but may log the error
      await expect(service.clear()).resolves.not.toThrow();
    });
  });

  describe('Memory Management', () => {
    beforeEach(async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      await service.onModuleInit();
    });

    it('should get memory usage statistics', async () => {
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
      mockMemcached.connect.mockImplementation((callback) => callback());
      await service.onModuleInit();
    });

    it('should handle Memcached connection errors gracefully', async () => {
      mockMemcached.get.mockImplementation((k, callback) => callback(new Error('Connection lost'), null));

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
      mockMemcached.get.mockImplementation((k, callback) => callback(null, 'invalid-json'));

      const result = await service.get('test-key');

      expect(result).toBeNull();
    });

    it('should handle set operation errors', async () => {
      mockMemcached.set.mockImplementation((k, v, ttl, callback) => callback(new Error('Set failed')));

      await expect(service.set('test-key', 'test-value')).rejects.toThrow();
    });

    it('should handle delete operation errors', async () => {
      mockMemcached.del.mockImplementation((k, callback) => callback(new Error('Delete failed')));

      await expect(service.del('test-key')).rejects.toThrow();
    });
  });

  describe('Connection State', () => {
    it('should track connection state', () => {
      expect(service.isConnected()).toBe(false);
    });

    it('should update connection state on successful connection', async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      
      await service.onModuleInit();
      
      expect(service.isConnected()).toBe(true);
    });

    it('should update connection state on connection loss', async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      await service.onModuleInit();
      
      // Simulate connection error
      mockMemcached.get.mockImplementation((k, callback) => callback(new Error('Connection lost'), null));
      
      await service.get('test-key');
      
      expect(service.isConnected()).toBe(false);
    });
  });

  describe('Type Safety', () => {
    beforeEach(async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      await service.onModuleInit();
    });

    it('should preserve types when storing and retrieving', async () => {
      const stringValue = 'test-string';
      const numberValue = 42;
      const objectValue = { nested: { data: 'test' } };
      const arrayValue = [1, 2, 3];

      mockMemcached.set.mockImplementation((k, v, ttl, callback) => callback());
      mockMemcached.get
        .mockImplementationOnce((k, callback) => callback(null, JSON.stringify(stringValue)))
        .mockImplementationOnce((k, callback) => callback(null, JSON.stringify(numberValue)))
        .mockImplementationOnce((k, callback) => callback(null, JSON.stringify(objectValue)))
        .mockImplementationOnce((k, callback) => callback(null, JSON.stringify(arrayValue)));

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

  describe('Multiple Servers', () => {
    beforeEach(() => {
      mockConfigService.getCacheConfig.mockReturnValue({
        type: 'memcached',
        memcached: {
          hosts: ['server1:11211', 'server2:11211', 'server3:11211'],
          max_memory: 256
        },
        ttl: { default: 3600 }
      });
    });

    it('should initialize with multiple servers', async () => {
      mockMemcached.connect.mockImplementation((callback) => callback());
      
      service = new MemcachedCacheService(mockConfigService);
      await service.onModuleInit();
      
      expect(mockMemcached.connect).toHaveBeenCalled();
    });
  });
});
