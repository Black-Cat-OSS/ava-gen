# Руководство по контрибуции

Как внести вклад в развитие Avatar Generator.

## 📚 Содержание

- **[Code Style Guide](./code-style.md)** 🟡 Создается  
  Стандарты оформления кода

- **[Commit Messages](./commits.md)** 🟡 Создается  
  Правила оформления коммитов (см. также
  [Frontend Commit Messages](../../frontend/docs/COMMIT_MESSAGES.md))

- **[Pull Request Guidelines](./pull-requests.md)** 🟡 Создается  
  Правила создания PR

## 🚀 Быстрый старт для контрибуторов

### 1. Подготовка окружения

```bash
# Fork репозитория и клонирование
git clone https://github.com/your-username/avatar-gen.git
cd avatar-gen

# Установка зависимостей
pnpm install

# Настройка git hooks
pnpm prepare
```

### 2. Создание ветки

```bash
# Обновить main
git checkout main
git pull origin main

# Создать feature ветку
git checkout -b feat/your-feature-name
```

### 3. Разработка

```bash
# Запуск в dev режиме
pnpm run dev

# Тестирование
cd backend && npm test

# Линтинг
pnpm run lint
```

### 4. Коммит изменений

```bash
# Staged changes
git add .

# Коммит (husky запустит pre-commit hooks)
git commit -m "feat: add new feature"
# или
pnpm run commit  # Интерактивный commitizen
```

### 5. Pull Request

```bash
# Push ветки
git push origin feat/your-feature-name

# Создать PR на GitHub
```

## 📝 Правила оформления коммитов

### Формат

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** Новая функциональность
- **fix:** Исправление бага
- **docs:** Изменения в документации
- **style:** Форматирование кода (не влияет на логику)
- **refactor:** Рефакторинг кода
- **perf:** Улучшение производительности
- **test:** Добавление или изменение тестов
- **chore:** Вспомогательные изменения (build, CI, etc.)

### Примеры

```bash
feat(avatar): add color scheme support
fix(database): resolve connection timeout issue
docs(api): update endpoints documentation
test(avatar): add unit tests for controller
```

**Подробнее:** [Commit Messages Guide](./commits.md) или
[Frontend Commit Messages](../../frontend/docs/COMMIT_MESSAGES.md)

## 🎨 Стандарты кода

### Форматирование

Проект использует:

- **ESLint** - линтинг
- **Prettier** - форматирование
- **Husky** - git hooks
- **lint-staged** - проверка staged файлов

```bash
# Автоматическое форматирование
pnpm run format

# Проверка линтинга
pnpm run lint

# Автоисправление
pnpm run lint:fix
```

### TypeScript

- Строгий режим (`strict: true`)
- Явная типизация
- Избегать `any`
- Использовать interfaces для объектов

### React

- Функциональные компоненты
- Hooks вместо классов
- TypeScript для props
- JSDoc документация для компонентов

### NestJS

- Модульная архитектура
- Dependency Injection
- DTO для validation
- JSDoc для методов

## ✅ Чеклист перед PR

- [ ] Код отформатирован (`pnpm run format`)
- [ ] Линтинг пройден (`pnpm run lint`)
- [ ] Тесты проходят (`npm test`)
- [ ] Добавлены новые тесты (если нужно)
- [ ] Документация обновлена
- [ ] Коммиты оформлены правильно
- [ ] Нет console.log в production коде
- [ ] Проверено на разных размерах экрана (для UI)

## 🐛 Reporting Bugs

### Формат issue

**Название:**

```
[Bug] Краткое описание проблемы
```

**Описание:**

```markdown
## Описание

Что пошло не так

## Воспроизведение

1. Шаг 1
2. Шаг 2
3. Ошибка

## Ожидаемое поведение

Что должно было произойти

## Фактическое поведение

Что произошло

## Окружение

- OS: Windows 10
- Node: 20.11.0
- Browser: Chrome 120
```

## 💡 Feature Requests

### Формат issue

**Название:**

```
[Feature] Название фичи
```

**Описание:**

```markdown
## Проблема

Какую проблему решает

## Решение

Предлагаемое решение

## Альтернативы

Рассмотренные альтернативы

## Дополнительный контекст

Скриншоты, примеры, ссылки
```

## 📚 Полезные ресурсы

- [Contributing Guidelines](../../CONTRIBUTING.md) - Основные правила
- [Code of Conduct](../../CODE_OF_CONDUCT.md) - Кодекс поведения (если есть)
- [Development Guide](../development/README.md) - Руководство разработчика

## 🔗 Связанные разделы

- [Development Setup](../development/README.md)
- [Testing Guide](../testing/README.md)
- [Architecture](../architecture/README.md)

---

**Обновлено:** 2025-10-03
