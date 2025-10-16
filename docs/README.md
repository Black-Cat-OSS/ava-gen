# Avatar Generator - Документация

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Build Status](https://github.com/letnull19A/avatar-gen/workflows/CI/badge.svg)](https://github.com/letnull19A/avatar-gen/actions)

> Генератор аватаров в стиле GitHub/GitLab с открытым исходным кодом

## 🚀 Быстрый старт

```bash
# Запуск с Docker
git clone https://github.com/letnull19A/avatar-gen.git
cd avatar-gen
./scripts/start.sh --db sqlite --storage local

# Открыть в браузере
open https://localhost:12745
```

## 📚 Документация по ролям

### 👤 [Пользователи](modules/01-users/)

**Для тех, кто хочет использовать Avatar Generator**

- [Что это такое](modules/01-users/01-what-is-this.md) - обзор проекта
- [Быстрый старт](modules/01-users/02-quick-start.md) - запуск за 5 минут
- [Установка](modules/01-users/03-installation.md) - различные способы установки
- [Основное использование](modules/01-users/04-basic-usage.md) - как
  генерировать аватары
- [Примеры](modules/01-users/05-examples.md) - практические примеры
- [Решение проблем](modules/01-users/06-troubleshooting.md) - частые проблемы
- [FAQ](modules/01-users/07-faq.md) - часто задаваемые вопросы

### 🛠️ [Разработчики](modules/02-developers/)

**Для тех, кто хочет модифицировать и расширять проект**

- [Настройка разработки](modules/02-developers/01-development-setup.md) -
  окружение разработки
- [Структура проекта](modules/02-developers/02-project-structure.md) -
  архитектура кода
- [Backend разработка](modules/02-developers/03-backend-development.md) -
  NestJS, API
- [Frontend разработка](modules/02-developers/04-frontend-development.md) -
  React, UI
- [Добавление функций](modules/02-developers/05-adding-features.md) - новые
  возможности
- [Кастомизация](modules/02-developers/06-customization.md) - настройка под свои
  нужды
- [Тестирование](modules/02-developers/07-testing.md) - тесты и отладка

### 🤝 [Контрибьюторы](modules/03-contributors/)

**Для тех, кто хочет внести вклад в проект**

- [Начало работы](modules/03-contributors/01-getting-started.md) - первые шаги
- [Стандарты кода](modules/03-contributors/02-code-style.md) - правила написания
  кода
- [Процесс контрибуции](modules/03-contributors/03-contribution-workflow.md) -
  как вносить изменения
- [Pull Requests](modules/03-contributors/04-pull-requests.md) - создание PR
- [Сообщения об ошибках](modules/03-contributors/05-issue-reporting.md) - как
  сообщать о багах
- [Документация](modules/03-contributors/06-documentation.md) - улучшение
  документации
- [Правила сообщества](modules/03-contributors/07-community-guidelines.md) -
  кодекс поведения

### 👑 [Мейнтейнеры](modules/04-maintainers/)

**Для тех, кто управляет проектом**

- [Управление проектом](modules/04-maintainers/01-project-governance.md) -
  процессы и решения
- [Релизы](modules/04-maintainers/02-release-process.md) - процесс выпуска
  версий
- [Ревью кода](modules/04-maintainers/03-code-review.md) - стандарты ревью
- [Управление сообществом](modules/04-maintainers/04-community-management.md) -
  работа с сообществом
- [Безопасность](modules/04-maintainers/05-security.md) - политики безопасности
- [Инфраструктура](modules/04-maintainers/06-infrastructure.md) - CI/CD, хостинг
- [Планирование](modules/04-maintainers/07-roadmap.md) - развитие проекта

## 📖 Справочники

### 🌟 [Getting Started](getting-started/)

- [Установка](getting-started/installation.md) - подробная установка
- [Быстрый старт](getting-started/quick-start.md) - 5-минутное руководство
- [Примеры](getting-started/examples.md) - базовые примеры
- [Сообщество](getting-started/community.md) - где получить помощь

### 🤝 [Contributing](contributing/)

- [Руководство контрибьютора](contributing/contributing-guide.md)
- [Кодекс поведения](contributing/code-of-conduct.md)
- [Настройка разработки](contributing/development-setup.md)
- [Шаблоны](contributing/templates/) - PR и issues

### 📡 [API Reference](api/)

- [Обзор API](api/README.md) - введение в API
- [Endpoints](api/endpoints.md) - все доступные endpoints
- [Аутентификация](api/authentication.md) - методы аутентификации
- [Ошибки](api/errors.md) - коды ошибок и их обработка

### 🚀 [Deployment](deployment/)

- [Обзор развертывания](deployment/README.md)
- [Docker](deployment/docker.md) - контейнерное развертывание
- [Облако](deployment/cloud.md) - облачные платформы
- [Production](deployment/production.md) - production настройки

## 🆘 Получение помощи

### 💬 Обсуждения

- [GitHub Discussions](https://github.com/letnull19A/avatar-gen/discussions) -
  общие вопросы
- [Issues](https://github.com/letnull19A/avatar-gen/issues) - баги и предложения

### 🔒 Безопасность

- [Security Issues](mailto:security@avatar-gen.com) - проблемы безопасности

## 🎯 Выбор правильного раздела

<table>
<tr>
<td width="33%">

**Я хочу использовать проект**

→ [Модуль 1: Пользователи](modules/01-users/)

- Установка и настройка
- Базовое использование
- Примеры и рецепты
- Решение проблем

</td>
<td width="33%">

**Я хочу модифицировать проект**

→ [Модуль 2: Разработчики](modules/02-developers/)

- Настройка разработки
- Архитектура проекта
- Backend и Frontend
- Добавление функций

</td>
<td width="33%">

**Я хочу внести вклад**

→ [Модуль 3: Контрибьюторы](modules/03-contributors/)

- Процесс контрибуции
- Стандарты кода
- Pull Requests
- Сообщество

</td>
</tr>
</table>

## 📊 Статус документации

| Модуль           | Статус          | Описание                     |
| ---------------- | --------------- | ---------------------------- |
| 👤 Пользователи  | 🟡 В разработке | Базовая документация готова  |
| 🛠️ Разработчики  | 🟡 В разработке | Объединение backend/frontend |
| 🤝 Контрибьюторы | 🟡 В разработке | Процессы и стандарты         |
| 👑 Мейнтейнеры   | ⏳ Планируется  | Управление проектом          |

**Легенда:** ✅ Готово | 🟡 В разработке | ⏳ Планируется

---

**Версия документации:** 4.0 (OSS структура)  
**Последнее обновление:** 2025-01-15  
**Лицензия:** MIT
