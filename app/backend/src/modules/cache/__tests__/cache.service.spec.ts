import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheService } from '../cache.service';
import { YamlConfigService } from '../../../config/modules/yaml-driver/yaml-config.service';
import { ICacheStrategy } from '../interfaces/cache-strategy.interface';

describe('CacheService', () => {
  let service: CacheService;
  let mockConfigService: YamlConfigService;
  let mockStrategy: ICacheStrategy;

  beforeEach(() => {
    mockStrategy = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      clear: vi.fn(),
      has: vi.fn(),
      mget: vi.fn(),
      mset: vi.fn(),
      getMemoryUsage: vi.fn()
    };

    mockConfigService = {
      getCacheConfig: vi.fn().mockReturnValue({
        type: 'memory',
        warn_memory_level: 80,
        ttl: {
          avatars: 86400,
          metadata: 3600,
          lists: 300,
          exists: 300,
          default: 3600
        }
      })
    } as any;

    service = new CacheService(mockConfigService, mockStrategy);
  });

  describe('Basic Operations', () => {
    it('should delegate get operation to strategy', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockStrategy.get.mockResolvedValue(value);

      const result = await service.get(key);

      expect(mockStrategy.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it('should delegate set operation to strategy with TTL', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const ttlType = 'avatars';

      mockStrategy.set.mockResolvedValue(undefined);

      await service.set(key, value, ttlType);

      expect(mockStrategy.set).toHaveBeenCalledWith(key, value, 86400);
    });

    it('should use default TTL when type not specified', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      mockStrategy.set.mockResolvedValue(undefined);

      await service.set(key, value);

      expect(mockStrategy.set).toHaveBeenCalledWith(key, value, 3600);
    });

    it('should delegate delete operation to strategy', async () => {
      const key = 'test-key';

      mockStrategy.del.mockResolvedValue(undefined);

      await service.del(key);

      expect(mockStrategy.del).toHaveBeenCalledWith(key);
    });

    it('should delegate has operation to strategy', async () => {
      const key = 'test-key';

      mockStrategy.has.mockResolvedValue(true);

      const result = await service.has(key);

      expect(mockStrategy.has).toHaveBeenCalledWith(key);
      expect(result).toBe(true);
    });
  });

  describe('Batch Operations', () => {
    it('should delegate mget operation to strategy', async () => {
      const keys = ['key1', 'key2', 'key3'];
      const values = [{ data: 'value1' }, { data: 'value2' }, { data: 'value3' }];

      mockStrategy.mget.mockResolvedValue(values);

      const result = await service.mget(keys);

      expect(mockStrategy.mget).toHaveBeenCalledWith(keys);
      expect(result).toEqual(values);
    });

    it('should delegate mset operation to strategy with TTL', async () => {
      const entries = [
        { key: 'key1', value: { data: 'value1' }, ttl: 'avatars' },
        { key: 'key2', value: { data: 'value2' }, ttl: 'metadata' },
        { key: 'key3', value: { data: 'value3' } }
      ];

      mockStrategy.mset.mockResolvedValue(undefined);

      await service.mset(entries);

      const expectedEntries = [
        { key: 'key1', value: { data: 'value1' }, ttl: 86400 },
        { key: 'key2', value: { data: 'value2' }, ttl: 3600 },
        { key: 'key3', value: { data: 'value3' }, ttl: 3600 }
      ];

      expect(mockStrategy.mset).toHaveBeenCalledWith(expectedEntries);
    });
  });

  describe('Clear Operations', () => {
    it('should delegate clear operation to strategy', async () => {
      mockStrategy.clear.mockResolvedValue(undefined);

      await service.clear();

      expect(mockStrategy.clear).toHaveBeenCalledWith();
    });

    it('should delegate clear with pattern to strategy', async () => {
      const pattern = 'avatar:*';

      mockStrategy.clear.mockResolvedValue(undefined);

      await service.clear(pattern);

      expect(mockStrategy.clear).toHaveBeenCalledWith(pattern);
    });
  });

  describe('TTL Management', () => {
    it('should get TTL for specific type', () => {
      const ttl = service.getTTL('avatars');
      expect(ttl).toBe(86400);
    });

    it('should get default TTL for unknown type', () => {
      const ttl = service.getTTL('unknown-type');
      expect(ttl).toBe(3600);
    });

    it('should get default TTL when no type specified', () => {
      const ttl = service.getTTL();
      expect(ttl).toBe(3600);
    });

    it('should handle missing TTL configuration', () => {
      mockConfigService.getCacheConfig.mockReturnValue({
        type: 'memory',
        ttl: {}
      });

      service = new CacheService(mockConfigService, mockStrategy);

      const ttl = service.getTTL('avatars');
      expect(ttl).toBe(3600); // Default fallback
    });
  });

  describe('Memory Management', () => {
    it('should get memory usage from strategy', async () => {
      const mockStats = {
        used: 1048576,
        limit: 268435456,
        percentage: 0.39,
        itemCount: 100
      };

      mockStrategy.getMemoryUsage.mockResolvedValue(mockStats);

      const stats = await service.getMemoryUsage();

      expect(mockStrategy.getMemoryUsage).toHaveBeenCalled();
      expect(stats).toEqual(mockStats);
    });

    it('should check memory usage and warn if high', async () => {
      const mockStats = {
        used: 214748364, // ~80% of limit
        limit: 268435456,
        percentage: 80,
        itemCount: 100
      };

      mockStrategy.getMemoryUsage.mockResolvedValue(mockStats);

      // Mock logger to capture warning
      const mockLogger = {
        warn: vi.fn()
      };
      (service as any).logger = mockLogger;

      await service.checkMemoryUsage();

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Cache memory usage is high: 80.00%')
      );
    });

    it('should not warn if memory usage is below threshold', async () => {
      const mockStats = {
        used: 53687091, // ~20% of limit
        limit: 268435456,
        percentage: 20,
        itemCount: 25
      };

      mockStrategy.getMemoryUsage.mockResolvedValue(mockStats);

      const mockLogger = {
        warn: vi.fn()
      };
      (service as any).logger = mockLogger;

      await service.checkMemoryUsage();

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should use custom warning level from config', async () => {
      mockConfigService.getCacheConfig.mockReturnValue({
        type: 'memory',
        warn_memory_level: 50,
        ttl: { default: 3600 }
      });

      service = new CacheService(mockConfigService, mockStrategy);

      const mockStats = {
        used: 134217728, // ~50% of limit
        limit: 268435456,
        percentage: 50,
        itemCount: 50
      };

      mockStrategy.getMemoryUsage.mockResolvedValue(mockStats);

      const mockLogger = {
        warn: vi.fn()
      };
      (service as any).logger = mockLogger;

      await service.checkMemoryUsage();

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Cache memory usage is high: 50.00%')
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle strategy errors gracefully', async () => {
      mockStrategy.get.mockRejectedValue(new Error('Strategy error'));

      const result = await service.get('test-key');

      expect(result).toBeNull();
    });

    it('should handle set operation errors', async () => {
      mockStrategy.set.mockRejectedValue(new Error('Set failed'));

      await expect(service.set('test-key', 'test-value')).rejects.toThrow('Set failed');
    });

    it('should handle delete operation errors', async () => {
      mockStrategy.del.mockRejectedValue(new Error('Delete failed'));

      await expect(service.del('test-key')).rejects.toThrow('Delete failed');
    });

    it('should handle clear operation errors', async () => {
      mockStrategy.clear.mockRejectedValue(new Error('Clear failed'));

      await expect(service.clear()).rejects.toThrow('Clear failed');
    });

    it('should handle memory usage check errors', async () => {
      mockStrategy.getMemoryUsage.mockRejectedValue(new Error('Memory check failed'));

      const mockLogger = {
        error: vi.fn()
      };
      (service as any).logger = mockLogger;

      await service.checkMemoryUsage();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to check cache memory usage: Memory check failed'
      );
    });
  });

  describe('Configuration', () => {
    it('should get warning memory level from config', () => {
      const level = service.getWarnMemoryLevel();
      expect(level).toBe(80);
    });

    it('should use default warning level if not configured', () => {
      mockConfigService.getCacheConfig.mockReturnValue({
        type: 'memory',
        ttl: { default: 3600 }
      });

      service = new CacheService(mockConfigService, mockStrategy);

      const level = service.getWarnMemoryLevel();
      expect(level).toBe(80); // Default value
    });

    it('should get cache type from config', () => {
      const type = service.getCacheType();
      expect(type).toBe('memory');
    });
  });

  describe('Type Safety', () => {
    it('should preserve types when storing and retrieving', async () => {
      const stringValue = 'test-string';
      const numberValue = 42;
      const objectValue = { nested: { data: 'test' } };
      const arrayValue = [1, 2, 3];

      mockStrategy.set.mockResolvedValue(undefined);
      mockStrategy.get
        .mockResolvedValueOnce(stringValue)
        .mockResolvedValueOnce(numberValue)
        .mockResolvedValueOnce(objectValue)
        .mockResolvedValueOnce(arrayValue);

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
