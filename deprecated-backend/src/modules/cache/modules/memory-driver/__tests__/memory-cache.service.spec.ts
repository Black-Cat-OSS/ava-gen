import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryCacheService } from '../memory-cache.service';
import { YamlConfigService } from '../../../config/modules/yaml-driver/yaml-config.service';

describe('MemoryCacheService', () => {
  let service: MemoryCacheService;
  let mockConfigService: YamlConfigService;

  beforeEach(() => {
    mockConfigService = {
      getCacheConfig: vi.fn().mockReturnValue({
        type: 'memory',
        memory: {
          max_items: 100,
          max_memory: 50
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

    service = new MemoryCacheService(mockConfigService);
  });

  describe('Basic Operations', () => {
    it('should set and get a value', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      await service.set(key, value);
      const result = await service.get(key);

      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
      const result = await service.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should delete a key', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      await service.set(key, value);
      expect(await service.get(key)).toEqual(value);

      await service.del(key);
      expect(await service.get(key)).toBeNull();
    });

    it('should check if key exists', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      expect(await service.has(key)).toBe(false);

      await service.set(key, value);
      expect(await service.has(key)).toBe(true);

      await service.del(key);
      expect(await service.has(key)).toBe(false);
    });
  });

  describe('TTL Functionality', () => {
    it('should expire keys after TTL', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const ttl = 100; // 100ms

      await service.set(key, value, ttl);
      expect(await service.get(key)).toEqual(value);

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(await service.get(key)).toBeNull();
    });

    it('should use default TTL when not specified', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      await service.set(key, value);
      
      // Should still be available immediately
      expect(await service.get(key)).toEqual(value);
    });

    it('should handle zero TTL (no expiration)', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      await service.set(key, value, 0);
      
      // Wait a bit and check it's still there
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(await service.get(key)).toEqual(value);
    });
  });

  describe('Batch Operations', () => {
    it('should get multiple keys', async () => {
      const entries = [
        { key: 'key1', value: { data: 'value1' } },
        { key: 'key2', value: { data: 'value2' } },
        { key: 'key3', value: { data: 'value3' } }
      ];

      for (const entry of entries) {
        await service.set(entry.key, entry.value);
      }

      const keys = entries.map(e => e.key);
      const results = await service.mget(keys);

      expect(results).toEqual(entries.map(e => e.value));
    });

    it('should set multiple keys', async () => {
      const entries = [
        { key: 'key1', value: { data: 'value1' }, ttl: 1000 },
        { key: 'key2', value: { data: 'value2' }, ttl: 2000 },
        { key: 'key3', value: { data: 'value3' } }
      ];

      await service.mset(entries);

      for (const entry of entries) {
        expect(await service.get(entry.key)).toEqual(entry.value);
      }
    });

    it('should handle mixed existing and non-existing keys in mget', async () => {
      await service.set('key1', { data: 'value1' });
      // key2 doesn't exist

      const results = await service.mget(['key1', 'key2']);
      expect(results).toEqual([{ data: 'value1' }, null]);
    });
  });

  describe('Clear Operations', () => {
    it('should clear all keys', async () => {
      await service.set('key1', { data: 'value1' });
      await service.set('key2', { data: 'value2' });

      await service.clear();

      expect(await service.get('key1')).toBeNull();
      expect(await service.get('key2')).toBeNull();
    });

    it('should clear keys by pattern', async () => {
      await service.set('avatar:1', { data: 'avatar1' });
      await service.set('avatar:2', { data: 'avatar2' });
      await service.set('metadata:1', { data: 'metadata1' });

      await service.clear('avatar:*');

      expect(await service.get('avatar:1')).toBeNull();
      expect(await service.get('avatar:2')).toBeNull();
      expect(await service.get('metadata:1')).toEqual({ data: 'metadata1' });
    });
  });

  describe('Memory Management', () => {
    it('should respect max_items limit', async () => {
      // Set max_items to 3
      mockConfigService.getCacheConfig.mockReturnValue({
        type: 'memory',
        memory: { max_items: 3 },
        ttl: { default: 3600 }
      });

      service = new MemoryCacheService(mockConfigService);

      // Add 4 items
      await service.set('key1', { data: 'value1' });
      await service.set('key2', { data: 'value2' });
      await service.set('key3', { data: 'value3' });
      await service.set('key4', { data: 'value4' });

      // First key should be evicted (LRU)
      expect(await service.get('key1')).toBeNull();
      expect(await service.get('key2')).toEqual({ data: 'value2' });
      expect(await service.get('key3')).toEqual({ data: 'value3' });
      expect(await service.get('key4')).toEqual({ data: 'value4' });
    });

    it('should update LRU order on access', async () => {
      mockConfigService.getCacheConfig.mockReturnValue({
        type: 'memory',
        memory: { max_items: 3 },
        ttl: { default: 3600 }
      });

      service = new MemoryCacheService(mockConfigService);

      await service.set('key1', { data: 'value1' });
      await service.set('key2', { data: 'value2' });
      await service.set('key3', { data: 'value3' });

      // Access key1 to make it most recently used
      await service.get('key1');

      // Add key4, key2 should be evicted (least recently used)
      await service.set('key4', { data: 'value4' });

      expect(await service.get('key1')).toEqual({ data: 'value1' });
      expect(await service.get('key2')).toBeNull();
      expect(await service.get('key3')).toEqual({ data: 'value3' });
      expect(await service.get('key4')).toEqual({ data: 'value4' });
    });

    it('should get memory usage statistics', async () => {
      await service.set('key1', { data: 'value1' });
      await service.set('key2', { data: 'value2' });

      const stats = await service.getMemoryUsage();

      expect(stats).toHaveProperty('used');
      expect(stats).toHaveProperty('limit');
      expect(stats).toHaveProperty('percentage');
      expect(stats).toHaveProperty('itemCount');
      expect(stats.itemCount).toBe(2);
      expect(stats.percentage).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle serialization errors gracefully', async () => {
      const key = 'test-key';
      const circularRef: any = {};
      circularRef.self = circularRef;

      // Should not throw, but may not store the value
      await expect(service.set(key, circularRef)).resolves.not.toThrow();
    });

    it('should handle invalid TTL values', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      // Negative TTL should be treated as no expiration
      await service.set(key, value, -100);
      expect(await service.get(key)).toEqual(value);
    });
  });

  describe('Type Safety', () => {
    it('should preserve types when storing and retrieving', async () => {
      const stringValue = 'test-string';
      const numberValue = 42;
      const objectValue = { nested: { data: 'test' } };
      const arrayValue = [1, 2, 3];

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
