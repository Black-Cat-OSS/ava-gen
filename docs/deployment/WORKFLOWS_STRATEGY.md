# CI/CD Workflows Strategy

**Дата:** 2025-10-05  
**Версия:** 3.0 (после оптимизации Issue #17)

## 🎯 Обзор стратегии

Проект использует **2 основных workflow** для покрытия всех сценариев разработки
и деплоя:

1. **CI (Develop)** - быстрые тесты для feature/fix веток
2. **Production Deploy Pipeline** - полное тестирование и деплой для main

## 📊 Схема работы workflows

```
feature/fix branch
      │
      ├─ PR → develop
      │    └─ CI (Develop) ✓
      │       ├─ Lint (backend + frontend)
      │       ├─ Test Backend (SQLite only: 2 комбинации)
      │       ├─ Build Frontend
      │       └─ Docker Build Test
      │
      ├─ Merge → develop
      │    └─ (Нет автоматических тестов)
      │
develop branch
      │
      ├─ PR → main
      │    └─ Production Deploy Pipeline ✓
      │       ├─ Test Backend (FULL: 4 комбинации)
      │       ├─ Build Frontend
      │       ├─ Docker Images Build
      │       ├─ Integration Tests
      │       └─ Deploy: SKIP (только на PR)
      │
      ├─ Merge → main
      │    └─ Production Deploy Pipeline ✓✓
      │       ├─ Test Backend (FULL: 4 комбинации)
      │       ├─ Build Frontend
      │       ├─ Docker Images Build
      │       ├─ Integration Tests
      │       └─ Deploy: RUN (автоматический деплой)
      │
main branch
      │
      └─ Production Server 🚀
```

## 🔄 Сценарии использования

### 1. Разработка feature/fix → develop

**Workflow:** `CI (Develop)`

**Триггер:**

```yaml
on:
  pull_request:
    branches: [develop]
```

**Что происходит:**

- ✅ Линтинг backend + frontend
- ✅ Быстрые тесты (SQLite + Local, SQLite + S3)
- ✅ Сборка frontend
- ✅ Проверка сборки Docker образов

**Время выполнения:** ~5-7 минут

**Цель:** Быстрая проверка кода перед мерджем в develop

---

### 2. Подготовка релиза: develop → main (PR)

**Workflow:** `Production Deploy Pipeline`

**Триггер:**

```yaml
on:
  pull_request:
    branches: [main]
```

**Что происходит:**

- ✅ Полные тесты (SQLite + PostgreSQL) × (Local + S3) = 4 комбинации
- ✅ Сборка frontend с artifacts
- ✅ Сборка всех Docker образов
- ✅ Интеграционные тесты (Docker Compose)
- ❌ **БЕЗ деплоя** (только проверка готовности)

**Время выполнения:** ~10-15 минут

**Цель:** Убедиться что код готов к продакшену перед мерджем

---

### 3. Деплой в продакшен: main (после мерджа)

**Workflow:** `Production Deploy Pipeline`

**Триггер:**

```yaml
on:
  push:
    branches: [main]
```

**Что происходит:**

- ✅ Полные тесты (4 комбинации)
- ✅ Сборка frontend
- ✅ Сборка Docker образов
- ✅ Интеграционные тесты
- ✅ **АВТОМАТИЧЕСКИЙ ДЕПЛОЙ** на production сервер

**Время выполнения:** ~15-20 минут

**Цель:** Финальная проверка + автоматический деплой

---

## 📋 Детали workflows

### CI (Develop) - `.github/workflows/ci.yml`

**Jobs:**

| Job                 | Описание                      | Время    |
| ------------------- | ----------------------------- | -------- |
| `lint-backend`      | ESLint проверка backend кода  | ~1 мин   |
| `lint-frontend`     | ESLint проверка frontend кода | ~1 мин   |
| `test-backend`      | Unit + E2E тесты (SQLite × 2) | ~3-4 мин |
| `build-frontend`    | Vite сборка React приложения  | ~1-2 мин |
| `docker-build-test` | Проверка сборки образов       | ~2-3 мин |

**Матрица тестов:**

- SQLite + Local Storage
- SQLite + S3 Storage

**Почему только SQLite:**

- Быстрая обратная связь для разработчиков
- PostgreSQL тесты в PR в main (перед продакшеном)
- Большинство багов ловятся на SQLite

---

### Production Deploy Pipeline - `.github/workflows/deploy-prod.yml`

**5 Stages:**

#### Stage 1: Unit & E2E Tests

**Матрица (4 комбинации):**

- SQLite + Local Storage
- SQLite + S3 Storage
- PostgreSQL + Local Storage _(контейнер для тестов)_
- PostgreSQL + S3 Storage _(контейнер для тестов)_

**Примечание:** PostgreSQL запускается в контейнере для тестирования

#### Stage 2: Build Frontend

- Vite сборка
- Upload artifacts

#### Stage 3: Docker Images Build

- Backend image
- Frontend image
- Gateway image
- GitHub Actions cache

#### Stage 4: Integration Tests

- Docker Compose запуск
- Health checks (backend, frontend, gateway)
- Проверка работы всех сервисов вместе

#### Stage 5: Production Deployment

- **Условие:** Только при `push` в main
- SSH подключение к серверу
- Git pull
- Docker build (без профиля - использует внешнюю PostgreSQL)
- Docker up
- Health checks

---

## 🚫 Что НЕ запускается

### При PR в develop:

- ❌ PostgreSQL тесты (только SQLite)
- ❌ Полная матрица
- ❌ Интеграционные тесты

### При push в develop:

- ❌ Вообще ничего не запускается (код уже проверен в PR)

### При PR в main:

- ❌ Деплой (только тестирование)

## ⚡ Оптимизации

### Убрано дублирование:

**До (проблемы):**

```
PR в develop:
  ├─ ci.yml (тесты)
  └─ test-matrix-full.yml (тесты) ← ДУБЛИКАТ

Push в develop:
  └─ ci.yml (тесты) ← ДУБЛИКАТ (уже были в PR)

PR в main:
  ├─ ci.yml (тесты)
  └─ test-matrix-full.yml (тесты) ← ДУБЛИКАТ

Push в main:
  ├─ ci.yml (тесты) ← ДУБЛИКАТ
  └─ deploy-prod.yml (тесты + деплой)
```

**После (оптимизировано):**

```
PR в develop:
  └─ ci.yml (быстрые тесты SQLite)

Push в develop:
  └─ (ничего - код уже проверен)

PR в main:
  └─ deploy-prod.yml (полные тесты БЕЗ деплоя)

Push в main:
  └─ deploy-prod.yml (полные тесты + ДЕПЛОЙ)
```

### Экономия времени:

| Сценарий       | До                   | После                | Экономия    |
| -------------- | -------------------- | -------------------- | ----------- |
| PR в develop   | ~15 мин (2 workflow) | ~7 мин (1 workflow)  | **-8 мин**  |
| Push в develop | ~7 мин               | 0 мин                | **-7 мин**  |
| PR в main      | ~20 мин (3 workflow) | ~15 мин (1 workflow) | **-5 мин**  |
| Push в main    | ~30 мин (2 workflow) | ~20 мин (1 workflow) | **-10 мин** |

**Итого:** Экономия ~30 минут CI/CD времени на каждый релиз!

## 🔧 Ручное управление

### Пропустить тесты (hotfix):

```bash
# GitHub UI → Actions → Production Deploy Pipeline → Run workflow
# ✓ skip_tests: true
```

### Пропустить интеграцию:

```bash
# GitHub UI → Actions → Production Deploy Pipeline → Run workflow
# ✓ skip_integration: true
```

### Принудительный деплой (на PR):

```bash
# GitHub UI → Actions → Production Deploy Pipeline → Run workflow
# ✓ force_deploy: true
```

## 📝 Примечания

1. **Линтинг** запускается только в CI (Develop)
2. **Быстрые тесты** (SQLite) для PR в develop
3. **Полные тесты** (SQLite + PostgreSQL) для PR/Push в main
4. **Интеграционные тесты** перед каждым деплоем
5. **PostgreSQL контейнер** только для тестирования
6. **PostgreSQL внешняя** используется в продакшене

## 🎯 Best Practices

✅ **DO:**

- Создавать feature ветки от develop
- Делать PR в develop для быстрой проверки
- Мерджить develop → main через PR
- Дождаться успешного деплоя перед новыми изменениями

❌ **DON'T:**

- Пушить напрямую в develop (обходит проверки)
- Пушить напрямую в main (защищена)
- Пропускать тесты без веской причины
- Делать force deploy без необходимости

---

**Последнее обновление:** 2025-10-05  
**Issue:** [#17 - Docker Compose профили](https://github.com/Black-Cat-OSS/avatar-gen/issues/17)
