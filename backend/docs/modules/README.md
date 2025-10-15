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

Модуль для работы с файловым хранилищем.

**Документация:** Coming soon

### Health Module

**Статус:** ✅ Production Ready  
**Покрытие тестами:** 100%

Модуль для проверки здоровья приложения.

**Документация:** Coming soon

### Initialization Module

**Статус:** ✅ Production Ready

Модуль для инициализации директорий приложения.

**Документация:**
- [README](../../src/modules/initialization/README.md)
- [Usage Guide](../../src/modules/initialization/USAGE.md)

## 🔗 Связанные разделы

- [Testing](../testing/README.md) - Тестирование модулей
- [Changelog](../changelog/README.md) - История изменений
- [Main Documentation](../../README.md) - Главная документация backend

---

**Обновлено:** 2025-10-03

