# Раздача статического контента

## Описание

Приложение настроено для раздачи статического контента (HTML, CSS, JavaScript файлы) через встроенный механизм NestJS.

## Конфигурация

### Модуль ServeStaticModule

В `app.module.ts` подключен модуль `@nestjs/serve-static` со следующими параметрами:

- **rootPath**: `static/` - директория с статическими файлами в корне backend
- **exclude**: `['/api*', '/swagger*']` - исключения для API и Swagger маршрутов

Статические файлы раздаются из корня `/`, что позволяет размещать собранное React приложение в директории `static/`.

### Структура директории static

```
backend/
├── static/
│   ├── index.html    # Главная страница
│   ├── assets/       # Ресурсы React приложения (после сборки)
│   └── ...           # Другие файлы React приложения
```

## Использование

### Доступ к статическим файлам

Статические файлы доступны из корня приложения:

- `http://localhost:3000/` или `http://localhost:3000/index.html` - главная страница
- `http://localhost:3000/assets/...` - ресурсы приложения
- Любые другие файлы из директории `static/`

**Важно:** Маршруты `/api/*` и `/swagger/*` зарезервированы для API и документации.

### Размещение React приложения

1. Соберите React приложение: `npm run build` (в директории frontend)
2. Скопируйте содержимое `frontend/dist/` или `frontend/build/` в `backend/static/`
3. Пересоберите backend: `npm run build` (в директории backend)
4. React приложение будет доступно по адресу `http://localhost:3000/`

### Добавление новых файлов

1. Поместите файлы в директорию `backend/static/`
2. Пересоберите проект: `npm run build`
3. Файлы автоматически скопируются в `dist/static/` и будут доступны из корня

## Сборка проекта

При сборке проекта статические файлы автоматически копируются в директорию `dist/static/` благодаря настройке в `nest-cli.json`:

```json
{
  "compilerOptions": {
    "assets": [
      {
        "include": "../static/**/*",
        "outDir": "dist/static",
        "watchAssets": true
      }
    ]
  }
}
```

## Разработка

В режиме разработки (`npm run start:dev`) изменения в статических файлах отслеживаются автоматически благодаря опции `watchAssets: true`.

## Ограничения

- Статические файлы не раздаются для путей, начинающихся с `/api` и `/swagger`
- Все остальные запросы будут обрабатываться как запросы к статическим файлам
- Для SPA (Single Page Application) все неизвестные маршруты будут отдавать `index.html`

## Поддерживаемые типы файлов

- HTML (\*.html)
- CSS (\*.css)
- JavaScript (\*.js)
- Любые другие статические файлы (изображения, шрифты и т.д.)

## Примеры

### Пример HTML файла

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>My Page</title>
    <link rel="stylesheet" href="/static/styles.css" />
  </head>
  <body>
    <h1>Hello World</h1>
    <script src="/static/script.js"></script>
  </body>
</html>
```

### Ссылки на ресурсы

При ссылке на статические ресурсы используйте абсолютные пути от корня:

```html
<link rel="stylesheet" href="/styles.css" />
<script src="/script.js"></script>
<img src="/assets/logo.png" alt="Logo" />
```

### Интеграция с React

При сборке React приложения (Vite, Create React App и т.д.) убедитесь, что:

1. `base` в конфигурации установлен в `/` (по умолчанию)
2. После сборки скопируйте все файлы из `dist/` или `build/` в `backend/static/`
3. React Router будет работать корректно, так как все неизвестные маршруты будут отдавать `index.html`
