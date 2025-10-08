# Скрипт для WIP коммитов - пропускает линтеры и тесты

Write-Host "🚀 Создание WIP коммита..." -ForegroundColor Green

# Устанавливаем переменную окружения для WIP коммита
$env:WIP_COMMIT = "true"

# Выполняем коммит с переданными аргументами
git commit $args

Write-Host "✅ WIP коммит создан!" -ForegroundColor Green
