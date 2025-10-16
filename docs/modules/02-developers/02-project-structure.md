# Структура проекта

## 🎯 Цель

Понять архитектуру и организацию кода в Avatar Generator.

## ⏱️ Время изучения

**20 минут**

## 📋 Предварительные знания

- [Настройка разработки](01-development-setup.md) - окружение должно быть
  настроено
- Базовые знания архитектуры веб-приложений

## 🏗️ Общая архитектура

```
┌─────────────────────────────────────────────────┐
│           Gateway (Nginx SSL/TLS)               │
│           Port: 80 (HTTP), 12745 (HTTPS)        │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────┐│
│  │   Frontend   │  │   Backend    │  │Postgre││
│  │   (React)    │◄─┤   (NestJS)   │◄─┤  SQL  ││
│  │   :8080      │  │    :3000     │  │ :5432 ││
│  └──────────────┘  └──────────────┘  └───────┘│
│         ▲                  ▲              ▲    │
│         │                  │              │    │
│  ┌──────────────┐  ┌──────────────┐  ┌───────┐│
│  │ Static Files │  │   Storage    │  │  Data ││
│  │   (React)    │  │ Local/S3     │  │(Volume││
│  └──────────────┘  └──────────────┘  └───────┘│
└─────────────────────────────────────────────────┘
```

## 📁 Корневая структура

```
avatar-gen/
├── backend/              # NestJS API сервер
├── frontend/             # React приложение
├── gateway/              # Nginx reverse proxy
├── docker/               # Docker конфигурация
├── scripts/              # Скрипты управления
├── docs/                 # Документация
├── LICENSE               # MIT License
├── CHANGELOG.md          # История изменений
├── CONTRIBUTING.md       # Правила контрибуции
└── package.json          # Workspace configuration
```

## 🔧 Backend структура (NestJS)

```
backend/
├── src/
│   ├── main.ts                    # Точка входа
│   ├── config/                    # Конфигурация
│   │   ├── config.module.ts       # Модуль конфигурации
│   │   ├── configuration.ts       # Zod схема валидации
│   │   └── yaml-config.service.ts # YAML конфигурация
│   ├── common/                    # Общие компоненты
│   │   ├── dto/                   # Data Transfer Objects
│   │   ├── enums/                 # Перечисления
│   │   └── interfaces/            # Интерфейсы
│   ├── modules/                   # Модули приложения
│   │   ├── app/                   # Корневой модуль
│   │   ├── avatar/                # Модуль аватаров
│   │   ├── database/              # Модуль БД
│   │   ├── health/                # Health checks
│   │   ├── logger/                # Логирование
│   │   └── initialization/        # Инициализация
│   └── middleware/                # Middleware
├── test/                          # E2E тесты
├── storage/                       # Хранилище данных
│   ├── avatars/                   # Сгенерированные аватары
│   └── database/                  # SQLite база данных
├── logs/                          # Логи приложения
├── settings.yaml                  # Основная конфигурация
└── package.json
```

### Основные модули Backend

#### 🎨 Avatar Module

```typescript
// src/modules/avatar/
├── avatar.controller.ts           # REST endpoints
├── avatar.service.ts              # Бизнес-логика
├── avatar.module.ts               # Модуль
└── modules/
    └── generator/                 # Генератор изображений
        ├── generator.service.ts   # Sharp обработка
        └── filter.service.ts      # Применение фильтров
```

#### 🗄️ Database Module

```typescript
// src/modules/database/
├── database.service.ts            # Абстракция БД
├── database.module.ts             # Модуль
├── modules/                       # Драйверы БД
│   ├── sqlite-driver/             # SQLite драйвер
│   └── postgresql-driver/         # PostgreSQL драйвер
├── interfaces/                    # Интерфейсы
└── utils/                         # Утилиты
```

## 🎨 Frontend структура (React + FSD)

```
frontend/
├── src/
│   ├── app/                       # Инициализация приложения
│   │   ├── index.tsx              # Точка входа
│   │   ├── providers/             # Провайдеры (Query, Redux)
│   │   └── router/                # Роутинг
│   ├── pages/                     # Страницы приложения
│   │   ├── home/                  # Главная страница
│   │   ├── avatar-generator/      # Генератор аватаров
│   │   ├── avatar-viewer/         # Просмотр аватаров
│   │   └── about/                 # О проекте
│   ├── widgets/                   # Сложные UI блоки
│   │   ├── header/                # Шапка сайта
│   │   ├── footer/                # Подвал сайта
│   │   └── avatar-card/           # Карточка аватара
│   ├── features/                  # Функциональные фичи
│   │   ├── avatar-generator/      # Генерация аватаров
│   │   ├── theme-toggle/          # Переключение темы
│   │   └── language-switcher/     # Переключение языка
│   ├── entities/                  # Бизнес-сущности
│   │   ├── user/                  # Пользователь
│   │   └── avatar/                # Аватар
│   └── shared/                    # Переиспользуемый код
│       ├── ui/                    # UI компоненты (shadcn/ui)
│       ├── lib/                   # Утилиты и хелперы
│       ├── api/                   # API клиенты
│       └── config/                # Конфигурация
├── public/                        # Статические файлы
└── package.json
```

### Feature-Sliced Design принципы

#### 📄 Pages (Страницы)

```typescript
// src/pages/avatar-generator/
├── index.ts                       # Экспорт страницы
├── AvatarGeneratorPage.tsx        # Компонент страницы
└── model/                         # Логика страницы
    ├── index.ts                   # Экспорт модели
    └── avatarGeneratorStore.ts    # Store страницы
```

#### 🧩 Widgets (Виджеты)

```typescript
// src/widgets/avatar-card/
├── index.ts                       # Экспорт виджета
├── AvatarCard.tsx                 # Компонент виджета
└── model/                         # Логика виджета
    ├── index.ts                   # Экспорт модели
    └── avatarCardStore.ts         # Store виджета
```

#### ⚡ Features (Фичи)

```typescript
// src/features/avatar-generator/
├── index.ts                       # Экспорт фичи
├── ui/                            # UI компоненты
│   ├── GenerateButton.tsx         # Кнопка генерации
│   └── ColorPicker.tsx            # Выбор цвета
└── model/                         # Логика фичи
    ├── index.ts                   # Экспорт модели
    ├── generateAvatar.ts          # Функция генерации
    └── avatarGeneratorStore.ts    # Store фичи
```

#### 🏗️ Entities (Сущности)

```typescript
// src/entities/avatar/
├── index.ts                       # Экспорт сущности
├── model/                         # Модель данных
│   ├── index.ts                   # Экспорт модели
│   ├── types.ts                   # TypeScript типы
│   └── avatar.ts                  # Модель аватара
└── ui/                            # UI компоненты
    ├── index.ts                   # Экспорт UI
    └── AvatarImage.tsx            # Компонент изображения
```

#### 🔧 Shared (Общие)

```typescript
// src/shared/
├── ui/                            # UI компоненты
│   ├── button/                    # Кнопка
│   ├── input/                     # Поле ввода
│   └── modal/                     # Модальное окно
├── lib/                           # Утилиты
│   ├── utils.ts                   # Общие утилиты
│   └── api.ts                     # API хелперы
└── config/                        # Конфигурация
    ├── index.ts                   # Настройки приложения
    └── env.ts                     # Переменные окружения
```

## 🔄 Data Flow

### Генерация аватара

```
User Action (Frontend)
     ↓
React Component (AvatarGenerator)
     ↓
Redux Action / API Call
     ↓
POST /api/generate
     ↓
AvatarController (Backend)
     ↓
AvatarService
     ↓ ┌──────────────────────┐
     ├→│ GeneratorService     │→ Генерация изображения (Sharp)
     ├→│ StorageService       │→ Сохранение .obj файла
     └→│ DatabaseService      │→ Сохранение metadata
        └──────────────────────┘
     ↓
Response (id, createdAt, version)
     ↓
Frontend UI Update
     ↓
Redirect to Avatar Viewer
```

### Получение аватара

```
User Request (GET /api/:id?filter=grayscale&size=7)
     ↓
AvatarController
     ↓
AvatarService
     ↓ ┌──────────────────────┐
     ├→│ DatabaseService      │→ Получение metadata
     ├→│ StorageService       │→ Загрузка .obj файла
     ├→│ Extract image_7n     │→ Выбор нужного размера
     └→│ GeneratorService     │→ Применение фильтра
        └──────────────────────┘
     ↓
Binary Image Response
     ↓
Browser Display / Download
```

## 🗂️ Конфигурация

### Backend конфигурация

```yaml
# backend/settings.yaml
app:
  storage:
    type: 'local' # или 's3'
    local:
      save_path: './storage/avatars'
    s3:
      endpoint: 'https://your-s3-endpoint.com'
      bucket: 'your-bucket-name'
  server:
    host: '0.0.0.0'
    port: 3000
  database:
    driver: 'sqlite' # или 'postgresql'
    sqlite_params:
      url: 'file:./storage/database/database.sqlite'
    network:
      host: 'postgres'
      port: 5432
      database: 'avatar_gen'
      username: 'postgres'
      password: 'password'
```

### Frontend конфигурация

```typescript
// frontend/src/shared/config/index.ts
export const ENV_CONFIG = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_BASE_URL || '/api',
} as const;

export const APP_CONFIG = {
  name: 'ava-gen Frontend',
  version: '1.0.0',
  theme: {
    primaryColor: '#2563eb',
  },
} as const;
```

## 🐳 Docker структура

```
docker/
├── docker-compose.yml              # Базовая конфигурация
├── docker-compose.sqlite.yml       # SQLite профиль
├── docker-compose.postgresql.yml   # PostgreSQL профиль
└── README.md                       # Документация Docker

backend/docker/
├── Dockerfile                      # Backend образ
└── README.md

frontend/docker/
├── Dockerfile                      # Frontend образ
└── README.md

gateway/
├── Dockerfile                      # Gateway образ
├── configs/nginx.conf              # Nginx конфигурация
└── README.md
```

## 📊 Формат хранения аватаров

Аватары хранятся в виде `.obj` файлов (сериализованные объекты):

```typescript
interface AvatarObject {
  meta_data_name: string; // UUID
  meta_data_created_at: DateTime; // Timestamp
  image_5n: Buffer; // 2^5 = 32px
  image_6n: Buffer; // 2^6 = 64px (default)
  image_7n: Buffer; // 2^7 = 128px
  image_8n: Buffer; // 2^8 = 256px
  image_9n: Buffer; // 2^9 = 512px
}
```

**Расположение:** `backend/storage/avatars/<uuid>.obj`

## 🗄️ База данных

### Схема (TypeORM)

```typescript
@Entity('avatars')
export class Avatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: '0.0.1' })
  version: string;

  @Column({ unique: true })
  filePath: string;

  @Column({ nullable: true })
  primaryColor?: string;

  @Column({ nullable: true })
  foreignColor?: string;

  @Column({ nullable: true })
  colorScheme?: string;

  @Column({ nullable: true })
  seed?: string;
}
```

**SQLite:** `backend/storage/database/database.sqlite`  
**PostgreSQL:** Настраивается в `settings.yaml`

## ✅ Проверка понимания

После изучения структуры вы должны понимать:

- [ ] Общую архитектуру системы
- [ ] Структуру backend (NestJS модули)
- [ ] Структуру frontend (FSD архитектура)
- [ ] Как данные передаются между компонентами
- [ ] Где находятся конфигурационные файлы
- [ ] Как хранятся аватары
- [ ] Схему базы данных

## 🔗 Связанные темы

### Предварительные знания

- [Настройка разработки](01-development-setup.md) - окружение разработки
- [NestJS документация](https://docs.nestjs.com/) - фреймворк backend
- [Feature-Sliced Design](https://feature-sliced.design/) - архитектура frontend

### Следующие шаги

- [Backend разработка](03-backend-development.md) - разработка API
- [Frontend разработка](04-frontend-development.md) - разработка UI
- [Добавление функций](05-adding-features.md) - новые возможности

---

**Предыдущий раздел:** [Настройка разработки](01-development-setup.md)  
**Следующий раздел:** [Backend разработка](03-backend-development.md)  
**Версия:** 1.0  
**Обновлено:** 2025-01-15
