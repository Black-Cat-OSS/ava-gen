# Docker Compose Configuration

Конфигурация Docker Compose для запуска Avatar Generator.

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────┐
│           Gateway (Nginx SSL/TLS)               │
│           Port: 80 (HTTP), 12745 (HTTPS)        │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────┐│
│  │   Frontend   │  │   Backend    │  │Postgre││
│  │   (Nginx)    │→ │   (NestJS)   │→ │  SQL  ││
│  │   :8080      │  │    :3000     │  │ :5432 ││
│  └──────────────┘  └──────────────┘  └───────┘│
│                                                 │
└─────────────────────────────────────────────────┘
```

## 📦 Сервисы

### 1. PostgreSQL (`postgres`)

**Образ:** `postgres:17-alpine`  
**Порт:** `5432`  
**Назначение:** База данных (опциональная, можно использовать SQLite)

**Конфигурация:**

- База данных: `avatar_gen`
- Пользователь: `postgres`
- Пароль: `password` (⚠️ изменить для production)
- Encoding: UTF-8

**Volumes:**

- `postgres_data:/var/lib/postgresql/data` - Персистентное хранение данных
- `./backend/init-scripts:/docker-entrypoint-initdb.d` - Скрипты инициализации

**Health Check:**

```yaml
test: ['CMD-SHELL', 'pg_isready -U postgres -d avatar_gen']
interval: 10s
timeout: 5s
retries: 5
start_period: 30s
```

### 2. Backend (`avatar-backend`)

**Build Context:** `../backend`  
**Dockerfile:** `backend/docker/Dockerfile` (относительно context)  
**Порт:** `3000`  
**Назначение:** NestJS API сервер

**Volumes:**

- `./backend/storage:/app/storage` - Хранение сгенерированных аватаров и SQLite
  БД
- `./backend/settings.yaml:/app/settings.yaml` - Конфигурация
- `./backend/logs:/app/logs` - Логи приложения

**Environment:**

- `NODE_ENV=production`
- `CONFIG_PATH=./settings.yaml`

**Автоматическая генерация конфигурации:**

При запуске контейнера автоматически:

1. Загружается YAML конфигурация
2. Инициализируется TypeORM подключение к базе данных
3. Выполняется автоматическая синхронизация схемы базы данных

**Health Check:**

```yaml
test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health']
interval: 30s
timeout: 10s
retries: 3
start_period: 40s
```

### 3. Frontend (`avatar-frontend`)

**Build Context:** `../frontend`  
**Dockerfile:** `frontend/docker/Dockerfile` (относительно context)  
**Порты:** `8080`  
**Назначение:** Nginx веб-сервер с React SPA

**Volumes:**

- `./frontend/logs:/var/log/nginx` - Nginx логи

**Health Check:**

```yaml
test: ['CMD', 'curl', '-f', 'http://localhost/health']
interval: 30s
timeout: 10s
retries: 3
start_period: 10s
```

## 🚀 Использование

### Профили конфигурации

Проект поддерживает профили для разных сценариев использования:

#### SQLite (по умолчанию)

Используется для разработки и простых сценариев.

```bash
# Запустить с SQLite
docker compose -f docker/docker-compose.yml up -d
```

#### PostgreSQL

Используется для production окружения.

```bash
# Запустить с PostgreSQL
docker compose -f docker/docker-compose.yml --profile postgresql up -d
```

#### Development

Используется для разработки с дополнительными сервисами.

```bash
# Полный стек для разработки
docker compose -f docker/docker-compose.dev.yml --profile i-am-fullstack up -d

# Только frontend разработка
docker compose -f docker/docker-compose.dev.yml --profile i-am-frontender up -d
```

### Быстрый старт

```bash
# Запустить все сервисы (SQLite по умолчанию)
docker compose -f docker/docker-compose.yml up -d

# Просмотр логов
docker compose -f docker/docker-compose.yml logs -f

# Остановить все сервисы
docker compose -f docker/docker-compose.yml down

# Остановить и удалить volumes
docker compose -f docker/docker-compose.yml down -v
```

### Запуск отдельных сервисов

```bash
# Только backend с SQLite
docker compose -f docker/docker-compose.yml up avatar-backend

# Только backend с PostgreSQL
docker compose -f docker/docker-compose.yml --profile postgresql up avatar-backend

# Только frontend
docker compose -f docker/docker-compose.yml up avatar-frontend

# PostgreSQL отдельно (только для профиля postgresql)
docker compose -f docker/docker-compose.yml --profile postgresql up postgres
```

### Пересборка образов

```bash
# Пересобрать все сервисы
docker compose -f docker/docker-compose.yml build

# Пересобрать конкретный сервис
docker compose -f docker/docker-compose.yml build avatar-backend

# Пересобрать и запустить
docker compose -f docker/docker-compose.yml up --build
```

## ⚙️ Конфигурация

### Профили баз данных

Проект использует профили для автоматической настройки базы данных:

#### Профиль SQLite (по умолчанию)

- Используется для разработки
- Не требует дополнительной настройки
- База данных хранится в файле

#### Профиль PostgreSQL

- Используется для production
- Требует настройки PostgreSQL сервиса

### Настройка settings.yaml

Убедитесь, что ваш `backend/settings.yaml` соответствует выбранному профилю:

```yaml
app:
  database:
    driver: 'sqlite' # для профиля sqlite
    # driver: 'postgresql'  # для профиля postgresql (раскомментируйте)
    connection:
      maxRetries: 3
      retryDelay: 2000
    sqlite_params:
      url: 'file:./storage/database/database.sqlite'
    # postgresql_params:     # раскомментируйте для PostgreSQL
    #   host: "postgres"
    #   port: 5432
    #   database: "avatar_gen"
    #   username: "postgres"
    #   password: "password"
    #   ssl: false
```

### Переключение между профилями

```bash
# Использовать SQLite (по умолчанию)
docker compose -f docker/docker-compose.yml up -d

# Использовать PostgreSQL
docker compose -f docker/docker-compose.yml --profile postgresql up -d
```

### Миграции базы данных

Для каждого профиля выполняйте миграции отдельно:

```bash
# Миграция для SQLite
docker compose -f docker/docker-compose.yml run --rm avatar-backend npm run typeorm:run

# Миграция для PostgreSQL
docker compose -f docker/docker-compose.yml --profile postgresql run --rm avatar-backend npm run typeorm:run
```

### Изменение портов

```yaml
# В docker-compose.yml
services:
  gateway:
    ports:
      - '80:80' # HTTP
      - '12745:12745' # HTTPS

  avatar-frontend:
    ports:
      - '8080:8080' # Frontend direct access
```

### Настройка ресурсов

Добавьте ограничения ресурсов (для production):

```yaml
services:
  avatar-backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 🔧 Работа с volumes

### Список volumes

```bash
# Посмотреть все volumes
docker volume ls

# Информация о конкретном volume
docker volume inspect avatar-gen_postgres_data
```

### Backup PostgreSQL

```bash
# Создать backup
docker compose -f docker/docker-compose.yml exec postgres pg_dump -U postgres avatar_gen > backup.sql

# Восстановить backup
docker compose -f docker/docker-compose.yml exec -T postgres psql -U postgres avatar_gen < backup.sql
```

### Backup SQLite

```bash
# Просто скопировать файл
cp backend/storage/database/database.sqlite backend/backups/database_$(date +%Y%m%d).sqlite
```

## 🐛 Troubleshooting

### Проблема: Сервис не запускается

```bash
# Просмотр логов
docker compose -f docker/docker-compose.yml logs avatar-backend

# Проверка статуса
docker compose -f docker/docker-compose.yml ps

# Рестарт сервиса
docker compose -f docker/docker-compose.yml restart avatar-backend
```

### Проблема: Backend не может подключиться к PostgreSQL

**Симптомы:**

```
Error: Can't reach database server at postgres:5432
```

**Решение:**

1. Проверьте, что PostgreSQL запущен:

```bash
docker compose -f docker/docker-compose.yml ps postgres
```

2. Проверьте health check:

```bash
docker compose -f docker/docker-compose.yml exec postgres pg_isready -U postgres
```

3. Проверьте переменные окружения:

```bash
docker compose -f docker/docker-compose.yml config | grep -A 5 -B 5 "environment:"
```

### Проблема: Порты заняты

**Симптомы:**

```
Error: bind: address already in use
```

**Решение:**

1. Найдите процесс, использующий порт:

```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

2. Измените порт в docker-compose.yml:

```yaml
ports:
  - '3001:3000' # Использовать 3001 вместо 3000
```

### Проблема: Контейнеры постоянно перезапускаются

```bash
# Проверьте health check
docker inspect avatar-gen-backend | grep -A 10 Health

# Отключите restart для отладки
docker compose -f docker/docker-compose.yml up --no-start
docker compose -f docker/docker-compose.yml start avatar-backend
docker compose -f docker/docker-compose.yml logs -f avatar-backend
```

### Проблема: Нет доступа к volumes

**Симптомы:**

```
Error: EACCES: permission denied
```

**Решение (Linux):**

```bash
# Дать права текущему пользователю
sudo chown -R $USER:$USER backend/storage

# Или запустить контейнер от текущего пользователя
docker compose -f docker/docker-compose.yml run --user $(id -u):$(id -g) avatar-backend
```

## 🔒 Security

### Production Checklist

- [ ] Изменить пароль PostgreSQL
- [ ] Использовать Docker secrets для паролей
- [ ] Настроить HTTPS для frontend
- [ ] Ограничить доступ к портам (firewall)
- [ ] Использовать non-root пользователя в контейнерах
- [ ] Регулярно обновлять базовые образы
- [ ] Сканировать образы на уязвимости

### Использование Docker Secrets

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

## 📊 Мониторинг

### Просмотр логов всех сервисов

```bash
# Все сервисы
docker compose -f docker/docker-compose.yml logs

# С отслеживанием
docker compose -f docker/docker-compose.yml logs -f

# Конкретный сервис
docker compose -f docker/docker-compose.yml logs -f avatar-backend

# Последние 100 строк
docker compose -f docker/docker-compose.yml logs --tail=100
```

### Статистика ресурсов

```bash
# Использование CPU и памяти
docker stats

# Или через docker-compose
docker compose -f docker/docker-compose.yml top
```

### Health Check Status

```bash
# Статус всех контейнеров
docker compose -f docker/docker-compose.yml ps

# Детальная информация о health check
docker inspect --format='{{json .State.Health}}' avatar-gen-backend | jq
```

## 🚀 Production Deployment

### Использование docker-compose.prod.yaml

Для production окружения используется отдельный файл
`docker/docker-compose.prod.yaml`:

**Особенности production конфигурации:**

- ✅ Только один конфигурационный файл (генерируется из GitHub Secrets)
- ✅ PostgreSQL - только внешняя БД (не контейнер)
- ✅ S3 Storage (не монтируется local storage)
- ✅ Упрощённая структура volumes

**Запуск на production сервере:**

```bash
# На production сервере после git pull
docker compose -f docker/docker-compose.prod.yaml build
docker compose -f docker/docker-compose.prod.yaml up -d
```

**Структура конфигурации:**

```yaml
avatar-backend:
  volumes:
    # Генерируемый конфиг монтируется как settings.yaml (единственный конфиг!)
    - settings.production.local.yaml:/app/settings.yaml:ro
    # Логи
    - ../backend/logs:/app/logs
    # Storage НЕ монтируется - всё в S3!
  environment:
    - NODE_ENV=production
```

**Как это работает:**

1. GitHub Actions генерирует `backend/settings.production.local.yaml` из
   секретов (S3, PostgreSQL)
2. Docker монтирует его как `/app/settings.yaml` внутри контейнера
3. Приложение загружает единственный конфиг файл - никаких merge/override

**Примечание:** Файл `backend/settings.production.local.yaml` генерируется
автоматически из GitHub Secrets при деплое. См.
[GitHub Secrets Configuration](./GITHUB_SECRETS_CONFIGURATION.md)

### Рекомендации

1. **Используйте конкретные версии образов**

   ```yaml
   image: postgres:15.4-alpine # Не :latest
   ```

2. **Настройте логирование**

   ```yaml
   logging:
     driver: 'json-file'
     options:
       max-size: '10m'
       max-file: '3'
   ```

3. **Используйте restart policy**

   ```yaml
   restart: unless-stopped # Или on-failure:3
   ```

4. **Настройте мониторинг**
   - Prometheus + Grafana
   - ELK Stack
   - Cloud monitoring (AWS CloudWatch, etc.)

5. **Backup стратегия**
   - Регулярные backups PostgreSQL
   - Репликация volumes
   - Offsite backups

### Пример production конфигурации

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15.4-alpine
    restart: unless-stopped
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G

  avatar-backend:
    restart: unless-stopped
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '5'
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
      replicas: 2 # Для load balancing
```

## 📝 Полезные команды

```bash
# Проверка конфигурации
docker compose -f docker/docker-compose.yml config

# Валидация файла
docker compose -f docker/docker-compose.yml config --quiet

# Список запущенных контейнеров
docker compose -f docker/docker-compose.yml ps

# Список всех контейнеров (включая остановленные)
docker compose -f docker/docker-compose.yml ps -a

# Выполнить команду в контейнере
docker compose -f docker/docker-compose.yml exec avatar-backend sh

# Создать новый контейнер для выполнения команды
docker compose -f docker/docker-compose.yml run --rm avatar-backend npm run typeorm:run

# Пересоздать контейнеры
docker compose -f docker/docker-compose.yml up --force-recreate

# Удалить все (контейнеры, сети, volumes)
docker compose -f docker/docker-compose.yml down -v --remove-orphans
```

## 🔗 Связанные документы

- [Docker README](../../docker/README.md)
- [Docker Guide](README.md)
- [Backend README](../../backend/README.md)
- [Frontend README](../../frontend/README.md)

---

**Последнее обновление:** 2025-01-15  
**Версия:** 3.1 (добавлена поддержка S3 Storage и Gateway)
