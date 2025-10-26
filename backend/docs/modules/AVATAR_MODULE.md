# Avatar Module

Модуль для генерации и управления аватарами с поддержкой различных типов генераторов.

## Обзор

Avatar модуль предоставляет функциональность для создания уникальных аватаров с использованием различных алгоритмов генерации. Поддерживаются следующие типы генераторов:

- **Pixelize** - классический пиксельный узор
- **Wave** - плавный волновой узор  
- **Gradient** - линейный градиентный узор
- **Emoji** - аватары с эмодзи на пользовательских фонах

## Архитектура

### Основные компоненты

- `AvatarController` - REST API контроллер
- `AvatarService` - бизнес-логика управления аватарами
- `GeneratorService` - оркестратор генераторов
- `StorageService` - управление хранением аватаров
- `CacheService` - кеширование аватаров

### Генераторы

Каждый генератор реализует интерфейс `IGeneratorStrategy`:

```typescript
interface IGeneratorStrategy {
  generateAvatar(
    primaryColor?: string,
    foreignColor?: string,
    colorScheme?: string,
    seed?: string,
    angle?: number
  ): Promise<AvatarObject>;
}
```

## API Endpoints

### v2/generate (Classic Generators)

Создание аватара с использованием классических генераторов.

**POST** `/api/v2/generate`

**Request Body:**
```json
{
  "primaryColor": "#3b82f6",
  "foreignColor": "#ef4444", 
  "colorScheme": "default",
  "seed": "unique-seed",
  "generatorType": "pixelize",
  "angle": 90
}
```

**Response:**
```json
{
  "id": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "version": 1
}
```

### v3/generate (Emoji Generator)

Создание эмодзи-аватара с пользовательским фоном.

**POST** `/api/v3/generate`

**Request Body:**
```json
{
  "emoji": "😀",
  "backgroundType": "linear",
  "primaryColor": "#3b82f6",
  "foreignColor": "#ef4444",
  "angle": 90,
  "emojiSize": "large"
}
```

**Параметры:**

- `emoji` (string, обязательный) - Unicode эмодзи
- `backgroundType` (enum, обязательный) - Тип фона: `solid`, `linear`, `radial`
- `primaryColor` (string, опциональный) - Основной цвет фона (hex формат)
- `foreignColor` (string, опциональный) - Вторичный цвет для градиентов (hex формат)
- `angle` (number, опциональный) - Угол градиента (0-360°)
- `emojiSize` (enum, опциональный) - Размер эмодзи: `small`, `medium`, `large`

**Response:**
```json
{
  "id": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z", 
  "version": 1
}
```

## Emoji Generator

### Особенности

- Загрузка SVG эмодзи из Twemoji CDN
- Растеризация SVG в PNG с помощью Sharp
- Генерация фонов (solid/linear/radial)
- Композиция эмодзи на фон с настраиваемым размером
- Кеширование загруженных эмодзи

### Процесс генерации

1. **Конвертация эмодзи** - Unicode в codepoint для Twemoji URL
2. **Загрузка SVG** - с CDN `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/...`
3. **Растеризация** - SVG в PNG буфер нужного размера
4. **Генерация фона** - solid/linear/radial gradient
5. **Композиция** - наложение эмодзи на фон с учетом размера
6. **Возврат** - финальный PNG для всех размеров (4n-9n)

### Размеры эмодзи

- **Small** - 40% от размера аватара
- **Medium** - 60% от размера аватара  
- **Large** - 80% от размера аватара

### Типы фонов

- **Solid** - одноцветный фон
- **Linear** - линейный градиент с настраиваемым углом
- **Radial** - радиальный градиент от центра

## Health Check

**GET** `/api/health`

Проверяет состояние системы и внешних сервисов.

**Response:**
```json
{
  "database": 42,
  "status": "healthy",
  "services": {
    "twemoji": {
      "available": true,
      "lastChecked": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Статусы:**
- `healthy` - все сервисы доступны
- `unhealthy` - один или более сервисов недоступны

## Хранение данных

### Avatar Entity

В базе данных сохраняется только базовая информация:

```typescript
{
  id: string,
  name: string,
  filePath: string,
  primaryColor: string,
  foreignColor: string,
  colorScheme: string,
  seed: string,
  generatorType: 'pixelize' | 'wave' | 'gradient' | 'emoji',
  createdAt: Date,
  updatedAt: Date,
  version: number
}
```

### AvatarObject

Расширенная информация с метаданными:

```typescript
{
  meta_data_name: string,
  meta_data_created_at: Date,
  meta_data_payload?: Record<string, unknown>, // Дополнительные данные генератора
  image_4n: Buffer,
  image_5n: Buffer,
  image_6n: Buffer,
  image_7n: Buffer,
  image_8n: Buffer,
  image_9n: Buffer
}
```

### Payload для Emoji Generator

```typescript
{
  emoji: string,
  backgroundType: 'solid' | 'linear' | 'radial',
  emojiSize: 'small' | 'medium' | 'large',
  angle?: number // для linear градиента
}
```

## Валидация

### DTO Validation

Все входные данные валидируются с помощью `class-validator`:

- **Emoji** - проверка на валидный Unicode эмодзи
- **Colors** - проверка hex формата (#RRGGBB)
- **Angles** - диапазон 0-360°
- **Enums** - только допустимые значения

### Ограничения

- Максимальная длина эмодзи: 10 символов
- Цвета в формате hex (#RRGGBB)
- Углы в диапазоне 0-360°
- Размеры эмодзи: small/medium/large

## Обработка ошибок

### Типичные ошибки

- **400 Bad Request** - невалидные входные данные
- **500 Internal Server Error** - ошибки генерации
- **503 Service Unavailable** - недоступность внешних сервисов

### Логирование

- Предупреждения при недоступности Twemoji CDN
- Ошибки генерации с детальной информацией
- Успешные операции с ID созданного аватара

## Примеры использования

### Создание классического аватара

```bash
curl -X POST http://localhost:3000/api/v2/generate \
  -H "Content-Type: application/json" \
  -d '{
    "primaryColor": "#3b82f6",
    "foreignColor": "#ef4444",
    "generatorType": "pixelize",
    "seed": "my-unique-seed"
  }'
```

### Создание эмодзи-аватара

```bash
curl -X POST http://localhost:3000/api/v3/generate \
  -H "Content-Type: application/json" \
  -d '{
    "emoji": "🚀",
    "backgroundType": "linear",
    "primaryColor": "#ff6b6b",
    "foreignColor": "#4ecdc4",
    "angle": 45,
    "emojiSize": "large"
  }'
```

### Проверка состояния

```bash
curl http://localhost:3000/api/health
```

## Зависимости

- `twemoji-parser` - парсинг эмодзи
- `sharp` - обработка изображений
- `class-validator` - валидация DTO
- `class-transformer` - трансформация данных

## Мониторинг

- Health check каждые 30 секунд для Twemoji CDN
- Логирование недоступности внешних сервисов
- Метрики генерации аватаров
- Кеш статистика для оптимизации
