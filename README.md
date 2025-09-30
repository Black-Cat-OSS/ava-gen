# 🎨 Avatar Generator API

Современный REST API для генерации уникальных аватаров с использованием геометрических паттернов и цветовых схем.

## ✨ Основные возможности

- **🎯 Генерация аватаров** - создание уникальных изображений на основе параметров
- **🎨 Цветовые схемы** - 5 предустановленных цветовых палитр
- **📏 Множественные размеры** - поддержка размеров от 16x16 до 512x512 пикселей
- **🔍 Фильтры изображений** - градация серого, сепия, негатив
- **📄 Пагинация** - эффективная работа с большими списками
- **💾 Персистентность** - сохранение в SQLite базе данных
- **🐳 Docker** - полная контейнеризация приложения
- **📚 Swagger** - интерактивная API документация

## 🚀 Быстрый старт

### Запуск с Docker (рекомендуется)

```bash
# Клонирование репозитория
git clone <repository-url>
cd avatar-gen

# Запуск приложения
docker-compose up -d

# Проверка статуса
curl http://localhost:3000/api/health
```

### Локальная разработка

```bash
# Автоматическая настройка среды разработки
./scripts/setup-dev.sh

# Или ручная установка:
npm install
cd backend && npm install && cd ..
npm run prepare  # Инициализация Husky
```

### Настройка Git hooks

Проект использует Husky и commitlint для обеспечения качества кода:

```bash
# Проверка сообщений коммитов
npm run commitlint

# Интерактивные коммиты (рекомендуется)
npm run commit
```

**Формат сообщений коммитов** (Conventional Commits):

```
<type>[optional scope]: <description>

feat(backend): add new avatar generation endpoint
fix(frontend): resolve image loading issue
docs: update API documentation
```

## 📖 API Endpoints

### Основные операции

| Метод    | Endpoint             | Описание                 |
| -------- | -------------------- | ------------------------ |
| `POST`   | `/api/generate`      | Создать новый аватар     |
| `GET`    | `/api/list`          | Получить список аватаров |
| `GET`    | `/api/{id}`          | Получить аватар по ID    |
| `DELETE` | `/api/{id}`          | Удалить аватар           |
| `GET`    | `/api/color-schemes` | Получить цветовые схемы  |
| `GET`    | `/api/health`        | Проверка состояния       |

### Примеры использования

#### Создание аватара

```bash
curl -X POST "http://localhost:3000/api/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "primaryColor": "blue",
    "foreignColor": "lightblue",
    "colorScheme": "blue",
    "seed": "unique-seed-123"
  }'
```

#### Получение списка с пагинацией

```bash
# Первые 10 аватаров
curl "http://localhost:3000/api/list"

# 5 аватаров начиная с 10-го
curl "http://localhost:3000/api/list?pick=5&offset=10"
```

#### Получение аватара с фильтром

```bash
# Обычный аватар
curl "http://localhost:3000/api/{id}" --output avatar.png

# С фильтром сепия
curl "http://localhost:3000/api/{id}?filter=sepia" --output avatar_sepia.png

# Размер 256x256
curl "http://localhost:3000/api/{id}?size=8" --output avatar_256.png
```

## 🎨 Цветовые схемы

| Название | Основной цвет | Дополнительный цвет |
| -------- | ------------- | ------------------- |
| `green`  | Зеленый       | Светло-зеленый      |
| `blue`   | Синий         | Голубой             |
| `red`    | Красный       | Розовый             |
| `purple` | Фиолетовый    | Лиловый             |
| `orange` | Оранжевый     | Желтый              |

## 🔧 Технические детали

### Технологический стек

- **Backend**: NestJS + TypeScript
- **База данных**: SQLite + Prisma ORM
- **Обработка изображений**: Sharp
- **Валидация**: Class-validator
- **Документация**: Swagger/OpenAPI
- **Контейнеризация**: Docker + Docker Compose

### Архитектура

```
backend/
├── src/
│   ├── modules/
│   │   ├── avatar/          # Логика генерации аватаров
│   │   ├── database/        # Работа с БД
│   │   └── logger/          # Логирование
│   ├── common/
│   │   ├── dto/            # DTO для валидации
│   │   ├── enums/          # Перечисления
│   │   └── interfaces/     # Интерфейсы
│   └── config/             # Конфигурация
├── prisma/                 # Схема БД и миграции
└── storage/               # Файловое хранилище
```

### Принцип работы

1. **Генерация паттерна** - создается детерминированный геометрический паттерн на основе seed
2. **Применение цветов** - паттерн раскрашивается согласно цветовой схеме
3. **Масштабирование** - генерируются изображения всех необходимых размеров
4. **Сохранение** - аватар сохраняется в файловой системе и БД
5. **Обработка запросов** - по запросу применяются фильтры и возвращается нужный размер

## 📊 Размеры изображений

| Параметр | Размер  | Описание               |
| -------- | ------- | ---------------------- |
| `size=5` | 32x32   | Маленький              |
| `size=6` | 64x64   | Средний (по умолчанию) |
| `size=7` | 128x128 | Большой                |
| `size=8` | 256x256 | Очень большой          |
| `size=9` | 512x512 | Максимальный           |

## 🔍 Фильтры

- **`grayscale`** - оттенки серого
- **`sepia`** - сепия эффект
- **`negative`** - негатив

## 📚 Документация API

После запуска приложения Swagger документация доступна по адресу:

```
http://localhost:3000/swagger
```

## 🐳 Docker

### Сборка образа

```bash
docker-compose build
```

### Запуск в фоне

```bash
docker-compose up -d
```

### Просмотр логов

```bash
docker-compose logs -f avatar-backend
```

### Остановка

```bash
docker-compose down
```

## 🛠️ Разработка

### Первоначальная настройка

```bash
# Автоматическая настройка
./scripts/setup-dev.sh

# Или вручную:
npm install
cd backend && npm install && cd ..
npm run prepare
```

### Рабочий процесс

#### 1. Создание ветки

```bash
git checkout -b feature/AVATAR-123-new-feature
```

#### 2. Разработка

```bash
npm run dev  # Запуск в режиме разработки
```

#### 3. Коммит изменений

```bash
# Интерактивный коммит (рекомендуется)
npm run commit

# Или обычный коммит
git commit -m "feat(backend): add new avatar endpoint"
```

#### 4. Проверка качества кода

```bash
npm run lint    # Проверка и исправление
npm run test    # Запуск тестов
```

### Доступные команды

#### Корневые команды

- `npm run build` - сборка всех проектов
- `npm run dev` - запуск в режиме разработки
- `npm run lint` - линтинг всех проектов
- `npm run test` - тестирование всех проектов
- `npm run commit` - интерактивные коммиты

#### Backend команды

```bash
cd backend
npm run start:dev    # Запуск в режиме разработки
npm run build        # Сборка проекта
npm run lint         # Линтинг кода
npm run test         # Запуск тестов
npm run prisma:generate  # Генерация Prisma клиента
npm run prisma:migrate   # Запуск миграций
```

### Git Hooks

Проект использует Husky для автоматической проверки:

- **pre-commit**: линтинг и форматирование кода
- **commit-msg**: проверка формата сообщений коммитов
- **prepare-commit-msg**: автоматическое добавление номера задачи
- **post-commit**: проверка необходимости обновления CHANGELOG

## 📝 Переменные окружения

Создайте файл `.env` в папке `backend/`:

```env
DATABASE_URL="file:./prisma/storage/database.sqlite"
CONFIG_PATH="./settings.yaml"
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для подробностей.

## 🆘 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте [Issues](../../issues) на GitHub
2. Создайте новый Issue с подробным описанием проблемы
3. Убедитесь, что приложены логи и шаги для воспроизведения

---

**Создано с ❤️ для генерации уникальных аватаров**
