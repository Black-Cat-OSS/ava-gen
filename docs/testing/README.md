# Тестирование Avatar Generator

## 🎯 Цель

Локальное тестирование проекта Avatar Generator с использованием основных
docker-compose файлов.

## 🚀 Быстрый старт

### Unit тесты

```bash
# Перейти в папку backend
cd backend

# Unit тесты (единственный доступный тип)
npm run test:unit
```

## 📋 Доступные типы тестов

| Тип тестов | База данных        | Хранилище | Конфигурация             | Время |
| ---------- | ------------------ | --------- | ------------------------ | ----- |
| **Unit**   | SQLite (in-memory) | Локальное | Стандартная конфигурация | ~30с  |

## 🏗️ Архитектура

### Принципы

- ✅ **Простота** - только необходимые компоненты
- ✅ **Локальное тестирование** - unit тесты без внешних зависимостей
- ✅ **Основные окружения** - development и production

### Структура конфигураций

```
backend/
└── settings.yaml               # Основная конфигурация

gateway/configs/
├── nginx.conf                  # Основная nginx конфигурация
└── profiles/
    └── nginx.dev-frontend.conf # Frontend dev конфигурация
```

## 🐳 Docker Compose окружения

### Development окружение

```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

### Production окружение

```bash
docker-compose -f docker/docker-compose.prod.yaml up -d
```

## 📖 Документация

- [**Docker Testing Guide**](DOCKER_TESTING_GUIDE.md) - Подробное руководство
- [**Конфигурации Backend**](../backend/README.md) - Описание конфигураций

## 🔧 Отладка

### Просмотр логов

```bash
# Все сервисы
docker-compose logs

# Конкретный сервис
docker-compose logs avatar-backend
```

### Проблемы с портами

Если порты заняты, измените их в docker-compose файлах:

```yaml
services:
  avatar-backend:
    ports:
      - '3001:3000' # Изменить внешний порт
```

---

**Последнее обновление:** 2025-01-27  
**Версия:** 4.0 (упрощено после удаления интеграционных тестов)
