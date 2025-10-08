#!/bin/bash
echo "✅ Обычный коммит - запуск полной проверки..."
echo "🔍 Запуск lint-staged (линтеры + форматирование)..."
npx lint-staged

echo "🧪 Запуск тестов..."
npm run test --if-present
echo "✅ Полная проверка завершена!"
