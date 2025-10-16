# Начало работы

## 🎯 Цель

Сделать первые шаги в качестве контрибьютора Avatar Generator.

## ⏱️ Время изучения

**20 минут**

## 📋 Предварительные знания

- Опыт работы с Git
- Аккаунт на GitHub
- [Модуль 2: Разработчики](../02-developers/01-development-setup.md) - окружение
  разработки

## 🚀 Шаг 1: Fork репозитория

### 1.1 Перейдите на GitHub

Откройте
[https://github.com/letnull19A/avatar-gen](https://github.com/letnull19A/avatar-gen)
в браузере.

### 1.2 Создайте Fork

Нажмите кнопку **"Fork"** в правом верхнем углу страницы.

Это создаст копию репозитория в вашем аккаунте:
`https://github.com/YOUR_USERNAME/avatar-gen`

## 🔧 Шаг 2: Клонирование и настройка

### 2.1 Клонируйте ваш Fork

```bash
# Замените YOUR_USERNAME на ваш GitHub username
git clone https://github.com/YOUR_USERNAME/avatar-gen.git
cd avatar-gen
```

### 2.2 Добавьте upstream remote

```bash
# Добавьте оригинальный репозиторий как upstream
git remote add upstream https://github.com/letnull19A/avatar-gen.git

# Проверьте что remotes настроены правильно
git remote -v
```

**Ожидаемый вывод:**

```
origin    https://github.com/YOUR_USERNAME/avatar-gen.git (fetch)
origin    https://github.com/YOUR_USERNAME/avatar-gen.git (push)
upstream  https://github.com/letnull19A/avatar-gen.git (fetch)
upstream  https://github.com/letnull19A/avatar-gen.git (push)
```

### 2.3 Синхронизируйтесь с upstream

```bash
# Получите последние изменения из оригинального репозитория
git fetch upstream

# Переключитесь на main ветку
git checkout main

# Обновите вашу main ветку
git merge upstream/main

# Отправьте обновления в ваш Fork
git push origin main
```

## 🌿 Шаг 3: Создание feature ветки

### 3.1 Выберите задачу

Просмотрите [Issues](https://github.com/letnull19A/avatar-gen/issues) и выберите
задачу:

- **Good first issue** - для новичков
- **Bug** - исправление ошибок
- **Enhancement** - новая функциональность
- **Documentation** - улучшение документации

### 3.2 Создайте ветку

```bash
# Создайте новую ветку для вашей задачи
git checkout -b feature/issue-123-fix-avatar-generation

# Или для багфикса
git checkout -b fix/issue-456-memory-leak

# Или для документации
git checkout -b docs/update-readme
```

### 3.3 Соглашения по именованию веток

```
feature/{issue-number}-{short-description}  # Новая функциональность
fix/{issue-number}-{short-description}      # Исправление багов
docs/{issue-number}-{short-description}     # Документация
refactor/{issue-number}-{short-description} # Рефакторинг
test/{issue-number}-{short-description}     # Тесты
```

## 🛠️ Шаг 4: Настройка окружения разработки

### 4.1 Установите зависимости

```bash
# Установите зависимости для всего проекта
pnpm install

# Или если pnpm не установлен
npm install
```

### 4.2 Настройте pre-commit hooks

```bash
# Установите husky hooks
pnpm prepare

# Проверьте что hooks работают
git add .
git commit -m "test: setup development environment"
```

### 4.3 Запустите проект

```bash
# Запустите в режиме разработки
pnpm run dev

# Проверьте что все работает
curl http://localhost:3000/api/health
```

## ✏️ Шаг 5: Внесение изменений

### 5.1 Сделайте изменения

Отредактируйте нужные файлы в вашем редакторе.

### 5.2 Проверьте качество кода

```bash
# Линтинг
pnpm run lint

# Форматирование
pnpm run format

# Проверка типов
pnpm run type-check

# Тесты
pnpm run test
```

### 5.3 Сделайте commit

```bash
# Добавьте измененные файлы
git add .

# Сделайте commit с описательным сообщением
git commit -m "feat: add new avatar filter for sepia effect

- Add sepia filter to GeneratorService
- Update API endpoint to support filter parameter
- Add tests for sepia filter functionality

Fixes #123"
```

### 5.4 Соглашения по commit сообщениям

Мы используем [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Типы:**

- `feat`: новая функциональность
- `fix`: исправление бага
- `docs`: изменения в документации
- `style`: форматирование, отсутствующие точки с запятой и т.д.
- `refactor`: рефакторинг кода
- `test`: добавление тестов
- `chore`: обновление задач сборки, конфигурации менеджера пакетов и т.д.

**Примеры:**

```bash
feat(avatar): add sepia filter support
fix(api): resolve memory leak in avatar generation
docs(readme): update installation instructions
test(avatar): add unit tests for filter service
```

## 📤 Шаг 6: Отправка изменений

### 6.1 Отправьте ветку

```bash
# Отправьте вашу ветку в ваш Fork
git push origin feature/issue-123-fix-avatar-generation
```

### 6.2 Создайте Pull Request

1. Перейдите на GitHub страницу вашего Fork
2. Нажмите **"Compare & pull request"**
3. Заполните описание PR (см. [Pull Requests](04-pull-requests.md))
4. Нажмите **"Create pull request"**

## 🔄 Шаг 7: Обновление ветки

Если мейнтейнеры попросят внести изменения:

```bash
# Переключитесь на вашу ветку
git checkout feature/issue-123-fix-avatar-generation

# Получите последние изменения из upstream
git fetch upstream

# Обновите main ветку
git checkout main
git merge upstream/main

# Вернитесь к вашей ветке и обновите её
git checkout feature/issue-123-fix-avatar-generation
git merge main

# Внесите необходимые изменения
# ... редактирование файлов ...

# Сделайте новый commit
git add .
git commit -m "fix: address review comments"

# Отправьте изменения
git push origin feature/issue-123-fix-avatar-generation
```

## ✅ Проверка успешной настройки

После выполнения всех шагов вы должны:

- [ ] Иметь Fork репозитория в вашем GitHub аккаунте
- [ ] Локально клонированный репозиторий с настроенными remotes
- [ ] Созданную feature ветку для вашей задачи
- [ ] Работающее окружение разработки
- [ ] Установленные pre-commit hooks
- [ ] Уметь делать commits с правильными сообщениями

## 🐛 Решение проблем

### Проблема: Не могу создать Fork

**Решение:**

- Убедитесь что вы авторизованы на GitHub
- Проверьте что у вас есть права на создание репозиториев
- Попробуйте создать Fork через веб-интерфейс GitHub

### Проблема: Ошибки при установке зависимостей

**Решение:**

```bash
# Очистите кэш
pnpm store prune
# или
npm cache clean --force

# Удалите node_modules и переустановите
rm -rf node_modules
pnpm install
```

### Проблема: Pre-commit hooks не работают

**Решение:**

```bash
# Переустановите husky
pnpm prepare

# Проверьте права на файлы
chmod +x .husky/pre-commit
```

## 🎯 Что дальше?

Теперь когда вы настроили окружение:

- [Стандарты кода](02-code-style.md) - изучите правила написания кода
- [Процесс контрибуции](03-contribution-workflow.md) - углубитесь в процессы
- [Pull Requests](04-pull-requests.md) - научитесь создавать качественные PR

## 🔗 Полезные ссылки

- [GitHub Fork Guide](https://guides.github.com/activities/forking/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)

---

**Предыдущий раздел:** [README](README.md)  
**Следующий раздел:** [Стандарты кода](02-code-style.md)  
**Версия:** 1.0  
**Обновлено:** 2025-01-15
