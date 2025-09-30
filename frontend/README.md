# Web2Bizz React SDK

Современная библиотека компонентов и инструментов для быстрой разработки веб-приложений на React. Построена с использованием архитектуры Feature-Sliced Design (FSD), React 19, TypeScript и Tailwind CSS.

## 🎯 Назначение React SDK

<div align="center">
  <img src="public/dev-stack/React.svg" alt="React SDK" width="80" height="80" />
  <h3>Библиотека компонентов для быстрой разработки</h3>
</div>

React SDK предназначен для:

- **Быстрого прототипирования** веб-приложений с готовыми компонентами
- **Стандартизации UI/UX** в рамках экосистемы Web2Bizz
- **Ускорения разработки** благодаря переиспользуемым компонентам и утилитам
- **Обеспечения консистентности** дизайна и архитектуры проектов
- **Документирования компонентов** через Storybook для команды разработчиков
- **Создания адаптивных интерфейсов** с поддержкой темной/светлой темы

## ✨ Преимущества использования SDK

<div align="center">
  <img src="public/dev-stack/Vite.js.svg" alt="SDK Benefits" width="60" height="60" />
  <h3>Почему выбирают наш SDK?</h3>
</div>

### Для разработчиков

- **Готовые компоненты** - не нужно писать с нуля
- **Типизация** - полная поддержка TypeScript
- **Консистентность** - единый стиль во всех проектах
- **Документация** - подробные примеры в Storybook
- **Тестирование** - компоненты уже протестированы

### Для дизайнеров

- **Дизайн-система** - готовые паттерны и компоненты
- **Темы** - легкое переключение между светлой/темной темой
- **Адаптивность** - компоненты работают на всех устройствах
- **Кастомизация** - легко настраиваемые стили

### Для бизнеса

- **Скорость разработки** - быстрый старт новых проектов
- **Качество** - проверенные решения и архитектура
- **Масштабируемость** - легко добавлять новые функции
- **Поддержка** - централизованное обновление компонентов

## 🏗️ Архитектура проекта

Проект построен на методологии **Feature-Sliced Design (FSD)** для создания масштабируемой и поддерживаемой архитектуры фронтенда:

<div align="center">
  <img src="public/dev-stack/React.svg" alt="FSD Architecture" width="40" height="40" />
  <strong>Feature-Sliced Design</strong>
</div>

```
src/
├── app/           # Слой приложения - провайдеры, роутинг, глобальная конфигурация
├── pages/         # Слой страниц - компоненты маршрутов
├── widgets/       # Слой виджетов - составные UI блоки
├── features/      # Слой фич - бизнес-функциональность
├── entities/      # Слой сущностей - доменные модели и бизнес-логика
└── shared/        # Общий слой - переиспользуемые компоненты, утилиты, API
```

### Схема зависимостей FSD

```
┌─────────┐
│   App   │ ← Точка входа приложения
└────┬────┘
     │
┌────▼────┐
│  Pages  │ ← Страницы и маршруты
└────┬────┘
     │
┌────▼────┐
│ Widgets │ ← Составные UI блоки
└────┬────┘
     │
┌────▼────┐
│ Features│ ← Бизнес-функциональность
└────┬────┘
     │
┌────▼────┐
│Entities │ ← Доменные модели
└────┬────┘
     │
┌────▼────┐
│ Shared  │ ← Переиспользуемые ресурсы
└─────────┘
```

### Зависимости между слоями

- **App** → Pages, Widgets, Features, Entities, Shared
- **Pages** → Widgets, Features, Entities, Shared
- **Widgets** → Features, Entities, Shared
- **Features** → Entities, Shared
- **Entities** → Shared
- **Shared** → (без зависимостей)

### Ключевые принципы архитектуры

- **Изоляция слоев** - каждый слой имеет четко определенные границы
- **Единонаправленные зависимости** - зависимости идут только сверху вниз
- **Переиспользование** - общие компоненты выносятся в shared слой
- **Модульность** - каждая фича/сущность изолирована и независима

## 🚀 Features

- ✅ **Feature-Sliced Design** architecture
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling [[memory:8770879]]
- ✅ **Blue theme** as primary color [[memory:8765679]]
- ✅ **Minimalistic design** with grid layouts [[memory:8770881]]
- ✅ **Form validation** with custom validators
- ✅ **Responsive design**
- ✅ **Dark/Light theme** support

## 🛠️ Технологический стек

### Основные технологии

<div align="center">
  <img src="public/dev-stack/React.svg" alt="React" width="60" height="60" />
  <img src="public/dev-stack/TypeScript.svg" alt="TypeScript" width="60" height="60" />
  <img src="public/dev-stack/Vite.js.svg" alt="Vite" width="60" height="60" />
  <img src="public/dev-stack/Tailwind CSS.svg" alt="Tailwind CSS" width="60" height="60" />
</div>

- **React 19** - Последняя версия React с concurrent features
- **TypeScript** - Типизированный JavaScript для безопасности кода
- **Vite** - Быстрый инструмент сборки и dev-сервер
- **Tailwind CSS** - Utility-first CSS фреймворк
- **Class Variance Authority** - Управление вариантами компонентов

### Инструменты разработки

<div align="center">
  <img src="public/dev-stack/ESLint.svg" alt="ESLint" width="50" height="50" />
  <img src="public/dev-stack/Storybook.svg" alt="Storybook" width="50" height="50" />
  <img src="public/dev-stack/Jest.svg" alt="Jest" width="50" height="50" />
  <img src="public/dev-stack/Sass.svg" alt="Sass" width="50" height="50" />
  <img src="public/dev-stack/GitHub.svg" alt="GitHub" width="50" height="50" />
</div>

- **ESLint** - Линтер для JavaScript/TypeScript
- **Storybook** - Документация и разработка компонентов
- **Jest** - Фреймворк для тестирования
- **pnpm** - Быстрый менеджер пакетов
- **PostCSS** - Обработка CSS
- **SCSS** - Препроцессор CSS для модульных стилей

### Поддерживаемые браузеры

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📁 Структура проекта

<div align="center">
  <img src="public/dev-stack/TypeScript.svg" alt="Project Structure" width="40" height="40" />
  <strong>Организация кода по слоям FSD</strong>
</div>

### App Layer (`src/app/`)

- `providers/` - Глобальные провайдеры (тема, контексты)
- `router/` - Конфигурация маршрутизации приложения

### Pages Layer (`src/pages/`)

- `home/` - Главная страница
- `about/` - Страница "О нас"
- `login/` - Страница авторизации
- `dev-stack/` - Страница технологического стека
- `test-input/` - Тестовая страница для компонентов ввода

### Widgets Layer (`src/widgets/`)

- `header/` - Шапка приложения с навигацией
  - `Default/` - Стандартный вариант шапки
  - `Minimalism/` - Минималистичный вариант
  - `Search/` - Шапка с поиском
- `footer/` - Подвал приложения
- `mobile-menu/` - Мобильное меню

### Features Layer (`src/features/`)

- `counter-increment/` - Функциональность счетчика
- `LanguageButton/` - Кнопка переключения языка
- `LanguageSwitcher/` - Переключатель языков
- `LoginForm/` - Форма авторизации
- `ThemeToggle/` - Переключатель темы

### Entities Layer (`src/entities/`)

- `user/` - Доменная модель пользователя
- `counter/` - Доменная модель счетчика

### Shared Layer (`src/shared/`)

- `ui/components/` - Переиспользуемые UI компоненты
  - `Button/` - Кнопка с вариантами стилей
  - `InputField/` - Поле ввода с валидацией
  - `Callout/` - Компонент для уведомлений
  - `BurgerIcon/` - Иконка гамбургер-меню
  - `FlagIcon/` - Иконки флагов стран
  - `LanguagePopup/` - Попап выбора языка
  - `NavigationLink/` - Ссылка навигации
  - `OverlayBlur/` - Размытый оверлей
- `ui/layouts/` - Макеты страниц
  - `Default/` - Стандартный макет
  - `Center/` - Центрированный макет
  - `Wide/` - Широкий макет
- `lib/` - Утилиты, валидация, хуки
- `api/` - Конфигурация и клиент API
- `config/` - Конфигурация приложения
- `locales/` - Файлы локализации (en, es, ru)

## 🚀 Использование SDK

<div align="center">
  <img src="public/dev-stack/Tailwind CSS.svg" alt="SDK Usage" width="60" height="60" />
  <h3>Быстрый старт с готовыми компонентами</h3>
</div>

### Установка в проекте

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Сборка проекта
pnpm build
```

### 🐳 Docker развертывание

Проект поддерживает контейнеризацию с помощью Docker и nginx для production развертывания.

#### Быстрый старт с Docker

```bash
# Сборка образа (версия извлекается из package.json)
docker build -f docker/Dockerfile -t react-sdk:0.0.1 -t react-sdk:latest .

# Запуск контейнера с монтированием nginx конфигурации
docker run -d \
  --name react-sdk-app \
  -p 8080:8080 \
  --restart unless-stopped \
  -v "$(pwd)/configs/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
  react-sdk:latest
```

#### Использование скриптов

```bash
# Сборка образа
./scripts/docker-build.sh build

# Запуск контейнера
./scripts/docker-build.sh run

# Просмотр логов
./scripts/docker-build.sh logs

# Перезагрузка nginx конфигурации
./scripts/docker-build.sh reload

# Просмотр версии
./scripts/docker-build.sh version

# Остановка и очистка
./scripts/docker-build.sh clean
```

#### Особенности Docker конфигурации

- **Многоэтапная сборка** - оптимизированный размер образа
- **Nginx веб-сервер** - production-ready конфигурация
- **Безопасность** - запуск от непривилегированного пользователя
- **Health checks** - встроенная проверка здоровья приложения
- **Gzip сжатие** - оптимизация передачи данных
- **SPA поддержка** - правильная обработка React Router
- **Кастомные страницы ошибок** - 403.html, 404.html и 50x.html

Подробная документация по Docker доступна в [docs/docker-deployment.md](docs/docker-deployment.md).

### Интеграция в другие проекты

SDK можно использовать как:

1. **Библиотеку компонентов** - импортировать готовые компоненты
2. **Шаблон проекта** - использовать архитектуру FSD как основу
3. **Дизайн-систему** - применять стили и темы
4. **Документацию** - изучать примеры через Storybook

### Примеры использования компонентов

```typescript
// Импорт компонентов
import { Button } from '@/shared/ui/components/Button'
import { InputField } from '@/shared/ui/components/InputField'
import { ThemeToggle } from '@/features/ThemeToggle'

// Использование в компоненте
function MyComponent() {
  return (
    <div>
      <InputField
        label="Email"
        type="email"
        placeholder="Введите email"
      />
      <Button variant="primary">
        Отправить
      </Button>
      <ThemeToggle />
    </div>
  )
}
```

## 📚 Storybook - Документация компонентов

<div align="center">
  <img src="public/dev-stack/Storybook.svg" alt="Storybook" width="80" height="80" />
  <h3>Интерактивная документация компонентов</h3>
</div>

Проект включает Storybook для разработки и документирования компонентов.

### Запуск Storybook

```bash
# Запуск сервера разработки Storybook
pnpm storybook

# Сборка статической версии Storybook
pnpm build-storybook
```

### Доступные истории компонентов

- **UI Components** - Button, InputField, Callout, ThemeToggle, FlagIcon, LanguageSwitcher
- **Widgets** - Header (Default, Minimalism, Search), Footer, MobileMenu
- **Features** - LoginForm, LanguageButton, CounterIncrement
- **Layouts** - Default, Center, Wide макеты
- **Responsive Testing** - Тестирование на мобильных, планшетах, десктопах
- **Theme Testing** - Светлая и темная темы
- **Accessibility Testing** - Интеграция с A11y аддоном

Посетите `http://localhost:6006` для изучения библиотеки компонентов.

### Preview

```bash
pnpm preview
```

## 🎨 Theme System

The app includes a comprehensive theme system:

- **Light/Dark themes** with automatic system detection
- **Theme persistence** across browser sessions
- **Smooth transitions** between theme changes
- **CSS variables** for consistent theming

## 🎨 Design System

- **Primary Color**: Blue (#2563eb) [[memory:8765679]]
- **Minimalistic Design**: Clean, focused interface [[memory:8770881]]
- **Grid Layouts**: Consistent component arrangement [[memory:8770881]]
- **DRY SCSS**: Nested styles with & selectors [[memory:8770879]]

## 📝 Development Guidelines

### Adding New Features

1. Create feature in `src/features/`
2. Add UI components to `src/shared/ui/` if reusable
3. Define entities in `src/entities/` if needed
4. Create pages in `src/pages/` for routing
5. Add widgets in `src/widgets/` for composite blocks

### Form Validation

Use the built-in validation functions in `src/shared/lib/forms.ts`:

- `validateEmail()` - Email validation
- `validatePassword()` - Password validation
- `validateName()` - Name validation

### API Integration

Use the API client in `src/shared/api/`:

```typescript
import { apiClient } from '@/shared/api'

// GET request
const response = await apiClient.get<User>('/users/1')

// POST request
const response = await apiClient.post<User>(
  '/users',
  userData,
)
```

## 🔧 Configuration

Environment variables:

- `VITE_API_BASE_URL` - API base URL (default: http://localhost:3000)

### Backend Integration

Проект интегрирован с backend API для работы с аватарами:

1. Создайте файл `.env` в директории `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

2. Убедитесь, что backend запущен на порту 3000

3. Доступные API эндпоинты:
   - `GET /api/list` - получение списка аватаров
   - `GET /api/:id` - получение изображения аватара
   - `POST /api/generate` - генерация нового аватара
   - `DELETE /api/:id` - удаление аватара

4. На главной странице отображается галерея аватаров из backend

Подробная документация: [docs/frontend-backend-integration.md](../docs/frontend-backend-integration.md)

## 📄 Лицензия

Этот проект лицензирован под Apache License 2.0. См. файл [LICENSE](LICENSE) для подробностей.

## 📚 Документация

- [Руководство по написанию сообщений коммитов](docs/COMMIT_MESSAGES.md) - Правила и примеры для создания качественных сообщений коммитов

## 🤝 Вклад в проект

Для внесения изменений в SDK:

1. Создайте feature branch
2. Добавьте новые компоненты в соответствующие слои
3. Обновите Storybook истории
4. Протестируйте изменения
5. Создайте Pull Request

## 📞 Поддержка

По вопросам использования SDK обращайтесь к команде разработки Web2Bizz.
