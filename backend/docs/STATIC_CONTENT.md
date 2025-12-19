# Раздача статического контента

## Описание

Приложение настроено для раздачи статического контента (HTML, CSS, JavaScript файлы) через встроенный механизм NestJS.

## Конфигурация

### Модуль ServeStaticModule

В `app.module.ts` подключен модуль `@nestjs/serve-static` со следующими параметрами:

- **rootPath**: `static/` - директория с статическими файлами в корне backend
- **serveRoot**: `/static` - URL префикс для доступа к статическим файлам
- **exclude**: `['/api*', '/swagger*']` - исключения для API и Swagger маршрутов

### Структура директории static

```
backend/
├── static/
│   ├── index.html    # Главная страница
│   ├── styles.css    # Стили
│   └── script.js     # JavaScript файлы
```

## Использование

### Доступ к статическим файлам

Статические файлы доступны по следующим URL:

- `http://localhost:3000/static/index.html` - главная страница
- `http://localhost:3000/static/styles.css` - файл стилей
- `http://localhost:3000/static/script.js` - JavaScript файл

### Добавление новых файлов

1. Поместите файлы в директорию `backend/static/`
2. Пересоберите проект: `npm run build`
3. Файлы автоматически скопируются в `dist/static/` и будут доступны по URL `/static/<имя_файла>`

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
- Все статические файлы должны быть доступны по префиксу `/static/`

## Поддерживаемые типы файлов

- HTML (*.html)
- CSS (*.css)
- JavaScript (*.js)
- Любые другие статические файлы (изображения, шрифты и т.д.)

## Примеры

### Пример HTML файла

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
    <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
    <h1>Hello World</h1>
    <script src="/static/script.js"></script>
</body>
</html>
```

### Ссылки на ресурсы

При ссылке на статические ресурсы используйте полный путь с префиксом `/static/`:

```html
<link rel="stylesheet" href="/static/styles.css">
<script src="/static/script.js"></script>
<img src="/static/images/logo.png" alt="Logo">
```

