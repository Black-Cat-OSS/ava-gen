# Scripts

Скрипты для управления Docker контейнерами Avatar Generator.

## 📋 Доступные скрипты

### Основные скрипты:

- `build.sh` - Сборка Docker образов (с поддержкой кэша)
- `start.sh` - Запуск сервисов (с режимами dev и logs)
- `stop.sh` - Остановка сервисов
- `logs.sh` - Просмотр логов всех сервисов
- `clean.sh` - Очистка Docker (контейнеры, образы, volumes)

### Настройка окружения:

- `setup-dev.sh` - Настройка dev окружения (npm install, husky)

### Скрипты для релизов (опционально):

- `release-simple.js` - Создание релизов с автоматическим версионированием
- `update-unreleased.js` - Обновление changelog для нерелизных изменений

### Настройка конфигураций:

Конфигурация настраивается через YAML файлы в директории `backend/`:

- `settings.yaml` - базовая конфигурация
- `settings.development.yaml` - настройки для разработки
- `settings.production.yaml` - настройки для production

## 📚 Полная документация

**Детальная документация всех скриптов:**
[docs/deployment/SCRIPTS.md](../docs/deployment/SCRIPTS.md)

## 🚀 Быстрый старт

### Основные команды:

```bash
# Сборка образов
./scripts/build.sh                    # Чистая сборка
./scripts/build.sh --cache            # Быстрая сборка с кэшем
./scripts/build.sh --cache postgresql # Быстрая сборка PostgreSQL

# Запуск сервисов
./scripts/start.sh                    # SQLite + local storage
./scripts/start.sh --dev              # Режим разработки (detached)
./scripts/start.sh --dev --logs       # Dev режим + показ логов
./scripts/start.sh --db postgresql    # PostgreSQL + local storage
./scripts/start.sh --storage s3       # SQLite + S3 хранилище

# Управление
./scripts/stop.sh                     # Остановка
./scripts/stop.sh --volumes           # Остановка + удаление данных
./scripts/logs.sh                     # Просмотр логов
./scripts/clean.sh                    # Полная очистка
```

### Настройка окружения:

```bash
./scripts/setup-dev.sh               # Первоначальная настройка
```

---

**См. также:**

- [Docker Deployment](../docs/deployment/README.md)
- [Docker Compose Configuration](../docs/deployment/DOCKER_COMPOSE.md)
