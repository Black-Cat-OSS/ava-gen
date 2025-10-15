# Миграция структуры Docker

**Дата:** 2025-10-02  
**Версия:** 2.0

## 📋 Что было изменено

### Реорганизация структуры

**Было:**

```
avatar-gen/
├── docker-compose.yml              # В корне
├── docker-compose.sqlite.yml       # В корне
├── docker-compose.postgresql.yml   # В корне
├── backend/docker/
│   ├── Dockerfile                  # Остается здесь
│   └── README.md                   # Остается здесь
└── frontend/docker/
    └── Dockerfile                  # Остается здесь
```

**Стало:**

```
avatar-gen/
├── docker/                         # Новая директория
│   ├── docker-compose.yml          # ← Перенесены сюда
│   ├── docker-compose.sqlite.yml   # ← Перенесены сюда
│   ├── docker-compose.postgresql.yml # ← Перенесены сюда
│   └── README.md
├── backend/docker/
│   ├── Dockerfile                  # ✓ Остался на месте
│   └── README.md                   # ✓ Остался на месте
└── frontend/docker/
    └── Dockerfile                  # ✓ Остался на месте
```

## ✅ Выполненные изменения

### 1. Создана директория `docker/` для compose файлов

- ✅ `docker/` - создана директория для docker-compose файлов
- ✅ `docker/README.md` - документация по структуре

### 2. Перемещены ТОЛЬКО Docker Compose файлы

- ✅ `docker-compose.yml` → `docker/docker-compose.yml`
- ✅ `docker-compose.sqlite.yml` → `docker/docker-compose.sqlite.yml`
- ✅ `docker-compose.postgresql.yml` → `docker/docker-compose.postgresql.yml`

### 3. Dockerfile ОСТАЛИСЬ на своих местах

- ✅ `backend/docker/Dockerfile` - НЕ перемещен
- ✅ `backend/docker/README.md` - НЕ перемещен
- ✅ `frontend/docker/Dockerfile` - НЕ перемещен

### 4. Обновлены пути в Docker Compose файлах

Пути обновлены относительно директории `docker/`:

- `context: ./backend` → `context: ../backend`
- `context: ./frontend` → `context: ../frontend`
- `dockerfile: docker/Dockerfile` - ОСТАЛСЯ без изменений (относительно context)

### 5. Обновлены скрипты

Все скрипты в `scripts/` обновлены для использования новых путей:

- ✅ `scripts/build.sh` - использует `docker/docker-compose.yml`
- ✅ `scripts/build-fast.sh` - использует `docker/docker-compose.yml`
- ✅ `scripts/start.sh` - использует `docker/docker-compose.yml`
- ✅ `scripts/dev.sh` - использует `docker/docker-compose.yml`
- ✅ `scripts/stop.sh` - использует `docker/docker-compose.yml`

### 6. Создана документация

- ✅ `docker/README.md` - полная документация по Docker структуре
- ✅ `docker/DOCKER_BUILD_FIXES.md` - документация по исправлениям сборки
- ✅ `scripts/README.md` - обновлена документация скриптов
- ✅ Этот файл миграции

## 🧹 Что было удалено

Старые docker-compose файлы из корня проекта:

```bash
✓ docker-compose.yml - удален
✓ docker-compose.sqlite.yml - удален
✓ docker-compose.postgresql.yml - удален
```

**Dockerfile НЕ удалялись** - они остались на своих местах:

- ✓ `backend/docker/Dockerfile` - на месте
- ✓ `frontend/docker/Dockerfile` - на месте

## 🗑️ Очистка (опционально)

```bash
# Удалить этот файл миграции после прочтения
rm MIGRATION_DOCKER_STRUCTURE.md
```

## 🧪 Проверка работоспособности

### Шаг 1: Проверка валидности конфигурации

```bash
# SQLite
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.sqlite.yml config --services

# PostgreSQL
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.postgresql.yml config --services
```

Ожидаемый вывод:

```
avatar-backend
avatar-frontend
```

### Шаг 2: Сборка образов

```bash
# Используйте обновленные скрипты
./scripts/build.sh sqlite
```

Или:

```bash
# Напрямую
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.sqlite.yml build
```

### Шаг 3: Запуск сервисов

```bash
# Используйте скрипты
./scripts/start.sh sqlite

# Или напрямую
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.sqlite.yml up
```

### Шаг 4: Проверка работы

Откройте в браузере:

- Frontend: http://localhost
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/swagger
- Health check: http://localhost:3000/api/health

## 📊 Преимущества новой структуры

1. **Централизация compose файлов** - все docker-compose файлы в одном месте
2. **Чистота корня проекта** - меньше файлов в корне (3 файла → 0)
3. **Логичная организация** - compose файлы в `docker/`, Dockerfile в модулях
4. **Лучшая навигация** - проще найти compose файлы
5. **Сохранение модульности** - Dockerfile остаются рядом с кодом модулей

## 🔄 Обратная совместимость

### Старые команды

Если вы использовали старые команды напрямую:

```bash
# Старое
docker-compose up

# Новое
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.sqlite.yml up
```

### Скрипты

Все скрипты обновлены автоматически. Использование остается прежним:

```bash
./scripts/start.sh
./scripts/build.sh
./scripts/dev.sh
```

## 📝 Обновление документации

Обновлены файлы:

- ✅ `docker/README.md` - новый файл с полной документацией
- ✅ `scripts/README.md` - обновлены все примеры команд
- ✅ `docker/backend/README.md` - перемещен из `backend/docker/README.md`

Требуют обновления (если упоминают docker-compose):

- [ ] `README.md` (корень проекта)
- [ ] `docs/DOCKER_COMPOSE_README.md`
- [ ] Другие файлы документации

## 🐛 Troubleshooting

### Ошибка: "Cannot find docker-compose.yml"

**Причина:** Команда запущена с неправильным путем

**Решение:** Используйте полный путь к compose файлам или скрипты:

```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.sqlite.yml up
```

### Ошибка: "context path does not exist"

**Причина:** Неправильные относительные пути в docker-compose.yml

**Решение:** Убедитесь что используете обновленные файлы из `docker/`

### Старые контейнеры продолжают работать

**Решение:** Остановите старые контейнеры:

```bash
docker-compose -f docker-compose.yml down  # старый путь
docker-compose -f docker/docker-compose.yml down  # новый путь
```

## ✨ Рекомендации

1. **Протестируйте** новую структуру перед удалением старых файлов
2. **Сделайте коммит** после проверки работоспособности
3. **Обновите CI/CD** если используете (пути к compose файлам)
4. **Обновите документацию** в вашем проекте
5. **Уведомите команду** о новой структуре

## 📞 Помощь

Если возникли проблемы:

1. Проверьте пути в docker-compose файлах
2. Убедитесь что используете обновленные скрипты
3. Проверьте что Docker работает: `docker info`
4. Посмотрите логи: `docker-compose -f docker/docker-compose.yml logs`

---

**Статус миграции:** ✅ Завершена  
**Тестирование:** ⏳ Требуется проверка  
**Удаление старых файлов:** ⏳ Ожидает подтверждения
