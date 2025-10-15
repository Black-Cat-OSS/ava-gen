# 🚀 Полное руководство по развертыванию

Детальное руководство по развертыванию Avatar Generator в различных окружениях.

## 📋 Содержание

- [Быстрый старт](#-быстрый-старт)
- [Автоматическая генерация конфигурации](#-автоматическая-генерация-конфигурации)
- [Локальное развертывание](#-локальное-развертывание)
- [Production развертывание](#-production-развертывание)
- [Troubleshooting](#-troubleshooting)
- [Мониторинг](#-мониторинг)

## 🚀 Быстрый старт

### Минимальные требования

- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM
- 5GB свободного места

### Запуск за 3 команды

```bash
# 1. Клонировать репозиторий
git clone https://github.com/your-org/avatar-gen.git
cd avatar-gen

# 2. Запустить с SQLite (разработка)
./scripts/start.sh sqlite

# 3. Проверить работу
curl http://localhost:3000/api/health
```

**Результат:** Приложение доступно на http://localhost

## ⚙️ Автоматическая генерация конфигурации

### Что происходит при запуске

При каждом запуске контейнера автоматически выполняется:

1. **Чтение YAML конфигурации** - загружается `settings.yaml` +
   environment-specific файлы
2. **Генерация DATABASE_URL** - создается строка подключения к БД
3. **Создание .env файла** - генерируется внутри контейнера
4. **Выбор схемы Prisma** - копируется правильная схема (SQLite/PostgreSQL)
5. **Генерация Prisma Client** - создается клиент с нужным провайдером
6. **Синхронизация БД** - выполняется `prisma db push`

### Структура конфигурации

```
backend/
├── settings.yaml              # Базовая конфигурация
├── settings.development.yaml  # Настройки для разработки
├── settings.production.yaml   # Настройки для production
└── .env                       # Генерируется автоматически (НЕ в git)
```

### Примеры конфигурации

#### SQLite (разработка)

```yaml
# settings.yaml
app:
  database:
    driver: 'sqlite'
    sqlite_params:
      url: 'file:./storage/database/database.sqlite'
```

#### PostgreSQL (production)

```yaml
# settings.yaml
app:
  database:
    driver: 'postgresql'
    network:
      host: 'postgres'
      port: 5432
      database: 'avatar_gen'
      username: 'postgres'
      password: 'password'
      ssl: false
```

### Генерируемый .env файл

```bash
# Автоматически создается в контейнере
DATABASE_URL="postgresql://postgres:password@postgres:5432/avatar_gen?sslmode=disable"
NODE_ENV=development
```

## 🏠 Локальное развертывание

### Вариант 1: SQLite (рекомендуется для разработки)

```bash
# Сборка и запуск
./scripts/build.sh sqlite
./scripts/start.sh sqlite

# Проверка
curl http://localhost:3000/api/health
```

**Особенности:**

- ✅ Быстрый запуск
- ✅ Не требует внешних сервисов
- ✅ Данные сохраняются в файле
- ❌ Не подходит для production

### Вариант 2: PostgreSQL (рекомендуется для production)

```bash
# Сборка и запуск
./scripts/build.sh postgresql
./scripts/start.sh postgresql

# Проверка
curl http://localhost:3000/api/health
```

**Особенности:**

- ✅ Полноценная БД
- ✅ Подходит для production
- ✅ Масштабируемость
- ❌ Требует больше ресурсов

### Вариант 3: Ручной запуск

```bash
# SQLite
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.sqlite.yml up -d

# PostgreSQL
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.postgresql.yml --profile postgresql up -d
```

### Управление сервисами

```bash
# Просмотр логов
./scripts/logs.sh

# Остановка
./scripts/stop.sh

# Очистка (удаление volumes)
./scripts/stop.sh --volumes

# Перезапуск
./scripts/stop.sh && ./scripts/start.sh sqlite
```

## 🏭 Production развертывание

### Подготовка сервера

1. **Установка Docker**

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
```

2. **Установка Docker Compose**

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Настройка файрвола**

```bash
# Открыть необходимые порты
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

### Развертывание приложения

1. **Клонирование репозитория**

```bash
git clone https://github.com/your-org/avatar-gen.git
cd avatar-gen
```

2. **Настройка конфигурации**

```bash
# Создать production конфигурацию
cp backend/settings.production.yaml backend/settings.production.local.yaml

# Отредактировать настройки
nano backend/settings.production.local.yaml
```

3. **Запуск приложения**

```bash
# Сборка образов
./scripts/build.sh postgresql

# Запуск в production режиме
NODE_ENV=production ./scripts/start.sh postgresql
```

### Настройка внешней PostgreSQL

Если используется внешняя PostgreSQL (рекомендуется для production):

```yaml
# backend/settings.production.local.yaml
app:
  database:
    driver: 'postgresql'
    postgresql_params:
      url: 'postgresql://user:password@your-db-host:5432/avatar_gen?sslmode=require'
```

### Настройка S3 Storage

```yaml
# backend/settings.production.local.yaml
app:
  storage:
    type: 's3'
    s3:
      endpoint: 'https://your-s3-endpoint.com'
      bucket: 'your-bucket-name'
      access_key: 'YOUR_ACCESS_KEY'
      secret_key: 'YOUR_SECRET_KEY'
      region: 'us-east-1'
```

### Настройка HTTPS

1. **Получение SSL сертификата**

```bash
# Используя Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

2. **Настройка Nginx**

```nginx
# frontend/configs/nginx/nginx.conf
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://avatar-frontend:80;
    }

    location /api/ {
        proxy_pass http://avatar-backend:3000;
    }
}
```

### Автоматический деплой с GitHub Actions

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/avatar-gen
            git pull origin main
            ./scripts/build.sh postgresql
            ./scripts/stop.sh
            NODE_ENV=production ./scripts/start.sh postgresql
```

## 🔧 Troubleshooting

### Проблема: DATABASE_URL не найдена

**Симптомы:**

```
Error: Environment variable not found: DATABASE_URL
```

**Решение:**

1. Проверьте, что `start.sh` выполняется полностью
2. Убедитесь, что YAML конфигурация корректна
3. Проверьте логи генерации:

```bash
docker-compose logs avatar-backend | grep "Generating .env"
```

### Проблема: Prisma Client не генерируется

**Симптомы:**

```
Error: Prisma Client not found
```

**Решение:**

1. Очистите кэш Prisma:

```bash
docker-compose exec avatar-backend rm -rf /app/node_modules/.prisma
```

2. Перезапустите контейнер:

```bash
docker-compose restart avatar-backend
```

### Проблема: PostgreSQL недоступен

**Симптомы:**

```
Error: Can't reach database server at postgres:5432
```

**Решение:**

1. Проверьте статус PostgreSQL:

```bash
docker-compose ps postgres
```

2. Проверьте логи:

```bash
docker-compose logs postgres
```

3. Проверьте health check:

```bash
docker-compose exec postgres pg_isready -U postgres
```

### Проблема: Порты заняты

**Симптомы:**

```
Error: bind: address already in use
```

**Решение:**

1. Найдите процесс, использующий порт:

```bash
# Linux/Mac
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

2. Остановите процесс или измените порт в `docker-compose.yml`

### Проблема: Нет прав доступа к volumes

**Симптомы:**

```
Error: EACCES: permission denied
```

**Решение:**

1. Дайте права на директории:

```bash
sudo chown -R $USER:$USER backend/storage backend/logs
```

2. Или запустите с правильными правами:

```bash
docker-compose run --user $(id -u):$(id -g) avatar-backend
```

## 📊 Мониторинг

### Health Checks

```bash
# Backend health
curl http://localhost:3000/api/health

# Frontend health
curl http://localhost/

# PostgreSQL health
docker-compose exec postgres pg_isready -U postgres
```

### Логи

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f avatar-backend

# Последние 100 строк
docker-compose logs --tail=100 avatar-backend
```

### Статистика ресурсов

```bash
# Использование CPU и памяти
docker stats

# Или через docker-compose
docker-compose top
```

### Backup

#### PostgreSQL Backup

```bash
# Создать backup
docker-compose exec postgres pg_dump -U postgres avatar_gen > backup_$(date +%Y%m%d).sql

# Восстановить backup
docker-compose exec -T postgres psql -U postgres avatar_gen < backup_20240101.sql
```

#### SQLite Backup

```bash
# Просто скопировать файл
cp backend/storage/database/database.sqlite backup_$(date +%Y%m%d).sqlite
```

## 🔒 Security Checklist

### Production Security

- [ ] Изменить пароли по умолчанию
- [ ] Настроить HTTPS
- [ ] Настроить файрвол
- [ ] Использовать Docker secrets
- [ ] Настроить регулярные backups
- [ ] Обновить базовые образы
- [ ] Сканировать образы на уязвимости
- [ ] Настроить мониторинг безопасности

### Docker Secrets

```yaml
# docker-compose.yml
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

## 📚 Дополнительные ресурсы

- [Docker Compose Configuration](./DOCKER_COMPOSE.md)
- [Scripts Documentation](./SCRIPTS.md)
- [Troubleshooting Guide](../development/TROUBLESHOOTING.md)
- [Backend README](../../backend/README.md)
- [Frontend README](../../frontend/README.md)

---

**Последнее обновление:** 2025-01-03  
**Версия:** 3.0 (добавлена автоматическая генерация конфигурации)
