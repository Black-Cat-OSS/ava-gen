# Scripts

Скрипты для управления Docker контейнерами Avatar Generator.

## 📋 Доступные скрипты

- `build.sh` - Сборка Docker образов
- `build-fast.sh` - Быстрая сборка с кэшированием
- `start.sh` - Запуск сервисов
- `dev.sh` - Режим разработки
- `stop.sh` - Остановка сервисов
- `clean.sh` - Очистка Docker
- `logs.sh` - Просмотр логов
- `setup-dev.sh` - Настройка dev окружения
- `setup-branch-protection.sh` - Настройка защиты веток (GitBash/Linux/Mac)
- `generate-test-config.sh` - Генерация тестовой конфигурации

## 📚 Полная документация

**Детальная документация всех скриптов:**
[docs/deployment/SCRIPTS.md](../docs/deployment/SCRIPTS.md)

## 🚀 Быстрый старт

```bash
# Запуск с настройками по умолчанию (SQLite + local storage)
./scripts/start.sh

# Запуск с PostgreSQL + S3 хранилище
./scripts/start.sh --db postgresql --storage s3

# Остановка
./scripts/stop.sh
```

---

**См. также:**

- [Docker Deployment](../docs/deployment/README.md)
- [Docker Compose Configuration](../docs/deployment/DOCKER_COMPOSE.md)
