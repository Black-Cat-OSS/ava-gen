# Backend Documentation

Полная документация backend-части проекта Avatar Generation.

## 📚 Оглавление

### Основная документация

- **[README.md](./README.md)** - Основное руководство по backend
  - Быстрый старт
  - API эндпоинты
  - Конфигурация
  - Docker
  - Разработка

### Документация модулей

### Модули приложения

#### Initialization Module

- **[Initialization README](../src/modules/initialization/README.md)** - Руководство по модулю инициализации
  - Автоматическое создание директорий на основе настроек
  - Динамическое извлечение путей из `settings.yaml`
  - Расширяемая архитектура для будущих инициализаторов
  - Управление жизненным циклом

#### Database Module

- **[Database README](./modules/database/README.md)** - Полное руководство по модулю баз данных
- **[Architecture](./modules/database/ARCHITECTURE.md)** - Детальная архитектура и управление жизненным циклом
- **[Migration Guide](./modules/database/MIGRATION_GUIDE.md)** - Руководство по использованию и миграции
- **[Changelog](./modules/database/CHANGELOG_MODULE.md)** - История изменений модуля
- **[Hotfix v3.0.1](./modules/database/HOTFIX_v3.0.1.md)** - Исправление проблемы множественных подключений

## 🏗️ Архитектура проекта

```
backend/
├── docs/                       # 📚 Документация (этот каталог)
│   ├── INDEX.md               # Навигация по документации
│   ├── README.md              # Основное руководство
│   ├── DOCUMENTATION_STRUCTURE.md  # Структура документации
│   └── modules/               # Документация модулей
│       ├── initialization/    # Initialization Module docs
│       └── database/          # Database Module docs
├── src/
│   ├── config/                # Конфигурация
│   ├── modules/               # Модули приложения
│   │   ├── app/              # Корневой модуль
│   │   ├── avatar/           # Генерация аватаров
│   │   ├── database/         # Работа с БД
│   │   ├── initialization/   # Модуль инициализации
│   │   ├── logger/           # Логирование
│   │   └── storage/          # Хранение файлов
│   ├── common/               # Общие компоненты
│   └── main.ts               # Точка входа
├── prisma/                   # Prisma схемы и миграции
├── storage/                  # Хранилище файлов (автоматически создается)
│   ├── avatars/              # Сгенерированные аватары
│   └── database/             # SQLite база данных
├── scripts/                  # Вспомогательные скрипты
└── settings.yaml            # Конфигурация приложения
```

## 📖 Быстрая навигация

### Для начала работы

1. [Основной README](./README.md#quick-start) - Установка и запуск
2. [API Endpoints](./README.md#api-endpoints) - Доступные эндпоинты
3. [Конфигурация](./README.md#configuration) - Настройка приложения

### Для разработчиков

1. [Database Module](./modules/database/README.md) - Работа с базами данных
2. [Database Architecture](./modules/database/ARCHITECTURE.md) - Архитектура модуля БД
3. [Migration Guide](./modules/database/MIGRATION_GUIDE.md) - Руководство по использованию

### Для troubleshooting

1. [Database Hotfix v3.0.1](./modules/database/HOTFIX_v3.0.1.md) - Решение проблемы множественных подключений
2. [Database Changelog](./modules/database/CHANGELOG_MODULE.md) - История изменений и известные проблемы

## 🔧 Модули приложения

### Database Module (модуль баз данных)

**Статус:** ✅ Stable (v3.0.1)

**Описание:** Модуль для работы с базами данных, поддерживающий SQLite и PostgreSQL с единым интерфейсом взаимодействия.

**Ключевые особенности:**

- ✅ Поддержка SQLite и PostgreSQL
- ✅ Паттерн Facade для управления провайдерами
- ✅ Factory Provider - создается только выбранная БД
- ✅ Нулевой overhead от неиспользуемых провайдеров
- ✅ Автоматический retry при подключении
- ✅ Health check
- ✅ Полная типизация через TypeScript

**Документация:**

- [README](./modules/database/README.md) - API и примеры использования
- [Architecture](./modules/database/ARCHITECTURE.md) - Архитектурные решения
- [Migration Guide](./modules/database/MIGRATION_GUIDE.md) - Использование и миграция

### Avatar Module (генерация аватаров)

**Статус:** ✅ Stable

**Описание:** Модуль для генерации и управления аватарами.

**Ключевые особенности:**

- Генерация уникальных аватаров
- Поддержка цветовых схем
- Применение фильтров
- Множественные размеры изображений

### Logger Module (логирование)

**Статус:** ✅ Stable

**Описание:** Модуль для централизованного логирования с использованием Pino.

### Storage Module (хранение файлов)

**Статус:** ✅ Stable

**Описание:** Модуль для работы с файловой системой и хранения сгенерированных аватаров.

## 📝 Соглашения о документации

### Структура документации модуля

Каждый модуль должен иметь следующую документацию:

```
docs/modules/[module-name]/
├── README.md           # Основное руководство
├── ARCHITECTURE.md     # Архитектура (опционально)
├── MIGRATION_GUIDE.md  # Руководство по миграции (при изменениях API)
├── CHANGELOG.md        # История изменений
└── HOTFIX_*.md        # Документация hotfix'ов (если есть)
```

### Формат документации

- **README.md** - Описание, API, примеры использования
- **ARCHITECTURE.md** - Архитектурные решения, паттерны, принципы
- **MIGRATION_GUIDE.md** - Инструкции по миграции между версиями
- **CHANGELOG.md** - История изменений в формате Keep a Changelog
- **HOTFIX\_\*.md** - Описание проблемы, причины и решения

## 🤝 Участие в разработке

При добавлении новых модулей или изменении существующих:

1. Создайте/обновите документацию в `docs/modules/[module-name]/`
2. Обновите этот индексный файл (`docs/INDEX.md`)
3. Добавьте ссылки в основной README
4. Следуйте соглашениям о документации

## 📌 Версионирование документации

Документация версионируется вместе с кодом:

- **Major** - Несовместимые изменения API
- **Minor** - Новые функции (обратно совместимые)
- **Patch** - Исправления ошибок

## 🔗 Полезные ссылки

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Последнее обновление:** 2025-10-01  
**Версия:** 1.0.0
