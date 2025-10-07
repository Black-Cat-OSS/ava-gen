# Руководство по написанию сообщений коммитов

## Общие принципы

Хорошие сообщения коммитов помогают команде понимать историю изменений проекта и
упрощают отладку. Следуйте этим принципам:

### 1. Используйте повелительное наклонение

- ✅ **Правильно**: `Add user authentication`
- ❌ **Неправильно**: `Added user authentication` или
  `Adding user authentication`

### 2. Первая строка должна быть краткой (до 50 символов)

- ✅ **Правильно**: `Fix login validation bug`
- ❌ **Неправильно**:
  `Fix the bug that occurs when user enters invalid email during login process`

### 3. Используйте заглавную букву в начале

- ✅ **Правильно**: `Update dependencies`
- ❌ **Неправильно**: `update dependencies`

### 4. Не ставьте точку в конце первой строки

- ✅ **Правильно**: `Implement dark mode`
- ❌ **Неправильно**: `Implement dark mode.`

## Структура сообщения коммита

```
<тип>(<область>): <краткое описание>

<подробное описание>

<ссылки на задачи>
```

### Типы коммитов

| Тип        | Описание                                             | Пример                                    |
| ---------- | ---------------------------------------------------- | ----------------------------------------- |
| `feat`     | Новая функциональность                               | `feat(auth): add OAuth2 login`            |
| `fix`      | Исправление бага                                     | `fix(ui): resolve button alignment issue` |
| `docs`     | Изменения в документации                             | `docs: update API documentation`          |
| `style`    | Форматирование, отсутствующие точки с запятой и т.д. | `style: fix indentation in components`    |
| `refactor` | Рефакторинг кода                                     | `refactor(api): simplify user service`    |
| `test`     | Добавление или изменение тестов                      | `test: add unit tests for auth service`   |
| `chore`    | Изменения в процессе сборки, зависимостях и т.д.     | `chore: update webpack configuration`     |
| `perf`     | Улучшения производительности                         | `perf(db): optimize user queries`         |
| `ci`       | Изменения в CI/CD                                    | `ci: add GitHub Actions workflow`         |
| `build`    | Изменения в системе сборки                           | `build: update Vite to v5.0`              |
| `revert`   | Откат предыдущего коммита                            | `revert: "feat: add new dashboard"`       |

### Области (Scope)

Область указывает на часть кодовой базы, которая была затронута:

- `auth` - аутентификация и авторизация
- `ui` - пользовательский интерфейс
- `api` - API и бэкенд
- `db` - база данных
- `config` - конфигурация
- `deps` - зависимости
- `docs` - документация
- `test` - тестирование

## Примеры хороших сообщений коммитов

### Простые коммиты

**На английском языке:**

```
feat: add user registration form
fix: resolve memory leak in data service
docs: update installation guide
style: format code with Prettier
```

**На русском языке:**

```
фича: добавить форму регистрации пользователя
исправление: устранить утечку памяти в сервисе данных
документация: обновить руководство по установке
стиль: отформатировать код с помощью Prettier
```

### Коммиты с областью

**На английском языке:**

```
feat(auth): implement JWT token refresh
fix(ui): center align login form
refactor(api): extract validation logic
test(components): add Button component tests
```

**На русском языке:**

```
фича(аутентификация): реализовать обновление JWT токена
исправление(интерфейс): выровнять форму входа по центру
рефакторинг(бэкенд): выделить логику валидации
тест(компоненты): добавить тесты для компонента Button
```

### Коммиты с подробным описанием

```
feat(auth): add password reset functionality

- Add password reset request endpoint
- Implement email sending service
- Create password reset form component
- Add validation for reset token

Closes #123
```

### Коммиты с несколькими изменениями

```
feat: add dark mode support

- Add theme context and provider
- Create theme toggle component
- Update all components to support dark mode
- Add theme persistence in localStorage

Resolves #45, #67
```

## Примеры плохих сообщений коммитов

❌ **Слишком общие:**

- `Update files`
- `Fix stuff`
- `Changes`
- `WIP`

❌ **Слишком длинные:**

- `Fix the bug that occurs when user tries to login with invalid credentials and the system shows an error message`

❌ **Неправильное наклонение:**

- `Fixed login bug`
- `Adding new feature`

❌ **Без контекста:**

- `Fix`
- `Update`
- `Test`

## Дополнительные рекомендации

### 1. Используйте эмодзи (опционально)

```
✨ feat: add new feature
🐛 fix: resolve bug
📚 docs: update documentation
🎨 style: improve code formatting
♻️ refactor: restructure code
✅ test: add test coverage
```

### 2. Ссылки на задачи

- `Closes #123` - закрывает задачу
- `Resolves #456` - решает проблему
- `Refs #789` - ссылается на задачу
- `Fixes #101` - исправляет баг

### 3. Breaking changes

Если коммит содержит breaking changes, добавьте `BREAKING CHANGE:` в тело
сообщения:

```
feat(api): change user authentication method

BREAKING CHANGE: The login endpoint now requires email instead of username.
Update your client code accordingly.

Closes #234
```

### 4. Множественные коммиты

Если коммит затрагивает несколько областей, используйте несколько типов:

```
feat(auth,ui): add login functionality

- Add authentication service
- Create login form component
- Update routing configuration
```

## Инструменты для проверки

### Commitlint (уже настроен в проекте)

Проект использует commitlint для автоматической проверки сообщений коммитов. Все
коммиты проверяются автоматически при создании.

#### Доступные команды

```bash
# Проверить последний коммит
pnpm commitlint:check

# Интерактивная проверка (для исправления коммита)
pnpm commitlint
```

#### Настройка

Конфигурация commitlint находится в файле `commitlint.config.js` в корне
проекта. Настройки включают:

- **Типы коммитов**: feat, fix, docs, style, refactor, test, chore, perf, ci,
  build, revert
- **Области (scope)**: ui, auth, api, db, config, deps, docs, test, build, ci,
  chore, perf, refactor, style, types, utils, hooks, context, router, i18n,
  theme, layout, components, pages, widgets, features, entities, shared
- **Правила форматирования**: длина заголовка, регистр, пунктуация и т.д.

### Commitizen (опционально)

Для интерактивного создания коммитов можно использовать Commitizen:

```bash
npm install -g commitizen
npm install -g cz-conventional-changelog
```

### Исправление ошибок commitlint

Если commitlint отклонил ваш коммит, вы можете:

1. **Исправить сообщение коммита**:

   ```bash
   git commit --amend -m "feat(ui): add button variants"
   ```

2. **Использовать интерактивную проверку**:

   ```bash
   pnpm commitlint
   ```

3. **Проверить последний коммит**:
   ```bash
   pnpm commitlint:check
   ```

#### Частые ошибки и их исправления

| Ошибка                                         | Причина                   | Исправление                              |
| ---------------------------------------------- | ------------------------- | ---------------------------------------- |
| `type must be one of [feat, fix, ...]`         | Неправильный тип          | Используйте один из разрешенных типов    |
| `scope must be one of [ui, auth, ...]`         | Неправильная область      | Используйте одну из разрешенных областей |
| `subject may not be empty`                     | Пустое описание           | Добавьте краткое описание                |
| `subject must not end with full stop`          | Точка в конце             | Уберите точку                            |
| `subject must start with capital letter`       | Строчная буква            | Начните с заглавной буквы                |
| `header must not be longer than 72 characters` | Слишком длинный заголовок | Сократите описание                       |

## Заключение

Следование этим правилам поможет:

- Легче понимать историю изменений
- Быстрее находить нужные коммиты
- Автоматически генерировать changelog
- Улучшить качество кодовой базы

Помните: хорошие сообщения коммитов - это инвестиция в будущее проекта!
