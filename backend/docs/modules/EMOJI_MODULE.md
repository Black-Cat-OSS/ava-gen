# Emoji Module

Сервисный модуль для работы с эмодзи через Twemoji CDN.

## Обзор

Emoji модуль предоставляет централизованную функциональность для:
- Получения SVG эмодзи с Twemoji CDN
- Растеризации SVG в PNG формат
- Проверки доступности внешнего сервиса
- Кеширования загруженных эмодзи

## Архитектура

```
backend/src/modules/emoji/
├── emoji.module.ts          # Основной модуль
├── emoji.service.ts         # Сервис для работы с эмодзи
├── emoji.controller.ts      # Контроллер для healthcheck
├── interfaces/              # Интерфейсы модуля
│   ├── emoji-options.interface.ts
│   ├── emoji-result.interface.ts
│   └── index.ts
├── __tests__/               # Unit тесты
│   ├── emoji.service.spec.ts
│   └── emoji.controller.spec.ts
└── index.ts                 # Экспорты модуля
```

## API

### EmojiService

#### `fetchEmojiSvg(emoji: string, options?: EmojiOptions): Promise<Buffer>`

Получает SVG эмодзи с Twemoji CDN.

**Параметры:**
- `emoji` - строка эмодзи (например, '😀')
- `options` - опции обработки (кеширование, размер, CDN URL)

**Возвращает:** Buffer с SVG содержимым

**Пример:**
```typescript
const svgBuffer = await emojiService.fetchEmojiSvg('😀');
```

#### `rasterizeEmoji(svgBuffer: Buffer, options: EmojiRasterizeOptions): Promise<Buffer>`

Растеризует SVG эмодзи в PNG формат.

**Параметры:**
- `svgBuffer` - Buffer с SVG содержимым
- `options` - опции растеризации (размеры, фон, формат)

**Возвращает:** Buffer с PNG содержимым

**Пример:**
```typescript
const pngBuffer = await emojiService.rasterizeEmoji(svgBuffer, {
  width: 64,
  height: 64,
  format: 'png'
});
```

#### `checkTwemojiAvailability(): Promise<boolean>`

Проверяет доступность Twemoji CDN.

**Возвращает:** boolean - доступен ли сервис

**Пример:**
```typescript
const isAvailable = await emojiService.checkTwemojiAvailability();
```

#### `getHealthInfo(): Promise<EmojiHealthResult>`

Получает подробную информацию о состоянии сервиса.

**Возвращает:** объект с информацией о доступности, времени ответа и ошибках

**Пример:**
```typescript
const health = await emojiService.getHealthInfo();
console.log(health.available, health.responseTime);
```

### EmojiController

#### `GET /api/emoji/health`

Healthcheck endpoint для проверки доступности Twemoji CDN.

**Ответ:**
```json
{
  "available": true,
  "lastChecked": "2025-01-26T10:30:00.000Z",
  "responseTime": 150,
  "error": null
}
```

## Интерфейсы

### EmojiOptions

```typescript
interface EmojiOptions {
  size?: number;           // Размер эмодзи в пикселях
  cache?: boolean;         // Использовать кеширование
  cdnUrl?: string;         // Кастомный URL CDN
}
```

### EmojiRasterizeOptions

```typescript
interface EmojiRasterizeOptions {
  width: number;           // Ширина в пикселях
  height: number;          // Высота в пикселях
  backgroundColor?: string; // Цвет фона для прозрачных областей
  format?: 'png' | 'jpeg' | 'webp'; // Формат вывода
}
```

### EmojiResult

```typescript
interface EmojiResult {
  emoji: string;          // Обработанный эмодзи
  svgBuffer: Buffer;      // SVG содержимое
  pngBuffer?: Buffer;     // PNG содержимое (если растеризован)
  processedAt: Date;      // Время обработки
  fromCache: boolean;     // Из кеша ли получен
}
```

### EmojiHealthResult

```typescript
interface EmojiHealthResult {
  available: boolean;      // Доступен ли сервис
  lastChecked: Date;      // Время последней проверки
  responseTime?: number;  // Время ответа в мс
  error?: string;         // Сообщение об ошибке
}
```

## Использование в других модулях

### В Avatar модуле

```typescript
import { EmojiService } from '../emoji';

@Injectable()
export class EmojiGeneratorModule {
  constructor(private readonly emojiService: EmojiService) {}

  async generateEmojiAvatar(emoji: string) {
    // Получить SVG эмодзи
    const svgBuffer = await this.emojiService.fetchEmojiSvg(emoji);
    
    // Растеризовать в PNG
    const pngBuffer = await this.emojiService.rasterizeEmoji(svgBuffer, {
      width: 64,
      height: 64,
      format: 'png'
    });
    
    // Использовать для генерации аватара
    return this.compositeEmojiOnBackground(backgroundBuffer, pngBuffer);
  }
}
```

### Проверка доступности

```typescript
@Injectable()
export class AvatarService {
  constructor(private readonly emojiService: EmojiService) {}

  async healthCheck() {
    const twemojiAvailable = await this.emojiService.checkTwemojiAvailability();
    
    if (!twemojiAvailable) {
      this.logger.warn('Twemoji CDN is not available');
    }
    
    return {
      database: true,
      twemoji: twemojiAvailable,
      status: twemojiAvailable ? 'healthy' : 'unhealthy'
    };
  }
}
```

## Кеширование

EmojiService автоматически кеширует загруженные SVG эмодзи для повышения производительности:

- Кеш хранится в памяти (Map)
- Ключ кеша: `svg:${emoji}`
- Кеширование можно отключить через `options.cache = false`
- Методы управления кешем:
  - `clearCache()` - очистить кеш
  - `getCacheStats()` - получить статистику кеша

## Конфигурация

### Twemoji CDN URL

По умолчанию используется: `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/`

Можно переопределить через параметр `cdnUrl` в `EmojiOptions`.

### Таймауты

- Healthcheck: 5 секунд
- Fetch запросы: стандартные браузерные таймауты

## Обработка ошибок

### Типичные ошибки

1. **Invalid emoji** - неверный эмодзи
2. **Failed to fetch emoji SVG** - ошибка загрузки с CDN
3. **Failed to rasterize emoji** - ошибка растеризации

### Логирование

Все ошибки логируются через NestJS Logger с соответствующими уровнями:
- `debug` - успешные операции
- `warn` - недоступность CDN
- `error` - критические ошибки

## Тестирование

### Unit тесты

```bash
# Запуск тестов Emoji модуля
npm run test src/modules/emoji

# Запуск конкретного теста
npm run test src/modules/emoji/__tests__/emoji.service.spec.ts
```

### Моки

Тесты используют моки для:
- `twemoji-parser` - парсинг эмодзи
- `sharp` - растеризация изображений
- `global.fetch` - HTTP запросы

## Зависимости

- `twemoji-parser` - парсинг эмодзи в Unicode коды
- `sharp` - растеризация SVG в PNG
- `@nestjs/common` - базовые NestJS компоненты

## Производительность

### Оптимизации

1. **Кеширование** - избегает повторных загрузок
2. **HEAD запросы** - для healthcheck используются легкие HEAD запросы
3. **Параллельная обработка** - множественные эмодзи обрабатываются параллельно

### Мониторинг

- Время ответа CDN отслеживается в healthcheck
- Статистика кеша доступна через `getCacheStats()`
- Логирование всех операций для отладки

## Безопасность

- Валидация входных эмодзи через `twemoji-parser`
- Таймауты для предотвращения зависания
- Обработка некорректных ответов CDN
