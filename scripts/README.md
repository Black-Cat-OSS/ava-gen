# Scripts

Скрипты для управления Docker контейнерами Avatar Generator.

## 📋 Доступные скрипты

### Основные скрипты:

- `start.sh` - Запуск сервисов с различными профилями
- `stop.sh` - Остановка сервисов
- `build.sh` - Сборка Docker образов
- `clean.sh` - Очистка Docker (контейнеры, образы, volumes)
- `logs.sh` - Просмотр логов всех сервисов

### Настройка окружения:

- `setup-dev.sh` - Настройка dev окружения (npm install, husky)
- `setup-branch-protection.sh` - Настройка защиты веток через GitHub CLI

### Настройка конфигураций:

Конфигурация настраивается через YAML файлы в директории `backend/`:

- `settings.yaml` - базовая конфигурация
- `settings.development.yaml` - настройки для разработки
- `settings.production.yaml` - настройки для production

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
