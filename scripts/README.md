# Scripts Documentation

Набор скриптов для управления Docker контейнерами Avatar Generator.

## 📋 Доступные скрипты

### 🔨 build.sh - Сборка Docker образов

Собирает Docker образы для backend и frontend.

**Использование:**

```bash
./scripts/build.sh [profile]
```

**Параметры:**

- `profile` - профиль базы данных (опционально, по умолчанию: `sqlite`)
  - `sqlite` - использовать SQLite
  - `postgresql` - использовать PostgreSQL

**Примеры:**

```bash
# Сборка с SQLite (по умолчанию)
./scripts/build.sh

# Сборка с PostgreSQL
./scripts/build.sh postgresql
```

### ⚡ build-fast.sh - Быстрая сборка с кэшированием

Быстрая сборка с максимальным использованием кэша и параллельной обработкой.

**Использование:**

```bash
./scripts/build-fast.sh [profile]
```

**Параметры:**

- `profile` - профиль базы данных (опционально, по умолчанию: `sqlite`)

**Примеры:**

```bash
# Быстрая сборка с SQLite
./scripts/build-fast.sh

# Быстрая сборка с PostgreSQL
./scripts/build-fast.sh postgresql
```

### 🚀 start.sh - Запуск сервисов

Запускает все сервисы (backend, frontend, database).

**Использование:**

```bash
./scripts/start.sh [profile] [options]
```

**Параметры:**

- `profile` - профиль базы данных (опционально, по умолчанию: `sqlite`)
- `options`:
  - `--build` или `-b` - пересобрать образы перед запуском

**Примеры:**

```bash
# Запуск с SQLite
./scripts/start.sh

# Запуск с PostgreSQL
./scripts/start.sh postgresql

# Запуск с пересборкой
./scripts/start.sh sqlite --build
```

### 🔧 dev.sh - Режим разработки

Запускает сервисы в фоновом режиме для разработки.

**Использование:**

```bash
./scripts/dev.sh [profile]
```

**Параметры:**

- `profile` - профиль базы данных (опционально, по умолчанию: `sqlite`)

**Примеры:**

```bash
# Запуск в dev режиме с SQLite
./scripts/dev.sh

# Запуск в dev режиме с PostgreSQL
./scripts/dev.sh postgresql
```

**После запуска доступны:**

- Frontend: http://localhost
- Backend API: http://localhost:3000
- Swagger docs: http://localhost:3000/swagger
- Health check: http://localhost:3000/api/health

### 🛑 stop.sh - Остановка сервисов

Останавливает все запущенные сервисы.

**Использование:**

```bash
./scripts/stop.sh [options]
```

**Параметры:**

- `-v` или `--volumes` - также удалить volumes (данные будут потеряны)

**Примеры:**

```bash
# Остановить сервисы (данные сохранятся)
./scripts/stop.sh

# Остановить и удалить все данные
./scripts/stop.sh --volumes
```

### 🧹 clean.sh - Очистка

Очищает Docker кэш, контейнеры и образы.

**Использование:**

```bash
./scripts/clean.sh
```

### 📋 logs.sh - Просмотр логов

Показывает логи сервисов.

**Использование:**

```bash
./scripts/logs.sh [service] [options]
```

### 🛠️ setup-dev.sh - Настройка окружения разработки

Настраивает локальное окружение для разработки.

**Использование:**

```bash
./scripts/setup-dev.sh
```

## 🔄 Типичные сценарии использования

### Первый запуск

```bash
# 1. Сборка образов
./scripts/build.sh sqlite

# 2. Запуск сервисов
./scripts/start.sh sqlite
```

### Разработка

```bash
# Запуск в фоновом режиме
./scripts/dev.sh

# Просмотр логов
./scripts/logs.sh

# Остановка
./scripts/stop.sh
```

### Пересборка после изменений

```bash
# Быстрая пересборка с кэшем
./scripts/build-fast.sh

# Или запуск с автоматической пересборкой
./scripts/start.sh --build
```

### Переключение между SQLite и PostgreSQL

```bash
# Остановить текущие сервисы
./scripts/stop.sh

# Запустить с PostgreSQL
./scripts/start.sh postgresql
```

### Очистка и свежий старт

```bash
# Остановить все и удалить данные
./scripts/stop.sh --volumes

# Очистить Docker кэш
./scripts/clean.sh

# Пересобрать всё с нуля
./scripts/build.sh

# Запустить заново
./scripts/start.sh
```

## 📊 Полезные команды

### Просмотр статуса контейнеров

```bash
docker-compose ps
```

### Просмотр логов конкретного сервиса

```bash
# Backend
docker-compose logs -f avatar-backend

# Frontend
docker-compose logs -f avatar-frontend

# PostgreSQL
docker-compose --profile postgresql logs -f postgres
```

### Выполнение команд внутри контейнера

```bash
# Backend
docker-compose exec avatar-backend sh

# PostgreSQL
docker-compose exec postgres psql -U postgres -d avatar_gen
```

### Просмотр размеров образов

```bash
docker images | grep avatar-gen
```

## 🔧 Переменные окружения

Скрипты автоматически устанавливают следующие переменные:

- `DOCKER_BUILDKIT=1` - использовать BuildKit для сборки
- `COMPOSE_DOCKER_CLI_BUILD=1` - использовать BuildKit с docker-compose
- `BUILDKIT_PROGRESS=plain` - показывать подробный прогресс сборки

## 📝 Примечания

1. **Все скрипты должны запускаться из директории `scripts/`** или использовать
   полный путь
2. **Скрипты автоматически переходят в корень проекта**, поэтому можно запускать
   из любого места
3. **По умолчанию используется SQLite** - не требует дополнительных настроек
4. **PostgreSQL профиль** требует дополнительный контейнер с базой данных

## 🐛 Troubleshooting

### Порты заняты

Если порты 80, 443, 3000 или 5432 заняты:

```bash
# Найти процессы использующие порты
netstat -ano | findstr "3000"  # Windows
lsof -i :3000                   # Linux/Mac

# Остановить существующие контейнеры
./scripts/stop.sh
```

### Проблемы с кэшем сборки

```bash
# Очистить всё и собрать заново
./scripts/clean.sh
./scripts/build.sh
```

### Нехватка места на диске

```bash
# Удалить неиспользуемые образы и контейнеры
docker system prune -a

# Удалить volumes
docker volume prune
```

## 📚 Дополнительная документация

- [Docker Compose файлы](../docs/DOCKER_COMPOSE_README.md)
- [Развертывание в Docker](../frontend/docs/docker-deployment.md)
- [Backend troubleshooting](../docs/backend-troubleshooting.md)

---

**Последнее обновление:** 2025-10-02
