# План реорганизации документации

**Дата:** 2025-10-03  
**Статус:** В процессе

## 🔍 Анализ текущей документации

### Проблемы

1. **Дублирование контента:**
   - `docs/DOCKER_COMPOSE_README.md` (572 строки) дублирует `docker/README.md`
   - Устаревшие пути к БД (prisma/storage вместо storage/database)
2. **Устаревшие документы:**
   - `docs/backend_task.md` - первоначальное ТЗ, не актуально
   - `docs/MIGRATION_DOCKER_STRUCTURE.md` - временный, выполнено
   - `docs/TESTING_AND_DOCS_UPDATE.md` - временный, выполнено
3. **Плохая организация:**
   - Все файлы в одной директории
   - Нет логической группировки по темам
   - Нет хабов (README) для навигации
4. **Неточности:**
   - Устаревшие пути в `database-setup.md`, `backend-troubleshooting.md`
   - Ссылки на несуществующие директории

## 📁 Предлагаемая структура

```
docs/
├── README.md                      # Главный хаб документации
├── INDEX.md                       # Полный индекс (навигация)
│
├── getting-started/              # Быстрый старт
│   ├── README.md                 # Хаб: как начать работу
│   ├── quick-start.md            # Быстрый старт (5 минут)
│   └── installation.md           # Детальная установка
│
├── development/                  # Разработка
│   ├── README.md                 # Хаб: разработка
│   ├── setup.md                  # Настройка окружения
│   ├── database.md               # Настройка БД (из database-setup.md)
│   ├── integration.md            # Frontend-Backend (из frontend-backend-integration.md)
│   └── troubleshooting.md        # Решение проблем (из backend-troubleshooting.md)
│
├── deployment/                   # Развертывание
│   ├── README.md                 # Хаб: развертывание
│   ├── docker.md                 # Docker (объединить DOCKER_COMPOSE + docker/README)
│   ├── production.md             # Production deployment
│   └── scripts.md                # Скрипты (ссылка на ../scripts/)
│
├── api/                          # API документация
│   ├── README.md                 # Хаб: API
│   ├── endpoints.md              # Описание всех endpoints
│   └── examples.md               # Примеры использования
│
├── testing/                      # Тестирование
│   └── README.md                 # Хаб: ссылки на backend/docs/TESTING.md
│
├── architecture/                 # Архитектура
│   ├── README.md                 # Хаб: архитектура
│   ├── overview.md               # Обзор архитектуры
│   ├── backend.md                # Backend архитектура (ссылка)
│   └── frontend.md               # Frontend архитектура (ссылка)
│
├── contributing/                 # Контрибуция
│   ├── README.md                 # Хаб: как контрибутить
│   ├── code-style.md             # Стиль кода
│   └── commits.md                # Правила коммитов
│
└── archive/                      # Архив устаревших документов
    ├── README.md                 # Описание архива
    ├── backend_task.md           # Первоначальное ТЗ
    ├── MIGRATION_DOCKER_STRUCTURE.md
    └── TESTING_AND_DOCS_UPDATE.md
```

## 🔄 План действий

### Фаза 1: Создание структуры

1. Создать директории:
   - getting-started/
   - development/
   - deployment/
   - api/
   - testing/
   - architecture/
   - contributing/
   - archive/

2. Создать README.md хабы для каждой директории

### Фаза 2: Перемещение и актуализация

1. **getting-started/**
   - Создать quick-start.md (новый)
   - Создать installation.md (новый)

2. **development/**
   - Переместить database-setup.md → database.md (обновить пути)
   - Переместить backend-troubleshooting.md → troubleshooting.md (обновить)
   - Переместить frontend-backend-integration.md → integration.md (обновить)
   - Создать setup.md (новый)

3. **deployment/**
   - Объединить DOCKER_COMPOSE_README.md + docker/README.md → docker.md
   - Создать production.md (новый)
   - Создать scripts.md (ссылки на ../scripts/)

4. **api/**
   - Создать endpoints.md (новый, из backend_task.md)
   - Создать examples.md (новый)

5. **testing/**
   - Создать README.md со ссылками на backend/docs/TESTING.md

6. **architecture/**
   - Создать overview.md
   - Ссылки на backend/docs/ и frontend/docs/

7. **contributing/**
   - Переместить/обновить CONTRIBUTING.md
   - Переместить frontend/docs/COMMIT_MESSAGES.md

8. **archive/**
   - Переместить backend_task.md
   - Переместить MIGRATION_DOCKER_STRUCTURE.md
   - Переместить TESTING_AND_DOCS_UPDATE.md

### Фаза 3: Обновление ссылок

1. Обновить все ссылки в документах
2. Обновить INDEX.md
3. Обновить README.md
4. Проверить все ссылки работают

### Фаза 4: Очистка

1. Удалить дублирующиеся документы
2. Удалить временные файлы (после перемещения в archive)
3. Обновить .gitignore если нужно

## 📋 Маппинг документов

| Текущий файл                    | →                    | Новое расположение             | Действие                    |
| ------------------------------- | -------------------- | ------------------------------ | --------------------------- |
| README.md                       | -                    | docs/README.md                 | Обновить                    |
| INDEX.md                        | -                    | docs/INDEX.md                  | Обновить                    |
| database-setup.md               | →                    | development/database.md        | Переместить + обновить пути |
| backend-troubleshooting.md      | →                    | development/troubleshooting.md | Переместить + обновить      |
| frontend-backend-integration.md | →                    | development/integration.md     | Переместить + обновить      |
| DOCKER_COMPOSE_README.md        | + docker/README.md → | deployment/docker.md           | Объединить                  |
| backend_task.md                 | →                    | archive/backend_task.md        | Архивировать                |
| MIGRATION_DOCKER_STRUCTURE.md   | →                    | archive/                       | Архивировать                |
| TESTING_AND_DOCS_UPDATE.md      | →                    | archive/                       | Архивировать                |

## ✅ Преимущества новой структуры

1. **Логическая организация** - документы группируются по темам
2. **Навигация** - README хабы в каждой директории
3. **Нет дублирования** - ссылки вместо копирования
4. **Актуальность** - обновлены все пути и ссылки
5. **Масштабируемость** - легко добавлять новые документы
6. **Чистота** - архив для устаревших документов

---

**Статус:** 🔄 В процессе
