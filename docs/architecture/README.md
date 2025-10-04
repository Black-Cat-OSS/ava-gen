# Архитектура проекта

Обзор архитектуры Avatar Generator.

## 📚 Содержание

- **[Project Overview](./OVERVIEW.md)** ✅  
  Общий обзор архитектуры проекта, структура директорий, data flow

- **[Backend Architecture](../../backend/docs/README.md)** ✅  
  Детальная архитектура backend

- **[Frontend Architecture](../../frontend/docs/README.md)** ✅  
  Детальная архитектура frontend

## 🏗️ Общая архитектура

```
┌─────────────────────────────────────────────────┐
│                 Browser / Client                │
└──────────────────────┬──────────────────────────┘
                       │ HTTP/HTTPS
                       ↓
┌─────────────────────────────────────────────────┐
│         Frontend (React + Nginx)                │
│         Port: 80, 443                           │
└──────────────────────┬──────────────────────────┘
                       │ REST API
                       ↓
┌─────────────────────────────────────────────────┐
│         Backend (NestJS)                        │
│         Port: 3000                              │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌────────────┐  ┌─────────┐ │
│  │   Avatar    │  │  Storage   │  │ Logger  │ │
│  │   Module    │  │  Module    │  │ Module  │ │
│  └──────┬──────┘  └─────┬──────┘  └─────────┘ │
│         │                │                      │
│         ↓                ↓                      │
│  ┌─────────────┐  ┌────────────┐              │
│  │  Database   │  │    File    │              │
│  │   Module    │  │   System   │              │
│  └──────┬──────┘  └────────────┘              │
│         │                                       │
│         ↓                                       │
│  ┌─────────────────────────┐                   │
│  │  SQLite / PostgreSQL    │                   │
│  └─────────────────────────┘                   │
└─────────────────────────────────────────────────┘
```

## 💻 Технологический стек

### Backend

- **Framework:** NestJS 11
- **Language:** TypeScript 5.9
- **Database ORM:** Prisma 6.16
- **Image Processing:** Sharp 0.34
- **Logging:** Pino
- **Validation:** class-validator + Zod
- **API Docs:** Swagger/OpenAPI

### Frontend

- **Framework:** React 18
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS + SCSS
- **State Management:** Redux Toolkit
- **Routing:** React Router 7
- **i18n:** react-i18next
- **UI Components:** shadcn/ui

### Infrastructure

- **Containerization:** Docker + Docker Compose
- **Web Server:** Nginx (Alpine)
- **Package Manager:** pnpm
- **Code Quality:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **Commits:** Commitlint

## 📦 Модули Backend

### Core модули

- **Avatar Module** - Генерация и управление аватарами
- **Database Module** - Абстракция работы с БД (SQLite/PostgreSQL)
- **Storage Module** - Управление файловым хранилищем
- **Health Module** - Проверка здоровья приложения
- **Logger Module** - Централизованное логирование
- **Initialization Module** - Инициализация приложения

### Вспомогательные

- **Config Module** - Управление конфигурацией (YAML)
- **Generator Service** - Генерация изображений
- **Filter Service** - Применение фильтров

## 🎨 Структура Frontend

### Feature-Sliced Design

```
frontend/src/
├── app/                # Инициализация приложения
├── pages/              # Страницы
├── widgets/            # Сложные UI блоки
├── features/           # Функциональные фичи
├── entities/           # Бизнес-сущности
└── shared/             # Переиспользуемый код
```

## 📊 Data Flow

```
User Action (Frontend)
     ↓
React Component
     ↓
Redux Action / React Query
     ↓
API Call (fetch)
     ↓
Backend Controller (NestJS)
     ↓
Service Layer
     ↓
Database / Storage
     ↓
Response
     ↓
Frontend UI Update
```

## 🔐 Security

- CORS настроен для безопасного взаимодействия
- Validation на уровне DTO
- HTTP-only для безопасных запросов
- Sanitization входных данных
- Rate limiting (в планах)

## 🔗 Детальная документация

### Backend

- [Backend Architecture](../../backend/docs/README.md)
- [Database Module](../../backend/docs/modules/database/README.md)
- [Initialization Module](../../backend/src/modules/initialization/README.md)

### Frontend

- [Frontend Docs](../../frontend/docs/README.md)
- [Components](../../frontend/README.md#компоненты)

## 🔗 Связанные разделы

- [Development Guide](../development/README.md)
- [API Documentation](../api/README.md)
- [Deployment](../deployment/README.md)

---

**Обновлено:** 2025-10-03
