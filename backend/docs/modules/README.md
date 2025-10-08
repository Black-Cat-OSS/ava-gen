# Backend Modules Documentation

Документация модулей backend приложения Avatar Generator.

## 📦 Модули

### [Database Module](./database/)

**Статус:** ✅ Production Ready  
**Версия:** 3.0.1

Модуль для работы с базами данных (SQLite/PostgreSQL) с единым интерфейсом.

**Документация:**

- [README](./database/README.md) - Полное руководство по использованию
- [Architecture](./database/ARCHITECTURE.md) - Архитектура и жизненный цикл
- [Migration Guide](./database/MIGRATION_GUIDE.md) - Руководство по миграции
- [Changelog](./database/CHANGELOG_MODULE.md) - История изменений
- [Hotfix v3.0.1](./database/HOTFIX_v3.0.1.md) - Factory Provider решение

**Ключевые особенности:**

- ✅ Поддержка SQLite и PostgreSQL
- ✅ Facade Pattern для управления провайдерами
- ✅ Factory Provider - создается только выбранная БД
- ✅ Нулевой overhead от неиспользуемых провайдеров
- ✅ Автоматический retry при подключении
- ✅ Health check

### Avatar Module

**Статус:** ✅ Production Ready

Модуль для генерации и управления аватарами.

**Документация:** Coming soon

### Logger Module

**Статус:** ✅ Production Ready

Модуль для централизованного логирования (Pino).

**Документация:** Coming soon

### Storage Module

**Статус:** ✅ Production Ready  
**Версия:** 1.0.0  
**Покрытие тестами:** 100% (94/94 тестов)

Модуль для работы с хранилищем аватаров. Поддерживает локальное хранилище и S3-совместимые облачные хранилища.

**Документация:**

- [Storage Module](./storage/STORAGE_MODULE.md) - Главный модуль с Registry Pattern
- [Local Storage](./storage/LOCAL_STORAGE.md) - Локальное файловое хранилище
- [S3 Storage](./storage/S3_STORAGE.md) - Высокоуровневый S3 модуль для аватаров
- [S3 Module](./s3/README.md) - Корневой S3 модуль (низкоуровневый API)

**Ключевые особенности:**

- ✅ **Registry Pattern** - легко добавлять новые типы хранилищ
- ✅ **Type Safety** - интерфейсы `IStorageModule` и `IStorageStrategy`
- ✅ **Условный импорт** - загружается только нужный модуль
- ✅ Strategy Pattern для переключения между типами
- ✅ Dynamic Modules (NestJS best practices)
- ✅ Автоматический retry для S3 подключения
- ✅ Полное покрытие тестами

**Архитектура:**

```
StorageModule (динамический модуль с Registry)
├─ LocalStorageModule (implements IStorageModule)
│  └─ LocalStorageService (implements IStorageStrategy)
└─ S3StorageModule (implements IStorageModule)
   └─ S3Service (корневой модуль для S3 API)
```

### S3 Module (корневой)

**Статус:** ✅ Production Ready  
**Версия:** 1.0.0  
**Покрытие тестами:** 100%

Низкоуровневый модуль для работы с S3 API. Может использоваться различными модулями приложения.

**Документация:**

- [S3 Module](./s3/README.md) - Полное руководство

**Ключевые особенности:**

- ✅ Низкоуровневый S3 API (upload, get, delete, exists)
- ✅ Retry логика с настраиваемыми параметрами
- ✅ Health checks и reconnect
- ✅ Совместимость с любыми S3-совместимыми хранилищами
- ✅ Может использоваться для любых данных (не только аватары)

### Health Module

**Статус:** ✅ Production Ready  
**Покрытие тестами:** 100%

Модуль для проверки здоровья приложения.

**Документация:** Coming soon

### Initialization Module

**Статус:** ✅ Production Ready

Модуль для инициализации директорий приложения.

**Документация:**

- [README](./initialization/README.md) - Полное руководство по использованию
- [Usage Guide](./initialization/USAGE.md) - Краткое руководство по использованию

**Ключевые особенности:**

- ✅ Автоматическое создание директорий на основе конфигурации
- ✅ Плагинная архитектура с приоритетами
- ✅ Поддержка SQLite и PostgreSQL конфигураций
- ✅ Мониторинг и логирование инициализации
- ✅ Безопасное создание директорий с проверкой прав доступа

### Config Module

**Статус:** ✅ Production Ready

Модуль для загрузки и валидации конфигурации приложения.

**Документация:**

- [README](./config/README.md) - Полное руководство по конфигурации

**Ключевые особенности:**

- ✅ Поддержка окружений (development, production, test)
- ✅ Валидация конфигурации через Zod
- ✅ Объединение конфигураций с приоритетами
- ✅ TypeScript типизация
- ✅ Кэширование конфигурации

## 🔗 Связанные разделы

- [Testing](../testing/README.md) - Тестирование модулей
- [Changelog](../changelog/README.md) - История изменений
- [Main Documentation](../../README.md) - Главная документация backend

---

**Обновлено:** 2025-10-03
