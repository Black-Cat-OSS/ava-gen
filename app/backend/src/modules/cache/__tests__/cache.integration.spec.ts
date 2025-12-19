import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '../cache.module';
import { CacheService } from '../cache.service';
import { YamlConfigService } from '../../../config/modules/yaml-driver/yaml-config.service';

describe('Cache Integration Tests', () => {
  let module: TestingModule;
  let cacheService: CacheService;
  let configService: YamlConfigService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CacheModule.register()],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
    configService = module.get<YamlConfigService>(YamlConfigService);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Clear cache before each test
    await cacheService.clear();
  });

  describe('Memory Cache Integration', () => {
    beforeAll(() => {
      // Mock config to use memory cache
      jest.spyOn(configService, 'getCacheConfig').mockReturnValue({
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
      });
    });

    it('should store and retrieve avatar data', async () => {
      const avatarId = 'test-avatar-123';
      const avatarData = {
        id: avatarId,
        image_4n: Buffer.from('fake-image-data'),
        image_6n: Buffer.from('fake-image-data-6n'),
        meta_data_name: avatarId
      };

      await cacheService.set(`avatar:object:${avatarId}`, avatarData, 'avatars');
      
      const retrieved = await cacheService.get(`avatar:object:${avatarId}`);
      
      expect(retrieved).toEqual(avatarData);
    });

    it('should store and retrieve metadata', async () => {
      const avatarId = 'test-avatar-456';
      const metadata = {
        id: avatarId,
        name: avatarId,
        filePath: `/avatars/${avatarId}.png`,
        primaryColor: '#FF0000',
        foreignColor: '#00FF00',
        colorScheme: 'complementary',
        seed: 'test-seed',
        generatorType: 'pixelize',
        createdAt: new Date(),
        version: 1
      };

      await cacheService.set(`avatar:metadata:${avatarId}`, metadata, 'metadata');
      
      const retrieved = await cacheService.get(`avatar:metadata:${avatarId}`);
      
      expect(retrieved).toEqual(metadata);
    });

    it('should store and retrieve avatar lists', async () => {
      const listData = {
        avatars: [
          { id: 'avatar-1', name: 'Avatar 1' },
          { id: 'avatar-2', name: 'Avatar 2' }
        ],
        pagination: {
          total: 2,
          offset: 0,
          pick: 10,
          hasMore: false
        }
      };

      await cacheService.set('avatar:list:10:0', listData, 'lists');
      
      const retrieved = await cacheService.get('avatar:list:10:0');
      
      expect(retrieved).toEqual(listData);
    });

    it('should handle TTL expiration', async () => {
      const key = 'test-ttl-key';
      const value = { data: 'test-value' };

      // Set with short TTL
      await cacheService.set(key, value, 100); // 100ms
      
      // Should be available immediately
      expect(await cacheService.get(key)).toEqual(value);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be expired
      expect(await cacheService.get(key)).toBeNull();
    });

    it('should handle batch operations', async () => {
      const entries = [
        { key: 'batch-key-1', value: { data: 'value1' }, ttl: 'metadata' },
        { key: 'batch-key-2', value: { data: 'value2' }, ttl: 'metadata' },
        { key: 'batch-key-3', value: { data: 'value3' }, ttl: 'metadata' }
      ];

      await cacheService.mset(entries);
      
      const keys = entries.map(e => e.key);
      const results = await cacheService.mget(keys);
      
      expect(results).toEqual(entries.map(e => e.value));
    });

    it('should handle cache invalidation', async () => {
      const avatarId = 'test-avatar-invalidation';
      const avatarData = { id: avatarId, data: 'test-data' };

      await cacheService.set(`avatar:object:${avatarId}`, avatarData, 'avatars');
      await cacheService.set(`avatar:metadata:${avatarId}`, avatarData, 'metadata');
      
      // Verify data exists
      expect(await cacheService.get(`avatar:object:${avatarId}`)).toEqual(avatarData);
      expect(await cacheService.get(`avatar:metadata:${avatarId}`)).toEqual(avatarData);
      
      // Invalidate cache
      await cacheService.del(`avatar:object:${avatarId}`);
      await cacheService.del(`avatar:metadata:${avatarId}`);
      
      // Verify data is gone
      expect(await cacheService.get(`avatar:object:${avatarId}`)).toBeNull();
      expect(await cacheService.get(`avatar:metadata:${avatarId}`)).toBeNull();
    });

    it('should handle memory limits', async () => {
      // Set max_items to 3
      jest.spyOn(configService, 'getCacheConfig').mockReturnValue({
        type: 'memory',
        memory: {
          max_items: 3,
          max_memory: 50
        },
        ttl: {
          default: 3600
        }
      });

      // Add 4 items
      await cacheService.set('key1', { data: 'value1' });
      await cacheService.set('key2', { data: 'value2' });
      await cacheService.set('key3', { data: 'value3' });
      await cacheService.set('key4', { data: 'value4' });

      // First key should be evicted (LRU)
      expect(await cacheService.get('key1')).toBeNull();
      expect(await cacheService.get('key2')).toEqual({ data: 'value2' });
      expect(await cacheService.get('key3')).toEqual({ data: 'value3' });
      expect(await cacheService.get('key4')).toEqual({ data: 'value4' });
    });

    it('should provide memory usage statistics', async () => {
      await cacheService.set('test-key', { data: 'test-value' });
      
      const stats = await cacheService.getMemoryUsage();
      
      expect(stats).toHaveProperty('used');
      expect(stats).toHaveProperty('limit');
      expect(stats).toHaveProperty('percentage');
      expect(stats).toHaveProperty('itemCount');
      expect(stats.itemCount).toBeGreaterThan(0);
    });
  });

  describe('Cache Service Integration', () => {
    it('should handle different TTL types correctly', async () => {
      const testData = { data: 'test' };

      await cacheService.set('avatar-key', testData, 'avatars');
      await cacheService.set('metadata-key', testData, 'metadata');
      await cacheService.set('list-key', testData, 'lists');
      await cacheService.set('exists-key', testData, 'exists');
      await cacheService.set('default-key', testData);

      // All should be available immediately
      expect(await cacheService.get('avatar-key')).toEqual(testData);
      expect(await cacheService.get('metadata-key')).toEqual(testData);
      expect(await cacheService.get('list-key')).toEqual(testData);
      expect(await cacheService.get('exists-key')).toEqual(testData);
      expect(await cacheService.get('default-key')).toEqual(testData);
    });

    it('should handle cache key patterns', async () => {
      await cacheService.set('avatar:1', { data: 'avatar1' });
      await cacheService.set('avatar:2', { data: 'avatar2' });
      await cacheService.set('metadata:1', { data: 'metadata1' });

      // Clear only avatar keys
      await cacheService.clear('avatar:*');

      expect(await cacheService.get('avatar:1')).toBeNull();
      expect(await cacheService.get('avatar:2')).toBeNull();
      expect(await cacheService.get('metadata:1')).toEqual({ data: 'metadata1' });
    });

    it('should handle concurrent operations', async () => {
      const promises = [];
      
      // Concurrent sets
      for (let i = 0; i < 10; i++) {
        promises.push(cacheService.set(`concurrent-key-${i}`, { data: `value${i}` }));
      }
      
      await Promise.all(promises);
      
      // Concurrent gets
      const getPromises = [];
      for (let i = 0; i < 10; i++) {
        getPromises.push(cacheService.get(`concurrent-key-${i}`));
      }
      
      const results = await Promise.all(getPromises);
      
      expect(results).toHaveLength(10);
      results.forEach((result, index) => {
        expect(result).toEqual({ data: `value${index}` });
      });
    });

    it('should handle mixed data types', async () => {
      const stringValue = 'test-string';
      const numberValue = 42;
      const booleanValue = true;
      const objectValue = { nested: { data: 'test' } };
      const arrayValue = [1, 2, 3];
      const bufferValue = Buffer.from('test-buffer');

      await cacheService.set('string', stringValue);
      await cacheService.set('number', numberValue);
      await cacheService.set('boolean', booleanValue);
      await cacheService.set('object', objectValue);
      await cacheService.set('array', arrayValue);
      await cacheService.set('buffer', bufferValue);

      expect(await cacheService.get('string')).toBe(stringValue);
      expect(await cacheService.get('number')).toBe(numberValue);
      expect(await cacheService.get('boolean')).toBe(booleanValue);
      expect(await cacheService.get('object')).toEqual(objectValue);
      expect(await cacheService.get('array')).toEqual(arrayValue);
      expect(await cacheService.get('buffer')).toEqual(bufferValue);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle cache service errors gracefully', async () => {
      // This test verifies that the cache service handles errors without crashing
      // In a real scenario, this might happen due to memory pressure or other issues
      
      const result = await cacheService.get('non-existent-key');
      expect(result).toBeNull();
      
      // Should not throw when deleting non-existent key
      await expect(cacheService.del('non-existent-key')).resolves.not.toThrow();
    });

    it('should handle memory pressure gracefully', async () => {
      // Fill cache with many items to test memory pressure handling
      const promises = [];
      for (let i = 0; i < 1000; i++) {
        promises.push(cacheService.set(`pressure-key-${i}`, { data: `value${i}` }));
      }
      
      await Promise.all(promises);
      
      // Should still be able to perform operations
      const stats = await cacheService.getMemoryUsage();
      expect(stats).toHaveProperty('percentage');
    });
  });
});
