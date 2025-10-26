<!-- b506dade-d49d-4f09-82c4-2f6fb51f648d 2c6ccb9c-2b76-4078-a9d9-3b73e969171f -->

# Рефакторинг: Создание сервисного Emoji модуля

## Обзор

Создаем независимый сервисный модуль Emoji для работы с Twemoji CDN. Avatar
модуль использует его как зависимость для генерации emoji-аватаров.

## Архитектура

- **Emoji модуль** - сервисный модуль (аналог StorageService, CacheService)
- **Avatar модуль** - использует EmojiService для генерации emoji-аватаров
- V3 endpoint остается в AvatarController

## Backend изменения

### 1. Создание структуры Emoji модуля

Создать сервисный модуль:

- `backend/src/modules/emoji/` - корневая директория
- `backend/src/modules/emoji/emoji.module.ts` - основной модуль
- `backend/src/modules/emoji/emoji.service.ts` - сервис для работы с emoji
- `backend/src/modules/emoji/emoji.controller.ts` - контроллер для healthcheck
- `backend/src/modules/emoji/dto/` - директория для DTO
- `backend/src/modules/emoji/interfaces/` - интерфейсы
- `backend/src/modules/emoji/index.ts` - экспорты

### 2. Создание EmojiService

В `backend/src/modules/emoji/emoji.service.ts`:

- `fetchEmojiSvg(emoji: string): Promise<Buffer>` - получение SVG с Twemoji CDN
- `rasterizeEmoji(svgBuffer: Buffer, size: number): Promise<Buffer>` -
  растеризация SVG в PNG
- `checkTwemojiAvailability(): Promise<boolean>` - проверка доступности CDN
- Кеширование загруженных emoji
- Использование Sharp для растеризации

### 3. Создание интерфейсов

В `backend/src/modules/emoji/interfaces/`:

- `emoji-options.interface.ts` - опции для обработки emoji
- `emoji-result.interface.ts` - результат обработки
- `index.ts` - экспорты

### 4. Создание EmojiController

В `backend/src/modules/emoji/emoji.controller.ts`:

- `GET /api/emoji/health` - healthcheck Twemoji CDN
- Swagger документация
- Возвращает: `{ available: boolean, lastChecked: Date }`

### 5. Перенос emoji-generator логики в Avatar

Обновить
`backend/src/modules/avatar/modules/emoji-driver/emoji-generator.module.ts`:

- Инжектировать `EmojiService` вместо прямой работы с CDN
- Использовать `emojiService.fetchEmojiSvg()` для получения emoji
- Использовать `emojiService.rasterizeEmoji()` для растеризации
- Убрать дублирование логики работы с Twemoji

### 6. Обновление GenerateAvatarV3Dto

Оставить `backend/src/modules/avatar/dto/generate-avatar-v3.dto.ts` без
изменений:

- DTO остается в Avatar модуле (не переносится)
- Используется в AvatarController v3 endpoint

### 7. Обновление AvatarService

В `backend/src/modules/avatar/avatar.service.ts`:

- Инжектировать `EmojiService`
- В `healthCheck()` использовать `emojiService.checkTwemojiAvailability()`
- Метод `generateAvatarV3()` остается без изменений

### 8. Обновление GeneratorService

В `backend/src/modules/avatar/modules/generator/generator.service.ts`:

- Метод `checkTwemojiAvailability()` делегирует в `EmojiService`
- Остальная логика без изменений

### 9. Регистрация Emoji модуля

В `backend/src/modules/app/app.module.ts`:

- Импортировать `EmojiModule`
- Добавить в imports (до AvatarModule, т.к. Avatar зависит от Emoji)

В `backend/src/modules/avatar/avatar.module.ts`:

- Импортировать `EmojiModule`
- Добавить в imports

### 10. Создание тестов для Emoji модуля

Создать новые тесты:

- `backend/src/modules/emoji/__tests__/emoji.service.spec.ts` - тесты
  EmojiService
- `backend/src/modules/emoji/__tests__/emoji.controller.spec.ts` - тесты
  EmojiController
- Покрыть: fetchEmojiSvg, rasterizeEmoji, checkTwemojiAvailability, кеширование

### 11. Обновление существующих тестов

В
`backend/src/modules/avatar/modules/emoji-driver/__tests__/emoji-generator.module.spec.ts`:

- Обновить моки для использования EmojiService
- Тесты остаются в Avatar модуле (т.к. emoji-generator часть Avatar)

## Frontend изменения

### 1. Обновление EmojiServiceHealthCheck

В `frontend/src/features/avatar-generator/ui/EmojiServiceHealthCheck.tsx`:

- Изменить URL с `/api/health` на `/api/emoji/health`
- Обновить парсинг ответа (только `{ available, lastChecked }`)
- Убрать обработку services.twemoji структуры

### 2. API клиент остается без изменений

В `frontend/src/shared/api/avatar.ts`:

- Метод `generateEmoji()` продолжает вызывать `/api/v3/generate`
- Никаких изменений не требуется

## Документация

### 1. Создать документацию Emoji модуля

Файл: `backend/docs/modules/EMOJI_MODULE.md`

- Описание сервисного модуля
- API методы EmojiService
- Healthcheck endpoint
- Примеры использования из других модулей
- Кеширование и оптимизация

### 2. Обновить документацию Avatar модуля

Файл: `backend/docs/modules/AVATAR_MODULE.md`

- Добавить информацию о зависимости от Emoji модуля
- Описать использование EmojiService в emoji-generator
- Обновить схему архитектуры

## Проверки

- Backend компилируется без ошибок
- Frontend компилируется без ошибок
- Все тесты проходят
- V3 API endpoint работает как прежде
- Emoji health check доступен по `/api/emoji/health`
- Frontend healthcheck работает с новым endpoint

### To-dos

- [ ] Создать структуру директорий Emoji модуля (service, controller, dto,
      interfaces)
- [ ] Создать EmojiService с методами fetchEmojiSvg, rasterizeEmoji,
      checkTwemojiAvailability
- [ ] Создать интерфейсы для Emoji модуля
- [ ] Создать EmojiController с /api/emoji/health endpoint
- [ ] Обновить emoji-generator для использования EmojiService вместо прямой
      работы с CDN
- [ ] Обновить AvatarService для использования EmojiService в healthCheck
- [ ] Обновить GeneratorService для делегирования checkTwemojiAvailability в
      EmojiService
- [ ] Зарегистрировать EmojiModule в AppModule и AvatarModule
- [ ] Создать unit тесты для EmojiService и EmojiController
- [ ] Обновить тесты emoji-generator для использования EmojiService моков
- [ ] Обновить frontend EmojiServiceHealthCheck для нового /api/emoji/health
      endpoint
- [ ] Создать документацию для сервисного Emoji модуля
- [ ] Обновить документацию Avatar модуля с информацией о зависимости от Emoji
- [ ] Проверить компиляцию backend и frontend, запустить тесты
