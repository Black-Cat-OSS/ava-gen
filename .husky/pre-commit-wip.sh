#!/bin/bash
echo "⏭️  WIP коммит - только форматирование (без линтеров и тестов)..."
echo "🎨 Форматирование файлов..."
npx prettier --write "**/*.{ts,js,tsx,jsx,json,md,yml,yaml}" --ignore-path .gitignore
echo "✅ WIP коммит готов!"
