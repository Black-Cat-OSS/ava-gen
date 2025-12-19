# Интеграция React приложения с Backend

Это руководство описывает, как разместить собранное React приложение в backend для раздачи через один сервер.

## Архитектура

Backend NestJS настроен на раздачу статических файлов из директории `static/` через корневой URL `/`. Это позволяет:

- Разместить React приложение на том же домене, что и API
- Избежать проблем с CORS
- Упростить деплой (один сервер вместо двух)
- Использовать React Router без дополнительной настройки

## Структура проекта

```
ava-gen/
├── frontend/              # React приложение
│   ├── src/
│   ├── dist/             # Собранное приложение (после npm run build)
│   └── package.json
├── backend/
│   ├── static/           # Сюда копируются файлы из frontend/dist/
│   │   ├── index.html
│   │   ├── assets/
│   │   └── ...
│   └── src/
└── README.md
```

## Процесс интеграции

### Вариант 1: Ручное копирование

#### Шаг 1: Сборка React приложения

```bash
cd frontend
npm run build
```

Это создаст директорию `frontend/dist/` с собранным приложением.

#### Шаг 2: Копирование файлов

```bash
# Из корня проекта
rm -rf backend/static/*
cp -r frontend/dist/* backend/static/
```

#### Шаг 3: Сборка backend

```bash
cd backend
npm run build
```

#### Шаг 4: Запуск

```bash
npm run start:prod
```

React приложение будет доступно по адресу `http://localhost:3000/`

### Вариант 2: Автоматизация через скрипты

Создайте скрипт в корне проекта `deploy-frontend.sh`:

```bash
#!/bin/bash

echo "Building frontend..."
cd frontend
npm run build

echo "Copying files to backend..."
cd ..
rm -rf backend/static/*
cp -r frontend/dist/* backend/static/

echo "Building backend..."
cd backend
npm run build

echo "Done! Frontend deployed to backend/static/"
```

Использование:

```bash
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

### Вариант 3: npm скрипт

Добавьте в `package.json` в корне проекта:

```json
{
  "scripts": {
    "deploy:frontend": "cd frontend && npm run build && cd .. && rm -rf backend/static/* && cp -r frontend/dist/* backend/static/ && cd backend && npm run build"
  }
}
```

Использование:

```bash
npm run deploy:frontend
```

## Настройка React приложения

### Vite

Убедитесь, что в `vite.config.ts` установлен правильный `base`:

```typescript
export default defineConfig({
  base: '/', // Важно: должно быть '/'
  // ... остальные настройки
})
```

### Create React App

По умолчанию CRA использует `base: '/'`, дополнительная настройка не требуется.

### React Router

React Router будет работать корректно, так как backend настроен на отдачу `index.html` для всех неизвестных маршрутов (кроме `/api/*` и `/swagger/*`).

Пример настройки:

```typescript
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* Ваши маршруты */}
    </BrowserRouter>
  );
}
```

## API запросы из React

### Относительные пути

Так как frontend и backend на одном домене, используйте относительные пути:

```typescript
// ✅ Правильно
const response = await fetch('/api/v1/avatar/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

// ❌ Неправильно (не нужно указывать полный URL)
const response = await fetch('http://localhost:3000/api/v1/avatar/generate', ...);
```

### Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Относительный путь
});

// Использование
const response = await api.post('/v1/avatar/generate', data);
```

## Маршруты

### Зарезервированные маршруты

Следующие маршруты зарезервированы для backend:

- `/api/*` - API endpoints
- `/swagger/*` - Swagger документация

### Доступные маршруты для React

Все остальные маршруты доступны для React Router:

- `/` - главная страница
- `/about` - любые другие страницы
- `/users/:id` - динамические маршруты
- и т.д.

## Режим разработки

### Отдельные серверы (рекомендуется для разработки)

Во время разработки рекомендуется запускать frontend и backend отдельно:

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Frontend (Vite) будет работать на `http://localhost:5173/`, а backend на `http://localhost:3000/`.

### Настройка прокси в Vite

Добавьте в `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/swagger': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

## Production деплой

### Docker

Пример `Dockerfile` для production:

```dockerfile
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./static
RUN npm run build

# Stage 3: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## Проверка интеграции

После деплоя проверьте:

1. **Главная страница**: `http://localhost:3000/` - должна отдавать React приложение
2. **API**: `http://localhost:3000/api/health` - должен работать
3. **Swagger**: `http://localhost:3000/swagger` - должен быть доступен
4. **React Router**: Переходы между страницами должны работать без перезагрузки
5. **Прямые ссылки**: `http://localhost:3000/about` - должны работать (не 404)

## Troubleshooting

### 404 на маршрутах React Router

**Проблема**: При прямом переходе на `/about` получаете 404.

**Решение**: Убедитесь, что маршрут не начинается с `/api` или `/swagger`.

### API запросы не работают

**Проблема**: Fetch запросы к API возвращают ошибки.

**Решение**: Проверьте, что используете относительные пути `/api/...`, а не абсолютные.

### Статические ресурсы не загружаются

**Проблема**: CSS, JS файлы не загружаются.

**Решение**: Убедитесь, что в конфигурации React используется `base: '/'`.

## Дополнительные ресурсы

- [NestJS Serve Static](https://docs.nestjs.com/recipes/serve-static)
- [Vite Configuration](https://vitejs.dev/config/)
- [React Router](https://reactrouter.com/)

