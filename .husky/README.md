# Husky Git Hooks

Этот каталог содержит Git хуки, настроенные с помощью Husky для обеспечения
качества кода и коммитов.

## Установленные хуки

### 🔍 `pre-commit`

- Запускает `lint-staged` для проверки и форматирования файлов
- Выполняет тесты перед коммитом
- Предотвращает коммит, если есть ошибки линтера или тесты не проходят

### 📝 `commit-msg`

- Проверяет сообщения коммитов с помощью `commitlint`
- Обеспечивает соответствие Conventional Commits стандарту
- Блокирует коммиты с неправильным форматом сообщений

### 🔧 `prepare-commit-msg`

- Автоматически добавляет номер задачи из ветки в сообщение коммита
- Работает с ветками формата: `feature/TASK-123`, `fix/BUG-456`

### 📋 `post-commit`

- Проверяет необходимость обновления CHANGELOG.md
- Уведомляет о новых изменениях, которые должны быть документированы

## Использование

### Стандартные коммиты

```bash
git add .
git commit -m "feat: add new avatar generation feature"
```

### Интерактивные коммиты (рекомендуется)

```bash
npm run commit
# или
npx git-cz
```

### Формат сообщений коммитов

Сообщения коммитов должны следовать
[Conventional Commits](https://www.conventionalcommits.org/) стандарту:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Типы коммитов:

- `feat`: новая функция
- `fix`: исправление бага
- `docs`: изменения в документации
- `style`: форматирование кода
- `refactor`: рефакторинг
- `perf`: улучшение производительности
- `test`: добавление тестов
- `build`: изменения в сборке
- `ci`: изменения в CI/CD
- `chore`: рутинные задачи
- `revert`: откат изменений

#### Области (scope):

- `backend`: изменения в бэкенде
- `frontend`: изменения во фронтенде
- `api`: изменения в API
- `ui`: изменения в интерфейсе
- `docker`: изменения в Docker
- `docs`: изменения в документации
- `config`: изменения в конфигурации
- `deps`: обновление зависимостей

#### Примеры:

```bash
feat(backend): add avatar generation endpoint
fix(frontend): resolve image loading issue
docs: update API documentation
chore(deps): update dependencies
```

## Настройка

Для настройки хуков выполните:

```bash
npm install
npm run prepare
```

## Отключение хуков

Для временного отключения хуков используйте флаг `--no-verify`:

```bash
git commit -m "wip: work in progress" --no-verify
```

⚠️ **Внимание**: Используйте `--no-verify` только в исключительных случаях!
