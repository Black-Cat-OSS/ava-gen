# Cache Module Documentation

## Overview

The Cache Module provides a multi-strategy caching system for the Avatar Generator application. It supports three caching drivers (Redis, Memcached, and In-Memory) with a unified interface and automatic fallback mechanisms.

## Architecture

### Strategy Pattern Implementation

The cache module uses the Strategy pattern, similar to the Storage Module, allowing for easy switching between different caching backends without changing the application code.

```
CacheService
├── ICacheStrategy (Interface)
├── RedisCacheService (Redis Driver)
├── MemcachedCacheService (Memcached Driver)
└── MemoryCacheService (In-Memory Driver)
```

### Supported Drivers

1. **Redis** - Production-ready, persistent, supports clustering
2. **Memcached** - High-performance, distributed caching
3. **Memory** - Development/testing, LRU with TTL support

## Configuration

### Basic Configuration

The cache configuration is optional in `settings.yaml`. If the `cache` section is absent, the module will not be initialized.

```yaml
app:
  cache:
    type: 'redis'  # redis | memcached | memory | disabled
    warn_memory_level: 80  # Memory usage warning threshold (0-100)
    
    # TTL settings (in seconds) - common for all drivers
    ttl:
      avatars: 86400      # 24 hours
      metadata: 3600      # 1 hour
      lists: 300          # 5 minutes
      exists: 300         # 5 minutes
      default: 3600       # Default TTL
```

### Driver-Specific Configuration

#### Redis Configuration

```yaml
app:
  cache:
    type: 'redis'
    redis:
      host: 'redis'
      port: 6379
      password: ''        # Optional
      db: 0               # Optional, default 0
      max_memory: '256mb' # Optional
      connection:
        maxRetries: 3     # Reconnection attempts
        retryDelay: 2000  # Delay between attempts (ms)
```

#### Memcached Configuration

```yaml
app:
  cache:
    type: 'memcached'
    memcached:
      hosts: ['memcached:11211']  # Multiple servers supported
      max_memory: 256             # Memory limit in MB
```

#### Memory Configuration

```yaml
app:
  cache:
    type: 'memory'
    memory:
      max_items: 1000    # Maximum number of items
      max_memory: 100    # Memory limit in MB
```

### Configuration Examples

#### Development Mode (No Cache)

```yaml
app:
  storage: {...}
  server: {...}
  # No cache section - module not loaded
```

#### Development Mode (Memory Cache)

```yaml
app:
  cache:
    type: 'memory'
    memory:
      max_items: 500
    ttl:
      avatars: 1800      # 30 minutes
      metadata: 300      # 5 minutes
```

#### Production Mode (Redis)

```yaml
app:
  cache:
    type: 'redis'
    warn_memory_level: 85
    redis:
      host: 'redis'
      port: 6379
      password: 'your-redis-password'
      max_memory: '512mb'
    ttl:
      avatars: 86400     # 24 hours
      metadata: 3600     # 1 hour
```

#### Disabled Mode

```yaml
app:
  cache:
    type: 'disabled'
    # Module loaded but uses no-op strategy
```

## Usage

### Basic Operations

```typescript
import { CacheService } from './modules/cache/cache.service';

@Injectable()
export class MyService {
  constructor(private readonly cacheService: CacheService) {}

  async getData(id: string) {
    // Try to get from cache first
    const cached = await this.cacheService.get(`data:${id}`);
    if (cached) {
      return cached;
    }

    // Load from source
    const data = await this.loadFromSource(id);
    
    // Cache the result
    await this.cacheService.set(`data:${id}`, data, 'metadata');
    
    return data;
  }
}
```

### TTL Types

The cache service supports different TTL types for different data categories:

```typescript
// Use predefined TTL types
await cacheService.set('avatar:123', avatarData, 'avatars');     // 24h
await cacheService.set('meta:123', metadata, 'metadata');        // 1h
await cacheService.set('list:0:10', listData, 'lists');          // 5min
await cacheService.set('exists:123', true, 'exists');             // 5min

// Use default TTL
await cacheService.set('custom:key', data);                      // 1h (default)
```

### Batch Operations

```typescript
// Get multiple keys
const keys = ['key1', 'key2', 'key3'];
const results = await cacheService.mget(keys);

// Set multiple keys
const entries = [
  { key: 'key1', value: data1, ttl: 'metadata' },
  { key: 'key2', value: data2, ttl: 'avatars' },
  { key: 'key3', value: data3 }
];
await cacheService.mset(entries);
```

### Cache Invalidation

```typescript
// Delete single key
await cacheService.del('avatar:123');

// Clear all cache
await cacheService.clear();

// Clear by pattern
await cacheService.clear('avatar:*');
```

## Cache Keys

The application uses consistent key patterns:

- `avatar:object:{id}` - Serialized AvatarObject
- `avatar:metadata:{id}` - Database metadata
- `avatar:list:{pick}:{offset}` - Paginated lists
- `avatar:exists:{id}` - Existence checks

## Memory Management

### Monitoring

```typescript
// Get memory usage statistics
const stats = await cacheService.getMemoryUsage();
console.log(`Memory usage: ${stats.percentage.toFixed(2)}%`);
console.log(`Items in cache: ${stats.itemCount}`);
```

### Warning System

The cache service automatically monitors memory usage and logs warnings when the configured threshold is exceeded:

```typescript
// Check memory usage and warn if high
await cacheService.checkMemoryUsage();
```

## Error Handling

### Graceful Degradation

The cache service is designed to fail gracefully:

```typescript
// If cache is unavailable, operations return safe defaults
const result = await cacheService.get('key'); // Returns null on error
await cacheService.set('key', value);         // Continues on error
```

### Connection Management

External drivers (Redis, Memcached) include automatic reconnection:

```typescript
// Manual reconnection
await redisCacheService.reconnect();
await memcachedCacheService.reconnect();

// Check connection status
const isConnected = redisCacheService.isConnected();
```

## Performance Considerations

### Expected Performance Gains

- **API Response Time**: 60-80% reduction
- **Storage Load**: 70-90% reduction
- **Database Queries**: 50-70% reduction
- **Cache Hit Ratio**: >80% for frequently accessed data

### Memory Usage

- **Memory Driver**: Limited by `max_items` and `max_memory`
- **Redis**: Configurable via `max_memory` setting
- **Memcached**: Configurable via `max_memory` setting

## Troubleshooting

### Common Issues

#### Redis Connection Failed

**Symptoms:**
- `CacheConnectionException: Redis connection failed`
- Application starts but cache operations fail

**Solutions:**
1. Check Redis container is running:
   ```bash
   docker ps | grep redis
   ```

2. Verify Redis availability:
   ```bash
   redis-cli -h redis ping
   ```

3. Check configuration in `settings.yaml`:
   ```yaml
   redis:
     host: 'redis'  # Must match Docker service name
     port: 6379
     password: ''   # Set if Redis requires auth
   ```

4. Check Docker network:
   ```bash
   docker network inspect avatar-gen-backend-cache
   ```

5. Check Redis logs:
   ```bash
   docker logs avatar-gen-redis
   ```

#### Memcached Connection Failed

**Symptoms:**
- `CacheConnectionException: Memcached connection failed`
- Cache operations return null

**Solutions:**
1. Check Memcached container:
   ```bash
   docker ps | grep memcached
   ```

2. Verify connectivity:
   ```bash
   nc -zv memcached 11211
   ```

3. Check configuration:
   ```yaml
   memcached:
     hosts: ['memcached:11211']  # Must match Docker service name
   ```

4. Check Memcached logs:
   ```bash
   docker logs avatar-gen-memcached
   ```

#### Cache Memory Limit Exceeded

**Symptoms:**
- `Cache memory usage is high: 85.00%` warnings
- Cache operations may fail or evict data

**Solutions:**
1. Increase memory limits:
   ```yaml
   # For Redis
   redis:
     max_memory: '512mb'  # Increase from 256mb
   
   # For Memcached
   memcached:
     max_memory: 512      # Increase from 256
   
   # For Memory
   memory:
     max_memory: 200      # Increase from 100
   ```

2. Reduce TTL values to decrease retention:
   ```yaml
   ttl:
     avatars: 43200      # Reduce from 86400 (12h instead of 24h)
     metadata: 1800      # Reduce from 3600 (30min instead of 1h)
   ```

3. Clear cache manually:
   ```typescript
   await cacheService.clear();
   ```

4. Check memory usage:
   ```bash
   curl http://localhost:3000/api/health
   ```

#### Cache Not Working (No Cache Module)

**Symptoms:**
- No cache-related logs
- All operations go directly to storage/database

**Solutions:**
1. Verify cache configuration exists:
   ```yaml
   app:
     cache:  # This section must exist
       type: 'redis'  # or 'memcached' or 'memory'
   ```

2. Check module is imported in `AppModule`:
   ```typescript
   @Module({
     imports: [
       CacheModule.forRoot(),  // Must be present
       // ... other modules
     ],
   })
   ```

3. Verify cache service is injected:
   ```typescript
   constructor(
     @Optional() private readonly cacheService: CacheService
   ) {}
   ```

### Debugging

#### Enable Debug Logging

```yaml
app:
  logging:
    level: 'debug'
    verbose: true
```

#### Check Cache Status

```bash
# Check health endpoint
curl http://localhost:3000/api/health

# Check cache memory usage
curl http://localhost:3000/api/health | jq '.data.cache'
```

#### Monitor Cache Operations

Enable debug logging to see cache operations:

```
[DEBUG] Avatar loaded from cache: avatar-123
[DEBUG] Avatar cached after load: avatar-123
[WARN] Failed to get avatar from cache: Connection lost
```

## Testing

### Unit Tests

Run unit tests for cache module:

```bash
npm test -- cache
```

### Integration Tests

Run integration tests with real cache backends:

```bash
# Start Redis for testing
docker run -d --name test-redis -p 6379:6379 redis:7-alpine

# Run integration tests
npm test -- cache.integration
```

### Performance Tests

Test cache performance:

```bash
npm run test:performance -- cache
```

## Best Practices

### Key Design

1. Use consistent key patterns
2. Include data type in key names
3. Use namespaces to avoid conflicts

```typescript
// Good
const key = `avatar:metadata:${id}`;
const key = `user:session:${userId}`;

// Avoid
const key = `data_${id}`;
const key = `${type}_${id}`;
```

### TTL Selection

1. **Avatars**: Long TTL (24h) - rarely change
2. **Metadata**: Medium TTL (1h) - occasionally updated
3. **Lists**: Short TTL (5min) - frequently change
4. **Existence**: Short TTL (5min) - can become stale

### Error Handling

1. Always handle cache failures gracefully
2. Log cache errors for monitoring
3. Use fallback mechanisms

```typescript
try {
  const cached = await cacheService.get(key);
  if (cached) return cached;
} catch (error) {
  this.logger.warn(`Cache get failed: ${error.message}`);
}

// Continue with fallback logic
const data = await this.loadFromSource();
```

### Memory Management

1. Monitor memory usage regularly
2. Set appropriate memory limits
3. Use LRU eviction for memory driver
4. Configure warning thresholds

## Migration Guide

### From No Cache to Cache

1. Add cache configuration to `settings.yaml`
2. Start cache service (Redis/Memcached)
3. Restart application
4. Monitor cache hit rates

### Switching Cache Drivers

1. Update `type` in configuration
2. Ensure new driver is available
3. Restart application
4. Verify cache operations

### Disabling Cache

1. Set `type: 'disabled'` or remove cache section
2. Restart application
3. Verify graceful degradation

## API Reference

### CacheService

#### Methods

- `get<T>(key: string): Promise<T | null>`
- `set<T>(key: string, value: T, ttlType?: string): Promise<void>`
- `del(key: string): Promise<void>`
- `has(key: string): Promise<boolean>`
- `mget<T>(keys: string[]): Promise<(T | null)[]>`  
- `mset<T>(entries: Array<{key: string; value: T; ttl?: string}>): Promise<void>`
- `clear(pattern?: string): Promise<void>`
- `getMemoryUsage(): Promise<CacheMemoryStats>`
- `checkMemoryUsage(): Promise<void>`

#### Properties

- `getCacheType(): string`
- `getWarnMemoryLevel(): number`
- `getTTL(type?: string): number`

### ICacheStrategy

Interface implemented by all cache drivers:

```typescript
interface ICacheStrategy {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(pattern?: string): Promise<void>;
  has(key: string): Promise<boolean>;
  mget<T>(keys: string[]): Promise<(T | null)[]>;
  mset<T>(entries: Array<{key: string; value: T; ttl?: number}>): Promise<void>;
  getMemoryUsage(): Promise<CacheMemoryStats>;
}
```

## Contributing

When contributing to the cache module:

1. Follow existing patterns and interfaces
2. Add comprehensive tests
3. Update documentation
4. Consider backward compatibility
5. Test with all supported drivers

## License

This module is part of the Avatar Generator project and follows the same license terms.
