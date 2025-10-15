# Backend Documentation Structure

Структура и организация документации backend-части проекта.

## 📁 Структура директорий

```
backend/
├── docs/                           # 📚 Вся документация backend
│   ├── INDEX.md                   # 🏠 Навигация по документации
│   ├── README.md                  # 📖 Основное руководство
│   ├── DOCUMENTATION_STRUCTURE.md # 📋 Этот файл
│   └── modules/                   # 📦 Документация модулей
│       └── database/              # Database Module
│           ├── README.md          # Руководство по использованию
│           ├── ARCHITECTURE.md    # Архитектура модуля
│           ├── MIGRATION_GUIDE.md # Руководство по миграции
│           ├── CHANGELOG_MODULE.md# История изменений
│           └── HOTFIX_v3.0.1.md  # Hotfix документация
├── src/
│   └── modules/
│       └── database/              # Код модуля (БЕЗ .md файлов)
│           ├── constants/
│           ├── interfaces/
│           ├── providers/
│           ├── database.service.ts
│           ├── database.module.ts
│           └── index.ts
└── README.md                      # Краткое руководство + ссылка на docs/
```

## 🎯 Принципы организации

### 1. Разделение кода и документации

**Код:** `backend/src/`  
**Документация:** `backend/docs/`

```
✅ ПРАВИЛЬНО:
backend/docs/modules/database/README.md
backend/src/modules/database/database.service.ts

❌ НЕПРАВИЛЬНО:
backend/src/modules/database/README.md (документация в коде)
```

### 2. Зеркальная структура

Документация модулей повторяет структуру `src/modules/`:

```
src/modules/
├── database/          →  docs/modules/database/
├── avatar/            →  docs/modules/avatar/ (будущее)
└── logger/            →  docs/modules/logger/ (будущее)
```

### 3. Типы документов

#### INDEX.md

- Главная навигация по всей документации
- Краткие описания разделов
- Ссылки на все документы

#### README.md

- Основное руководство модуля/проекта
- Quick Start
- API Reference
- Примеры использования

#### ARCHITECTURE.md

- Архитектурные решения
- Паттерны проектирования
- Технические детали
- Обоснование решений

#### MIGRATION_GUIDE.md

- Инструкции по миграции между версиями
- Breaking changes
- Примеры "до/после"
- Checklist для миграции

#### CHANGELOG.md

- История изменений
- Формат: [Keep a Changelog](https://keepachangelog.com/)
- Версионирование: [Semantic Versioning](https://semver.org/)

#### HOTFIX\_\*.md

- Описание критической проблемы
- Причины возникновения
- Подробное решение
- Проверка исправления

## 📝 Соглашения о именовании

### Файлы документации

```
README.md              # Основное руководство
ARCHITECTURE.md        # Архитектура
MIGRATION_GUIDE.md     # Миграция
CHANGELOG.md           # История изменений
CHANGELOG_MODULE.md    # История конкретного модуля
HOTFIX_vX.Y.Z.md      # Hotfix с версией
DOCUMENTATION_STRUCTURE.md  # Структура документации
```

### Директории

```
docs/                  # Корень документации
docs/modules/          # Документация модулей
docs/api/             # API документация (если есть)
docs/guides/          # Руководства (если нужно)
```

## 🔗 Ссылки в документации

### Внутренние ссылки

Используйте относительные пути:

```markdown
<!-- Из docs/INDEX.md -->

[Database README](./modules/database/README.md)

<!-- Из docs/modules/database/README.md -->

[Architecture](./ARCHITECTURE.md)
[Main Index](../../INDEX.md)

<!-- Из backend/README.md -->

[Full Documentation](./docs/INDEX.md)
[Database Module](./docs/modules/database/README.md)
```

### Внешние ссылки

Используйте абсолютные URL:

```markdown
[NestJS Documentation](https://docs.nestjs.com/)
[Prisma Documentation](https://www.prisma.io/docs/)
```

## 📦 Добавление нового модуля

При создании нового модуля:

### 1. Создайте директорию документации

```bash
mkdir -p backend/docs/modules/new-module
```

### 2. Создайте минимальный набор документов

```
backend/docs/modules/new-module/
├── README.md           # Обязательно
├── ARCHITECTURE.md     # Рекомендуется
└── CHANGELOG.md        # Рекомендуется
```

### 3. Обновите индексный файл

Добавьте ссылки в `backend/docs/INDEX.md`:

```markdown
#### New Module

- **[New Module README](./modules/new-module/README.md)** - Описание модуля
- **[Architecture](./modules/new-module/ARCHITECTURE.md)** - Архитектура
```

### 4. Обновите корневой README

Добавьте ссылку в `backend/README.md`:

```markdown
- **[docs/modules/new-module/](./docs/modules/new-module/)** - Документация New Module
```

## 🔍 Навигация по документации

### Точки входа

1. **backend/README.md** - Быстрый старт, основная информация
2. **backend/docs/INDEX.md** - Полная навигация по документации
3. **backend/docs/modules/[module]/README.md** - Документация конкретного модуля

### Рекомендуемый порядок чтения

#### Для новых разработчиков

1. `backend/README.md` - Общее представление
2. `backend/docs/INDEX.md` - Обзор документации
3. `backend/docs/modules/database/README.md` - Работа с БД
4. `backend/docs/modules/database/ARCHITECTURE.md` - Архитектурные решения

#### Для миграции

1. `backend/docs/modules/[module]/CHANGELOG.md` - Что изменилось
2. `backend/docs/modules/[module]/MIGRATION_GUIDE.md` - Как мигрировать
3. `backend/docs/modules/[module]/README.md` - Новое API

#### Для troubleshooting

1. `backend/docs/modules/[module]/HOTFIX_*.md` - Известные проблемы
2. `backend/docs/modules/[module]/CHANGELOG.md` - История изменений
3. `backend/docs/modules/[module]/ARCHITECTURE.md` - Как это работает

## 🛠️ Поддержка документации

### Когда обновлять

- **README.md** - При изменении API, добавлении функций
- **ARCHITECTURE.md** - При изменении архитектуры, паттернов
- **MIGRATION_GUIDE.md** - При breaking changes
- **CHANGELOG.md** - После каждого релиза
- **HOTFIX\_\*.md** - При критических исправлениях

### Checklist при изменениях

```
□ Обновлен README.md модуля
□ Добавлена запись в CHANGELOG.md
□ Обновлен MIGRATION_GUIDE.md (если breaking changes)
□ Обновлены внутренние ссылки
□ Проверены примеры кода
□ Обновлен INDEX.md (если новые файлы)
□ Обновлен корневой README.md (если новые модули)
```

## 📊 Статистика документации

### Текущее состояние

```
Модулей с документацией: 1 (Database)
Всего документов: 6
Общий размер: ~50KB

Database Module:
├── README.md           ✅ ~20KB (полный)
├── ARCHITECTURE.md     ✅ ~15KB (детальный)
├── MIGRATION_GUIDE.md  ✅ ~10KB (подробный)
├── CHANGELOG_MODULE.md ✅ ~5KB (история)
└── HOTFIX_v3.0.1.md   ✅ ~5KB (решение)
```

### Планы

```
□ Avatar Module - Документация генерации аватаров
□ Logger Module - Документация логирования
□ Storage Module - Документация хранилища
□ API Documentation - Детальное описание API
□ Deployment Guide - Руководство по развертыванию
```

## 🎓 Best Practices

### 1. Пишите для людей, не для машин

```markdown
✅ ХОРОШО:
Этот метод подключается к базе данных и возвращает список пользователей.
Если подключение не удалось, автоматически повторяет попытку 3 раза.

❌ ПЛОХО:
connectAndGetUsers(): Promise<User[]>
```

### 2. Используйте примеры кода

```markdown
✅ ХОРОШО:
\`\`\`typescript
const users = await this.db.user.findMany();
\`\`\`

❌ ПЛОХО:
Вызовите метод findMany() на модели user
```

### 3. Структурируйте информацию

```markdown
✅ ХОРОШО:

## API Reference

### getUserById(id: string)

**Параметры:**

- `id` - Уникальный идентификатор

**Возвращает:** User или null

**Ошибки:** NotFoundException

❌ ПЛОХО:
getUserById принимает id и возвращает User или null или выбрасывает NotFoundException
```

### 4. Обновляйте документацию вместе с кодом

```bash
# ✅ ПРАВИЛЬНО: Один коммит для кода и документации
git add src/modules/database/
git add docs/modules/database/
git commit -m "feat(database): add connection pooling"

# ❌ НЕПРАВИЛЬНО: Отдельные коммиты
git commit -m "feat(database): add connection pooling"
# ... время проходит ...
git commit -m "docs: update database docs"
```

## 🔄 История реорганизации

### 2025-10-01: Создание директории docs/

**Причина:** Разделение кода и документации

**Изменения:**

- Создана `backend/docs/`
- Перемещены все `.md` файлы из `backend/src/modules/database/`
- Создан `docs/INDEX.md` для навигации
- Обновлены ссылки в `backend/README.md`
- Создана зеркальная структура `docs/modules/`

**Результат:**

```
До:  backend/src/modules/database/*.md (5 файлов)
После: backend/docs/modules/database/*.md (5 файлов)
       backend/docs/INDEX.md (новый)
       backend/docs/README.md (копия корневого)
```

---

**Последнее обновление:** 2025-10-01  
**Автор:** Development Team  
**Версия:** 1.0.0
