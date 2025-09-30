#!/bin/bash

# Скрипт для настройки среды разработки
echo "🚀 Настройка среды разработки для Avatar Generator..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Пожалуйста, установите Node.js 18+ версии"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js версии 18 или выше. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) найден"

# Устанавливаем зависимости в корне
echo "📦 Установка зависимостей в корне проекта..."
npm install

# Устанавливаем зависимости для бэкенда
echo "📦 Установка зависимостей для бэкенда..."
cd backend && npm install && cd ..

# Устанавливаем зависимости для фронтенда (если существует)
if [ -d "frontend" ]; then
    echo "📦 Установка зависимостей для фронтенда..."
    cd frontend && npm install && cd ..
fi

# Инициализируем Husky
echo "🐕 Инициализация Husky..."
npm run prepare

# Проверяем, что Git репозиторий инициализирован
if [ ! -d ".git" ]; then
    echo "⚠️  Git репозиторий не инициализирован. Инициализируем..."
    git init
fi

# Настраиваем Git hooks
echo "🔧 Настройка Git hooks..."
chmod +x .husky/*

# Проверяем настройки Git
echo "🔍 Проверка настроек Git..."
if [ -z "$(git config user.name)" ]; then
    echo "⚠️  Имя пользователя Git не настроено"
    echo "Выполните: git config --global user.name 'Ваше Имя'"
fi

if [ -z "$(git config user.email)" ]; then
    echo "⚠️  Email пользователя Git не настроен"
    echo "Выполните: git config --global user.email 'your.email@example.com'"
fi

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте Git пользователя:"
echo "   git config --global user.name 'Ваше Имя'"
echo "   git config --global user.email 'your.email@example.com'"
echo ""
echo "2. Сделайте первый коммит:"
echo "   npm run commit"
echo ""
echo "3. Запустите проект:"
echo "   npm run dev"
echo ""
echo "📚 Дополнительная информация:"
echo "- Документация по хукам: .husky/README.md"
echo "- Конфигурация commitlint: commitlint.config.js"
echo "- Конфигурация prettier: .prettierrc"
