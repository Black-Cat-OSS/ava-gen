# Prometheus Module

## Описание

Модуль Prometheus для сбора и экспорта метрик приложения Avatar Gen. Предоставляет автоматический сбор метрик HTTP запросов, потребления ресурсов и метрик Redis.

## Компоненты

### PrometheusService

Основной сервис для управления метриками:

- HTTP метрики (requests_total, request_duration_seconds, active_requests)
- Метрики потребления ресурсов (CPU, память, event loop)
- Стандартные метрики Node.js через collectDefaultMetrics()

### PrometheusMetricsInterceptor

Interceptor для автоматического сбора HTTP метрик:

- Измеряет latency всех HTTP запросов
- Собирает метрики на основе метода, route, status_code, version
- Исключает эндпоинт `/metrics` из сбора метрик

### RedisMetricsService

Сервис для сбора метрик Redis:

- Статус подключения
- Операции и их latency
- Использование памяти
- Количество ключей
- Cache hits/misses
- Ошибки

### PrometheusController

Контроллер для эндпоинта `/metrics`:

- Возвращает метрики в формате Prometheus
- VERSION_NEUTRAL эндпоинт

## Конфигурация

### Настройки в settings.yaml

```yaml
app:
  prometheus:
    enabled: true
    path: '/metrics'
    collectDefaultMetrics: true
```

### Параметры

- `enabled` - включение/выключение сбора метрик (по умолчанию: true)
- `path` - путь для эндпоинта метрик (по умолчанию: '/metrics')
- `collectDefaultMetrics` - сбор стандартных Node.js метрик (по умолчанию: true)

## Собираемые метрики

### HTTP метрики

- `http_requests_total` (Counter) - общее количество HTTP запросов
- `http_request_duration_seconds` (Histogram) - latency HTTP запросов
- `http_active_requests` (Gauge) - количество активных запросов

### Метрики потребления ресурсов

- Стандартные метрики Node.js: CPU, память, event loop, GC
- Дополнительные метрики: RSS, heap память, uptime

### Метрики Redis

- `redis_connection_status` - статус подключения
- `redis_operations_total` - количество операций
- `redis_operation_duration_seconds` - latency операций
- `redis_memory_*` - метрики памяти
- `redis_keys_count` - количество ключей
- `redis_cache_hits_total` / `redis_cache_misses_total` - cache hits/misses

## Использование

Модуль автоматически регистрируется при запуске приложения, если `prometheus.enabled: true` в конфигурации.

Эндпоинт метрик доступен по адресу: `http://host:port/metrics`

## Интеграция с Prometheus

Prometheus должен быть настроен для scraping метрик:

```yaml
scrape_configs:
  - job_name: 'avatar-gen-backend'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['backend:3000']
```
