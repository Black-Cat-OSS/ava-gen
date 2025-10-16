# Getting Started

## 🎯 Добро пожаловать в Avatar Generator!

Avatar Generator - это open source приложение для генерации уникальных аватаров
в стиле GitHub/GitLab.

## 🚀 Быстрый старт (5 минут)

### Запуск с Docker (рекомендуется)

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/letnull19A/avatar-gen.git
cd avatar-gen

# 2. Запустите все сервисы
./scripts/start.sh --db sqlite --storage local

# 3. Откройте в браузере
open https://localhost:12745
```

### Локальная установка

```bash
# 1. Установите зависимости
pnpm install

# 2. Запустите в dev режиме
pnpm run dev

# 3. Откройте в браузере
open http://localhost:5173
```

## 🎨 Первая генерация аватара

### Через веб-интерфейс

1. Откройте главную страницу
2. Введите любое имя (например, "john_doe")
3. Выберите цветовую схему
4. Нажмите "Generate Avatar"
5. Аватар появится на странице

### Через API

```bash
# Генерация аватара
curl -X POST https://localhost:12745/api/generate \
  -H "Content-Type: application/json" \
  -k \
  -d '{"seed": "my_username", "colorScheme": "vibrant"}'

# Получение аватара
curl https://localhost:12745/api/{avatar-id} -k -o avatar.png
```

## 📚 Что дальше?

### 👤 Для пользователей

- [Установка](installation.md) - подробная установка
- [Примеры](examples.md) - практические примеры
- [Сообщество](community.md) - где получить помощь

### 🛠️ Для разработчиков

- [Модуль разработчиков](../modules/02-developers/README.md) - настройка
  разработки
- [API Reference](../api/README.md) - справочник по API
- [Docker Guide](../deployment/README.md) - работа с Docker

### 🤝 Для контрибьюторов

- [Модуль контрибьюторов](../modules/03-contributors/README.md) - как внести
  вклад
- [Contributing Guide](../contributing/README.md) - руководство контрибьютора

## 🆘 Получение помощи

- **GitHub Issues** - сообщения об ошибках и предложения
- **GitHub Discussions** - общие вопросы и обсуждения
- **Documentation** - подробная документация в модулях

---

**Версия:** 3.1  
**Обновлено:** 2025-01-15
