# Grafana Setup Guide

## Описание

Руководство по настройке и использованию Grafana для мониторинга приложения
Avatar Gen.

## Запуск сервисов

### Запуск Prometheus и Grafana

Для production:

```bash
docker compose -f docker-compose.yml -f monitoring.yaml --profile prometheus --profile grafana up -d
```

Для development:

```bash
docker compose -f docker-compose.dev.yml -f monitoring.yaml --profile prometheus --profile grafana up -d
```

### Доступ к сервисам

- **Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: `admin`
- **Prometheus**: http://localhost:9090

## Автоматическая настройка

Grafana автоматически настраивается при запуске:

- Prometheus datasource настроен автоматически
- Dashboard загружается автоматически из `grafana/dashboards/`

## Dashboard

Dashboard "Avatar Gen Application Metrics" содержит:

- HTTP метрики (requests, latency)
- Метрики потребления ресурсов (CPU, память)
- Метрики Redis (операции, память, cache hits/misses)

## Создание и обновление dashboards

1. Создайте dashboard в Grafana UI
2. Экспортируйте JSON через "Share" → "Export"
3. Сохраните JSON в `grafana/dashboards/`
4. Dashboard автоматически загрузится при следующем перезапуске Grafana

## Переменные окружения

- `GF_SECURITY_ADMIN_USER` - пользователь admin (по умолчанию: admin)
- `GF_SECURITY_ADMIN_PASSWORD` - пароль admin (по умолчанию: admin)
- `GF_SERVER_ROOT_URL` - корневой URL Grafana

## Профили Docker Compose

Сервисы Prometheus и Grafana доступны через профили:

- `prometheus` - запуск Prometheus
- `grafana` - запуск Grafana
