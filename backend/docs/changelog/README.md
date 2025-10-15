# Backend Changelog

История изменений backend приложения Avatar Generator.

## 📋 Документы

### [Changelog 2025-10-01](./CHANGELOG_2025-10-01.md)

Изменения за 2025-10-01:

- 🗃️ Перемещение SQLite базы данных из `prisma/storage/` в `storage/database/`
- 💡 Программное задание datasourceUrl в Prisma провайдерах
- 📊 Итоговая структура хранения данных

**Ключевые изменения:**

- Логическое группирование всех данных в `storage/`
- Упрощение backup и Docker volumes
- Независимость от .env файлов
- Централизованная конфигурация через `settings.yaml`

### [Initialization Module Update](./INITIALIZATION_MODULE_UPDATE.md)

Обновление модуля инициализации:

- Динамическое чтение директорий из `settings.yaml`
- Рефакторинг с жестко заданных путей на конфигурационные
- Расширяемая архитектура для новых типов ресурсов

**До:**

```typescript
private readonly requiredDirectories = {
  storage: ['storage', 'storage/avatars'],
};
```

**После:**

```typescript
// Директории извлекаются из settings.yaml
extractDirectoriesFromConfig(): string[]
```

## 📚 История версий

### v0.0.2 (2025-10-03)

- 50 unit и E2E тестов
- Реорганизация Docker структуры
- Реорганизация документации
- Обновлена лицензия (MIT)
- Factory Provider для Database Module

### v0.0.1 (2025-10-01)

- Поддержка PostgreSQL и SQLite
- Система повторных попыток подключения к БД
- YAML конфигурация с окружениями
- Docker Compose конфигурация

## 🔗 Связанные разделы

- [Modules Documentation](../modules/README.md)
- [Database Module Changelog](../modules/database/CHANGELOG_MODULE.md)
- [Testing](../testing/README.md)
- [Root Changelog](../../../CHANGELOG.md) - Общий changelog проекта

---

**Обновлено:** 2025-10-03
