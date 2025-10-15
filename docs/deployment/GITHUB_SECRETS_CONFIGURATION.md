# Настройка GitHub Secrets для тестирования

**Дата создания:** 2025-10-04  
**Версия:** 1.0

## 📋 Обзор

Данный документ описывает настройку GitHub Secrets для использования реальных S3
credentials в тестах CI/CD pipeline.

## 🔐 GitHub Secrets для тестирования

### Основные секреты

| Secret Name          | Описание                      | Пример                                     |
| -------------------- | ----------------------------- | ------------------------------------------ |
| `TEST_S3_ENDPOINT`   | Endpoint тестового S3 сервера | `https://s3.amazonaws.com`                 |
| `TEST_S3_BUCKET`     | Название тестового бакета     | `avatar-gen-test`                          |
| `TEST_S3_ACCESS_KEY` | Access Key для S3             | `AKIAIOSFODNN7EXAMPLE`                     |
| `TEST_S3_SECRET_KEY` | Secret Key для S3             | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `TEST_S3_REGION`     | Регион S3                     | `us-east-1`                                |

### Секреты для production

| Secret Name       | Описание                     |
| ----------------- | ---------------------------- |
| `SSH_HOST`        | IP адрес production сервера  |
| `SSH_PORT`        | SSH порт (обычно 22)         |
| `SSH_PRIVATE_KEY` | Приватный SSH ключ           |
| `SSH_USERNAME`    | Имя пользователя SSH         |
| `APP_PATH`        | Путь к приложению на сервере |

## 🛠️ Настройка секретов в GitHub

### 1. Перейдите в настройки репозитория

1. Откройте ваш репозиторий на GitHub
2. Перейдите в `Settings` → `Secrets and variables` → `Actions`
3. Нажмите `New repository secret`

### 2. Добавьте каждый секрет

Для каждого секрета:

1. **Name**: Введите имя секрета (например, `TEST_S3_ENDPOINT`)
2. **Secret**: Введите значение секрета
3. Нажмите `Add secret`

### 3. Проверьте список секретов

Убедитесь, что все секреты добавлены:

```
✅ TEST_S3_ENDPOINT
✅ TEST_S3_BUCKET
✅ TEST_S3_ACCESS_KEY
✅ TEST_S3_SECRET_KEY
✅ TEST_S3_REGION
✅ SSH_HOST
✅ SSH_PORT
✅ SSH_PRIVATE_KEY
✅ SSH_USERNAME
✅ APP_PATH
```

## 🔧 Варианты настройки тестов

### Вариант 1: Использование GitHub Secrets

Workflows автоматически используют секреты, если они настроены:

```yaml
# В .github/workflows/ci.yml
s3:
  endpoint: '${{ secrets.TEST_S3_ENDPOINT || 'https://test-s3-endpoint.com' }}'
  bucket: '${{ secrets.TEST_S3_BUCKET || 'avatar-gen-test' }}'
  access_key: '${{ secrets.TEST_S3_ACCESS_KEY || 'test-access-key' }}'
  secret_key: '${{ secrets.TEST_S3_SECRET_KEY || 'test-secret-key' }}'
```

### Вариант 2: Локальный файл настроек

Создайте файл `backend/settings.test.yaml` в репозитории:

```yaml
app:
  storage:
    type: 's3'
    s3:
      endpoint: 'https://your-test-s3-endpoint.com'
      bucket: 'your-test-bucket'
      access_key: 'your-test-access-key'
      secret_key: 'your-test-secret-key'
      region: 'us-east-1'
      force_path_style: true
```

Затем используйте workflow `test-with-local-config.yml` с параметром
`use_local_config: true`.

### Вариант 3: Динамическая генерация

Используйте скрипт `scripts/generate-test-config.sh`:

```bash
# Генерация конфигурации
./scripts/generate-test-config.sh sqlite s3 https://your-s3.com your-bucket

# Запуск тестов
NODE_ENV=test TEST_MATRIX_CONFIG=./backend/settings.test.matrix.yaml pnpm run test
```

## 🧪 Тестирование настроек

### Проверка локально

1. **Сгенерируйте конфигурацию:**

   ```bash
   cd backend
   ./scripts/generate-test-config.sh sqlite s3
   ```

2. **Установите переменные окружения:**

   ```bash
   export TEST_S3_ACCESS_KEY=your-key
   export TEST_S3_SECRET_KEY=your-secret
   export TEST_S3_REGION=your-region
   ```

3. **Запустите тесты:**
   ```bash
   NODE_ENV=test TEST_MATRIX_CONFIG=./settings.test.matrix.yaml pnpm run test
   ```

### Проверка в CI/CD

1. **Автоматический запуск (быстрые тесты):**
   - Создайте Pull Request
   - Тесты запустятся автоматически с SQLite + Local/S3
   - Используются GitHub Secrets для S3 (если настроены)

2. **Ручной запуск с полным матричным тестированием:**
   - Перейдите в `Actions` → `CI`
   - Нажмите `Run workflow`
   - Установите `run_full_matrix: true` для тестов с PostgreSQL
   - Установите `use_custom_s3: true` для использования ваших S3 credentials

3. **Production Deploy:**
   - Push в `main` ветку автоматически запустит деплой
   - Сначала запустятся быстрые тесты, затем деплой

## 🔒 Безопасность

### ⚠️ Важные правила

1. **Никогда не коммитьте реальные credentials в код**
2. **Используйте только тестовые бакеты для тестов**
3. **Ограничьте права доступа тестовых ключей**
4. **Регулярно ротируйте ключи доступа**

### 🛡️ Рекомендации по безопасности

1. **Создайте отдельного IAM пользователя для тестов:**

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::avatar-gen-test",
           "arn:aws:s3:::avatar-gen-test/*"
         ]
       }
     ]
   }
   ```

2. **Настройте lifecycle политику для тестового бакета:**

   ```json
   {
     "Rules": [
       {
         "Id": "DeleteOldTestData",
         "Status": "Enabled",
         "ExpirationInDays": 1
       }
     ]
   }
   ```

3. **Мониторинг использования:**
   - Настройте CloudWatch алерты
   - Отслеживайте размер бакета
   - Проверяйте логи доступа

## 📊 Мониторинг

### Проверка статуса тестов

1. **GitHub Actions:**
   - Перейдите в `Actions` вкладку
   - Проверьте статус последних запусков
   - Изучите логи при ошибках

2. **S3 мониторинг:**

   ```bash
   # Проверка размера бакета
   aws s3 ls s3://avatar-gen-test --recursive --summarize

   # Проверка последних операций
   aws s3api list-objects-v2 --bucket avatar-gen-test --max-items 10
   ```

## 🐛 Устранение неполадок

### Частые проблемы

1. **"Access Denied" ошибки:**
   - Проверьте правильность access/secret keys
   - Убедитесь, что ключи имеют права на тестовый бакет
   - Проверьте регион S3

2. **"Bucket not found" ошибки:**
   - Убедитесь, что бакет существует
   - Проверьте правильность названия бакета
   - Убедитесь, что бакет в правильном регионе

3. **"Connection timeout" ошибки:**
   - Проверьте доступность endpoint'а
   - Убедитесь в правильности URL
   - Проверьте сетевые настройки

### Логи для отладки

Включите verbose логирование в тестах:

```yaml
# В settings.test.yaml
logging:
  level: 'debug'
  verbose: true
  pretty: true
```

## 📚 Полезные ссылки

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [AWS S3 IAM Policies](https://docs.aws.amazon.com/s3/latest/userguide/using-iam-policies.html)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**Поддержка:** DevOps Team  
**Последнее обновление:** 2025-10-04
