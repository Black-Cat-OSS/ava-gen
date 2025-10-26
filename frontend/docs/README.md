# Frontend Documentation

## Обзор

Frontend приложение построено с использованием React 19, TypeScript, Vite и следует архитектуре Feature-Sliced Design (FSD). Приложение предоставляет интерфейс для генерации аватаров с поддержкой различных типов генераторов.

## Технологический стек

- **React 19** с TypeScript
- **Vite** для сборки и разработки
- **Tailwind CSS** для стилизации
- **TanStack Router** для маршрутизации
- **React Hook Form** для работы с формами
- **Zod** для валидации
- **React i18next** для интернационализации
- **Storybook** для разработки компонентов

## Архитектура

### Feature-Sliced Design (FSD)

Проект организован согласно методологии FSD:

```
src/
├── app/           # Инициализация приложения
├── pages/         # Страницы приложения
├── widgets/       # Крупные UI блоки
├── features/      # Бизнес-функциональность
├── entities/      # Бизнес-сущности
├── shared/        # Переиспользуемые ресурсы
└── types/         # Глобальные типы
```

### Основные слои

- **App** - конфигурация приложения, провайдеры
- **Pages** - страницы приложения
- **Widgets** - композитные UI блоки
- **Features** - бизнес-функциональность
- **Entities** - бизнес-сущности
- **Shared** - переиспользуемые ресурсы

## Компоненты Avatar Generator

### Классические генераторы

#### AvatarGeneratorForm

Основная форма для создания аватаров с классическими генераторами.

**Расположение:** `src/features/avatar-generator/ui/AvatarGeneratorForm.tsx`

**Функциональность:**
- Выбор типа генератора (pixelize, wave, gradient)
- Настройка цветов (primary, foreign)
- Выбор цветовой схемы
- Ввод seed для уникальности
- Настройка угла для градиентных генераторов

**Используемые компоненты:**
- `GeneratorTypeSelector`
- `ColorPaletteSelector`
- `SeedInput`
- `AngleSelector`

### Emoji Generator

#### EmojiAvatarGeneratorForm

Форма для создания эмодзи-аватаров с пользовательскими фонами.

**Расположение:** `src/features/avatar-generator/ui/EmojiAvatarGeneratorForm.tsx`

**Функциональность:**
- Выбор эмодзи из удобного пикера
- Настройка типа фона (solid, linear, radial)
- Выбор размера эмодзи (small, medium, large)
- Настройка угла градиента для линейных фонов
- Генерация аватара с эмодзи

**Используемые компоненты:**
- `EmojiPickerComponent`
- `BackgroundTypeSelector`
- `EmojiSizeSelector`
- `ColorPaletteSelector`
- `AngleSelector`

#### EmojiPickerComponent

Компонент для выбора эмодзи с использованием библиотеки `emoji-picker-react`.

**Расположение:** `src/features/avatar-generator/ui/EmojiPicker.tsx`

**Особенности:**
- Обертка над `emoji-picker-react`
- Кнопка для открытия/закрытия пикера
- Отображение выбранного эмодзи
- Интеграция с формой через props

**Props:**
```typescript
interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
}
```

#### BackgroundTypeSelector

Селектор типа фона для эмодзи-аватаров.

**Расположение:** `src/features/avatar-generator/ui/BackgroundTypeSelector.tsx`

**Типы фонов:**
- **Solid** - одноцветный фон
- **Linear** - линейный градиент
- **Radial** - радиальный градиент

**Особенности:**
- Визуализация каждого типа фона
- Условный рендеринг настроек угла для линейного градиента
- Интеграция с формой

#### EmojiSizeSelector

Селектор размера эмодзи в аватаре.

**Расположение:** `src/features/avatar-generator/ui/EmojiSizeSelector.tsx`

**Размеры:**
- **Small** - 40% от размера аватара
- **Medium** - 60% от размера аватара
- **Large** - 80% от размера аватара

**Особенности:**
- Радио-кнопки для выбора размера
- Визуальная индикация размеров
- Интеграция с формой

#### EmojiServiceHealthCheck

Компонент-обертка для проверки доступности сервиса эмодзи.

**Расположение:** `src/features/avatar-generator/ui/EmojiServiceHealthCheck.tsx`

**Функциональность:**
- Периодический опрос healthcheck (каждые 30 секунд)
- ErrorBoundary при недоступности сервиса
- Кнопка "Повторить проверку"
- Отображение статуса сервиса

**Особенности:**
- Автоматическая проверка доступности Twemoji CDN
- Graceful degradation при недоступности сервиса
- Информативные сообщения об ошибках

## API Integration

### Avatar API Client

**Расположение:** `src/shared/api/avatar.ts`

**Методы:**

#### generateAvatar (v2)
Создание аватара с классическими генераторами.

```typescript
generateAvatar: async (params: GenerateAvatarParams): Promise<GenerateAvatarResponse>
```

#### generateEmoji (v3)
Создание эмодзи-аватара.

```typescript
generateEmoji: async (params: GenerateEmojiAvatarParams): Promise<GenerateAvatarResponse>
```

**Параметры:**
```typescript
interface GenerateEmojiAvatarParams {
  emoji: string;
  backgroundType: 'solid' | 'linear' | 'radial';
  primaryColor?: string;
  foreignColor?: string;
  angle?: number;
  emojiSize?: 'small' | 'medium' | 'large';
}
```

## Типы данных

### Emoji Avatar Types

**Расположение:** `src/features/avatar-generator/types/index.ts`

```typescript
export type BackgroundType = 'solid' | 'linear' | 'radial';
export type EmojiSize = 'small' | 'medium' | 'large';

export interface EmojiAvatarFormData {
  emoji: string;
  backgroundType: BackgroundType;
  primaryColor: string;
  foreignColor: string;
  angle: number;
  emojiSize: EmojiSize;
}
```

## Локализация

### Поддерживаемые языки

- English (en)
- Русский (ru)
- Español (es)
- Deutsch (de)
- Eesti (et)

### Переводы для Emoji Generator

**Файлы:** `src/shared/locales/`

**Ключи переводов:**
- `pages.avatarGenerator.generatorTypes.emoji`
- `features.avatarGenerator.emojiPicker.*`
- `features.avatarGenerator.backgroundType.*`
- `features.avatarGenerator.emojiSize.*`
- `features.avatarGenerator.healthCheck.*`

## Storybook Integration

### Компоненты со Storybook Stories

- `EmojiPickerComponent` - демонстрация выбора эмодзи
- `BackgroundTypeSelector` - показ различных типов фонов
- `EmojiSizeSelector` - визуализация размеров эмодзи
- `EmojiAvatarGeneratorForm` - полная форма генерации

### Запуск Storybook

```bash
npm run storybook
```

## Страницы

### AvatarGeneratorPage

Главная страница генерации аватаров.

**Расположение:** `src/pages/avatar-generator/ui/AvatarGeneratorPage.tsx`

**Функциональность:**
- Переключатель между типами генераторов (Classic/Emoji)
- Условный рендеринг форм на основе выбранного типа
- Интеграция проверки доступности сервиса эмодзи
- Отображение результатов генерации

**Особенности:**
- Табы для переключения между генераторами
- Сохранение состояния формы при переключении
- Автоматическая проверка доступности Twemoji CDN

## Контексты

### AvatarGeneratorContext

Контекст для управления состоянием сгенерированных аватаров.

**Расположение:** `src/features/avatar-generator/contexts/AvatarGeneratorContext.tsx`

**Функциональность:**
- Хранение данных сгенерированного аватара
- Методы для обновления состояния
- Типизированный контекст

## Зависимости

### Основные

- `react` - UI библиотека
- `react-dom` - DOM рендеринг
- `react-router-dom` - маршрутизация
- `react-hook-form` - работа с формами
- `zod` - валидация
- `react-i18next` - интернационализация

### Emoji Generator

- `emoji-picker-react` - компонент выбора эмодзи

### UI Components

- `@radix-ui/react-*` - примитивы UI компонентов
- `tailwindcss` - CSS фреймворк
- `clsx` - утилиты для классов
- `tailwind-merge` - слияние Tailwind классов

## Сборка и разработка

### Команды

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview

# Запуск Storybook
npm run storybook

# Линтинг
npm run lint

# Форматирование кода
npm run format
```

### Конфигурация

- **Vite** - `vite.config.ts`
- **TypeScript** - `tsconfig.json`
- **Tailwind** - `tailwind.config.ts`
- **ESLint** - `eslint.config.js`

## Тестирование

### Unit тесты

```bash
npm run test
```

### Компонентные тесты

```bash
npm run test:components
```

### E2E тесты

```bash
npm run test:e2e
```

## Производительность

### Оптимизации

- Code splitting по страницам
- Lazy loading компонентов
- Мемоизация дорогих вычислений
- Оптимизация изображений

### Bundle анализ

```bash
npm run analyze
```

## Развертывание

### Docker

```bash
docker build -t avatar-gen-frontend .
docker run -p 3000:3000 avatar-gen-frontend
```

### Статический хостинг

```bash
npm run build
# Деплой dist/ директории
```

## Troubleshooting

### Частые проблемы

1. **Ошибки TypeScript** - проверьте типы в `types/` директории
2. **Проблемы с переводами** - убедитесь что ключи существуют в locale файлах
3. **Ошибки сборки** - очистите кеш: `npm run clean && npm install`

### Отладка

- Используйте React DevTools
- Проверяйте консоль браузера
- Анализируйте Network tab для API запросов
