# 🚀 GitBash Quick Start для защиты веток

**Дата создания:** 2025-10-04  
**Версия:** 1.0

## 🎯 Быстрая настройка защиты веток

### Шаг 1: Установка GitHub CLI в GitBash

```bash
# Проверить версию (если установлен)
gh --version

# Если не установлен - установить через winget
winget install GitHub.cli

# Или скачать с https://cli.github.com/
# И добавить в PATH
```

### Шаг 2: Авторизация

```bash
# Авторизоваться в GitHub
gh auth login

# Выбрать:
# - GitHub.com
# - HTTPS
# - Login with a web browser
# - Paste the code в браузере
```

### Шаг 3: Настройка защиты веток

```bash
# Перейти в корень проекта
cd /path/to/avatar-gen

# Запустить автоматическую настройку
./scripts/setup-branch-protection.sh
```

## ✅ Проверка результата

### В GitHub UI

1. **Перейти в Settings → Branches**
2. **Проверить наличие правил:**
   - ✅ `main` - полные тесты
   - ✅ `develop` - быстрые тесты

### Тестирование

```bash
# Создать тестовую ветку
git checkout -b test/branch-protection

# Сделать изменения
echo "# Test" >> README.md
git add README.md
git commit -m "test: test branch protection"

# Push и создать PR
git push origin test/branch-protection
```

## 🔧 Troubleshooting

### Проблема: `gh: command not found`

```bash
# Решение 1: Переустановить через winget
winget uninstall GitHub.cli
winget install GitHub.cli

# Решение 2: Добавить в PATH
# Добавить в ~/.bashrc:
export PATH="/c/Program\ Files/GitHub\ CLI:$PATH"

# Перезапустить GitBash
```

### Проблема: `gh auth status` не работает

```bash
# Переавторизоваться
gh auth logout
gh auth login
```

### Проблема: Нет прав администратора

```bash
# Проверить права
gh api repos/:owner/:repo

# Если 403 - обратиться к владельцу репозитория
# Для добавления в команду с правами admin
```

## 📚 Дополнительные команды

### Проверка статуса

```bash
# Статус авторизации
gh auth status

# Информация о репозитории
gh repo view

# Список защищенных веток
gh api repos/:owner/:repo/branches --jq '.[] | select(.protected) | .name'
```

### Управление защитой

```bash
# Посмотреть правила защиты для ветки
gh api repos/:owner/:repo/branches/main/protection

# Временно отключить защиту (только для экстренных случаев!)
gh api repos/:owner/:repo/branches/main/protection --method DELETE
```

## 🎉 Готово!

После выполнения всех шагов:

- ✅ **main ветка защищена** - требует полные тесты + code review
- ✅ **develop ветка защищена** - требует быстрые тесты + code review
- ✅ **Force push заблокирован**
- ✅ **Direct push заблокирован**
- ✅ **CODEOWNERS настроен** для автоматического назначения reviewers

---

**Поддержка:** DevOps Team  
**Последнее обновление:** 2025-10-04
