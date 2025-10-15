# Changelog

Все значимые изменения в этом проекте будут документированы в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), и
этот проект придерживается
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **PostgreSQL DATABASE_URL Issue Resolution**
  - Fixed Prisma schema provider mismatch (changed from sqlite to postgresql)
  - Resolved "Environment variable not found: DATABASE_URL" error
  - Implemented automatic .env file generation in container startup
  - Added automatic DATABASE_URL generation from YAML configuration
  - Updated .gitignore files to exclude .env files from source code

### Added

- **Automatic Configuration Generation**
  - Added automatic .env file generation during container startup
  - Implemented automatic Prisma schema selection (SQLite/PostgreSQL)
  - Added automatic Prisma Client generation with correct provider
  - Created comprehensive deployment guide
    (`docs/deployment/DEPLOYMENT_GUIDE.md`)
  - Enhanced deployment documentation with automatic configuration info

- **PostgreSQL Direct URL Configuration Support**
  - Added `postgresql_params.url` configuration option for direct database URL
  - Updated `PostgresDatabaseService` to prioritize URL from config over network
    parameters
  - Enhanced `start.sh` script to read database provider from YAML configuration
  - Updated `generate-production-config.sh` to include PostgreSQL connection
    string
  - Added comprehensive logging documentation (`backend/docs/LOGGING.md`)
  - Updated database module documentation with new configuration options
  - Updated local settings documentation with production examples

### Changed

- **Enhanced Database Configuration**
  - PostgreSQL service now supports both direct URL and network parameter
    configuration
  - Configuration schema updated to include `postgresql_params.url` field
  - Improved error handling and fallback mechanisms for database connections

### Fixed

- **Production Database Connection Issues**
  - Fixed backend defaulting to SQLite in production environment
  - Resolved environment variable passing issues in SSH deployment sessions
  - Improved configuration loading order and precedence

## [0.0.3] - 2025-10-04

### Added

- **GitHub Actions CI/CD Pipeline**
  ([#9](https://github.com/Black-Cat-OSS/avatar-gen/issues/9))
  - Полный CI/CD pipeline с автоматическим тестированием и развертыванием
  - Матричное тестирование для всех комбинаций БД и хранилищ
  - Поддержка локальных конфигураций `settings.local.yaml` и
    `settings.{NODE_ENV}.local.yaml`
  - Автоматическое развертывание на production сервер через SSH
  - Интеграционные тесты с Docker Compose
  - Подробная документация по DevOps интеграции

- **Поддержка S3 хранилища**
  ([#6](https://github.com/Black-Cat-OSS/avatar-gen/issues/6))
  - Новый `S3Module` для low-level операций с S3
  - Поддержка S3-совместимых облачных хранилищ (AWS S3, MinIO, Beget S3 и др.)
  - Strategy pattern для переключения между local и S3 хранилищем
  - Dynamic modules следуя NestJS best practices
  - Retry логика для S3 подключений с настраиваемыми параметрами
  - Полное покрытие unit тестами (94 теста, 100% pass rate)
  - Подробная документация для storage модулей
  - Docker compose профиль для S3 deployment

### Changed

- **Скрипты управления улучшены**:
  - `start.sh` теперь использует флаги `--db` и `--storage` вместо позиционных
    аргументов
  - Добавлена поддержка выбора типа хранилища через `--storage s3|local`
  - Улучшенная валидация параметров и информативные сообщения об ошибках
- **Документация реорганизована**:
  - Документация скриптов перенесена из `scripts/README.md` в
    `docs/deployment/SCRIPTS.md`
  - Обновлены все ссылки на новое расположение
  - Добавлен краткий README в `scripts/` со ссылкой на полную документацию
- **Docker конфигурация улучшена**:
  - Добавлены DNS серверы (8.8.8.8, 8.8.4.4, 1.1.1.1) для резолвинга S3
    endpoint'ов
  - Конфигурационные файлы теперь монтируются как volumes (read-only) вместо
    копирования в образ
  - Исправлены пути монтирования: `/app/settings.yaml` вместо
    `/app/backend/settings.yaml`
- **Модули хранилища оптимизированы**:
  - `LocalStorageModule` и `S3StorageModule` теперь пропускают инициализацию
    если не используются
  - Graceful degradation: модули не выбрасывают ошибки при неправильной
    конфигурации
  - Реструктуризация конфигурации хранилища для поддержки нескольких типов
- `StorageModule` теперь использует паттерн dynamic modules
- `YamlConfigService` обновлен с методом `getStorageConfig()`
- Обновлены Docker конфигурации с переменными окружения для S3
- Реструктуризированы settings файлы для выбора типа хранилища

### Documentation

- Добавлено `backend/docs/modules/storage/S3_STORAGE.md`
- Добавлено `backend/docs/modules/storage/LOCAL_STORAGE.md`
- Добавлено `backend/docs/modules/storage/STORAGE_MODULE.md`
- Добавлено `backend/docs/STORAGE_CONFIGURATION.md`
- Добавлено `backend/docker/README.md`
- Обновлено `backend/docs/modules/README.md`

### Fixed

- **Поддержка размера 16x16 пикселей**
  ([#3](https://github.com/Black-Cat-OSS/avatar-gen/issues/3))
  - Исправлена валидация size параметра в GetAvatarDto (минимум изменен с 5
    на 4)
  - Исправлена валидация size в AvatarService (изменено условие с `<= 4` на
    `< 4`)
  - Обновлена API документация для поддержки `size=4` (16x16px)
  - Обновлены README файлы с информацией о размере 16x16
  - Исправлены тесты для корректной валидации нового диапазона размеров (4-9)

## [0.0.2] - 2025-10-03

### Added

- **Nginx Gateway (Reverse Proxy)** для интеграции frontend и backend
  - Reverse proxy для маршрутизации запросов
  - Сегментированная сетевая архитектура (external, internal, backend-db)
  - Поддержка SSL/TLS с самоподписанными сертификатами
  - HTTP/2 поддержка на порту 12745
  - Автоматическое перенаправление HTTP → HTTPS
  - DNS resolver для корректной работы с Docker сетями
  - Настроенные healthcheck для мониторинга состояния
- **Конфигурация API URL для frontend**
  - .env файлы для разных окружений (development, production)
  - Автоматическое определение базового URL API
  - Относительные пути в production сборке
  - Gateway URL (http://localhost) в development режиме
- **Автоматическое создание внешней сети** в скриптах запуска
  - Проверка существования сети перед созданием
  - Интеграция в `scripts/start.sh` и `scripts/dev.sh`
- **50 unit и E2E тестов для backend** с высоким покрытием кода
  - HealthController: 100% coverage (7 тестов)
  - AvatarController: 97.61% coverage (17 тестов)
  - AvatarService: 90.9% coverage (22 теста)
  - E2E тесты для health endpoints (4 теста)
  - Jest setup для ES modules (uuid, sharp)
- **Новая структура документации** - 8 тематических разделов:
  - `docs/getting-started/` - Быстрый старт
  - `docs/development/` - Руководство разработчика
  - `docs/deployment/` - Развертывание
  - `docs/api/` - API документация
  - `docs/testing/` - Тестирование
  - `docs/architecture/` - Архитектура
  - `docs/contributing/` - Контрибуция
  - `docs/archive/` - Архив устаревших документов
- **README хабы** для каждой директории документации (8 хабов)
- **Docker retry логика** для установки Alpine пакетов (3 попытки)
- **Альтернативные зеркала Alpine Linux** (Yandex mirror для надежности)
- **Метаданные проекта** в package.json:
  - repository: https://github.com/letnull19A/avatar-gen
  - bugs: URL для issues
  - homepage: URL репозитория
- **Документация по тестированию**:
  - `backend/docs/TESTING.md` - Полное руководство
  - `backend/docs/TEST_RESULTS.md` - Результаты и статистика
- **Документация Docker**:
  - `docker/README.md` - Основная документация
  - `docker/DOCKER_BUILD_FIXES.md` - Решение проблем сборки
- **Документация скриптов**: `docs/deployment/SCRIPTS.md`

### Changed

- **Docker Compose конфигурация**:
  - Добавлен gateway сервис с nginx
  - Сегментированные сети (external, internal, backend-db)
  - Изоляция backend и базы данных в отдельной сети
  - Gateway имеет доступ к внешней и внутренней сетям
- **Frontend конфигурация**:
  - API URL теперь использует gateway (не прямое подключение к backend)
  - Обновлены дефолтные значения API URL
  - Dockerfile копирует .env файлы при сборке
  - Убран хардкод localhost:3000 из кода
- **Nginx конфигурации**:
  - Обновлен синтаксис HTTP/2 (deprecated директива заменена)
  - PID файл перенесен в /tmp для избежания проблем с правами
  - Удалена директива user nginx для корректной работы в Docker
- **Реорганизация Docker структуры**:
  - Перемещены docker-compose файлы из корня → `docker/`
  - Dockerfile остались в `backend/docker/` и `frontend/docker/`
  - Обновлены все относительные пути в compose файлах
- **Обновлены все скрипты управления** для новой Docker структуры:
  - `scripts/build.sh` - поддержка профилей (sqlite/postgresql)
  - `scripts/build-fast.sh` - быстрая сборка с кэшем
  - `scripts/start.sh` - опции запуска и профили
  - `scripts/dev.sh` - dev режим с профилями
  - `scripts/stop.sh` - опции удаления volumes
- **Лицензия изменена** с Apache License 2.0 → MIT License
- **Автор обновлен** на letnull19a
- **Обновлена вся документация** с правильными путями:
  - `storage/database/database.sqlite` вместо `prisma/storage/database.sqlite`
  - Обновлены все ссылки на перемещенные документы
- **Jest конфигурация** для поддержки ES modules:
  - Обновлен формат ts-jest конфигурации (убрано deprecated globals)
  - Добавлен setupFilesAfterEnv для моков
  - Настроено исключение из coverage (interfaces, enums, dto)
- **Docker Dockerfiles оптимизированы**:
  - Убран dumb-init из frontend (не нужен для Nginx)
  - Добавлен tsconfig.node.json в frontend build
  - Заменен wget → curl для healthcheck
  - Добавлена retry логика для apk add

### Fixed

- **Nginx права доступа**:
  - Исправлена ошибка "Permission denied" для /var/run/nginx.pid
  - Создаются все необходимые кеш-директории с правильными правами
  - Добавлен entrypoint.sh для динамического создания директорий
- **Nginx конфигурация**:
  - Исправлены предупреждения о deprecated директиве "listen ... http2"
  - Исправлено предупреждение о директиве "user" без root прав
  - Добавлен DNS resolver для корректной работы с Docker сетями
- **Docker Compose**:
  - Удалены дублирующие директивы name из сервисов
  - Исправлены имена upstream серверов в nginx (используются имена сервисов)
- **Проблема с lint-staged**: добавлены eslint и prettier в корневой
  package.json
- **Дублирующиеся директории**:
  - Удалена `backend/backend/storage/` (создавалась при неправильном cwd)
  - Удалена `backend/prisma/storage/` (больше не используется)
- **Модуль инициализации** больше не создает `prisma/storage/` директорию
- **Устаревшие пути к БД** во всей документации исправлены
- **Проблемы сборки Docker образов**:
  - Решена проблема с dumb-init package
  - Решены временные ошибки Alpine репозиториев
  - Исправлена сборка frontend (отсутствовал tsconfig.node.json)
- **ES modules проблемы в тестах** (uuid, sharp) через jest-setup.ts
- **Пути в docker-compose** обновлены относительно новой структуры

### Removed

- **Удалены дублирующиеся docker-compose файлы** из корня проекта (перемещены в
  docker/)
- **Удалено дублирование Docker документации** (использование ссылок вместо
  копирования)
- **Архивированы устаревшие документы**:
  - `backend_task.md` → `docs/archive/` (первоначальное ТЗ, выполнено)
  - `MIGRATION_DOCKER_STRUCTURE.md` → `docs/archive/` (миграция завершена)
  - `REORGANIZATION_PLAN.md` → `docs/archive/`
  - `REORGANIZATION_SUMMARY.md` → `docs/archive/`
- **Удалено создание директории** `prisma/storage/` из модуля инициализации

### Documentation

- **Полная реорганизация** документации по тематическим разделам
- **Единая точка входа** - `docs/README.md` (единственный файл в корне docs/)
- **8 README хабов** для навигации по разделам
- **Обновлены все внутренние ссылки** после перемещения файлов
- **Централизованная навигация** с раскрывающимися секциями

## [0.0.1] - 2025-10-01

### Added

- Поддержка PostgreSQL в дополнение к SQLite
- Система повторных попыток подключения к базе данных (3 попытки с настраиваемой
  задержкой)
- Конфигурация базы данных только через YAML файл (settings.yaml)
- Автоматическая генерация .env файла из settings.yaml
- Полное исключение необходимости ручной настройки переменных окружения
- Docker Compose конфигурация с PostgreSQL
- Расширенная конфигурация базы данных с поддержкой обеих БД
- Документация по настройке баз данных (docs/database-setup.md)
- Поддержка Cursor IDE в конфигурации проекта
- Интеграция commitlint с husky для автоматической проверки сообщений коммитов
- Правила участия в проекте (CONTRIBUTING.md)
- Документация по сообщениям коммитов (docs/COMMIT_MESSAGES.md)
- Лицензия Apache License 2.0
- **Система конфигурации с поддержкой окружений**
  - Базовая конфигурация через `settings.yaml`
  - Окружение-специфичные настройки через `settings.{NODE_ENV}.yaml`
  - Автоматическое объединение конфигураций с переопределением настроек
  - Поддержка `development`, `production` и `test` окружений
  - Глубокое слияние объектов конфигурации

### Changed

- Обновлена Prisma схема для поддержки динамического выбора провайдера БД
- Улучшен DatabaseService с системой повторных попыток подключения
- Обновлена конфигурация ESLint и Prettier
- Улучшена структура проекта с использованием Feature-Sliced Design
- **Переработана система конфигурации приложения**
  - YamlConfigService теперь поддерживает окружение-специфичные настройки
  - Добавлено глубокое слияние конфигураций
  - Улучшена обработка ошибок при загрузке конфигурации
  - Обновлена документация по настройке конфигурации
  - Исправлена типизация в DirectoryInitializerService
- **Рефакторинг зависимостей модулей**
  - Убраны дублирующиеся инструменты разработки верхнего уровня (husky,
    commitlint) из модулей
  - Оставлены специфичные настройки eslint и prettier в каждом модуле
  - Объединены конфигурации инструментов разработки в корневой проект
  - Добавлены корневые скрипты для форматирования кода

### Fixed

- Исправлены конфликты слияния и ошибки линтинга
- **Исправлены дублирующиеся зависимости инструментов разработки**
  - Удалены дублирующиеся инструменты разработки верхнего уровня из модулей
  - Убраны дублирующиеся скрипты разработки из модулей
  - Настроена правильная интеграция инструментов разработки через корневой
    проект

### Added

- **Исправлено зависание backend при запуске**
  - Исправлено использование `console.debug` в SQLite сервисе базы данных
    (заменено на `this.logger.debug`)
  - Обновлена Prisma схема для использования прямого URL вместо переменной
    окружения `env("DATABASE_URL")`
  - Перегенерирован Prisma клиент с новой конфигурацией
  - Диагностировано и устранено зависание при создании NestJS приложения
  - Восстановлена полная функциональность приложения
  - Добавлена диагностика модулей для выявления проблем инициализации
  - Исправлены пути к конфигурационным файлам базы данных (относительные пути в
    settings.yaml)

- **Детальное логирование для диагностики проблем**
  - Перенесена настройка логирования из переменных окружения в YAML конфигурацию
  - Добавлены настройки логирования в `settings.yaml`:
    - `level`: уровень логирования (trace, debug, info, warn, error, fatal)
    - `verbose`: флаг включения детального логирования
    - `pretty`: флаг красивого вывода в консоль
  - Расширенное логирование в конфигурационном сервисе с выводом содержимого
    файлов
  - Детальное логирование процесса инициализации директорий
  - Подробное логирование этапов загрузки приложения
  - Автоматическое включение verbose режима в окружении разработки
    (`settings.development.yaml`)

- **Логирование статуса инициализации модулей**
  - Добавлен OnModuleInit интерфейс во все модули приложения
  - Каждый модуль выводит информативное сообщение при инициализации:
    - 🔧 ConfigModule: "Configuration service ready"
    - 🗄️ DatabaseModule: "Database service ready"
    - 🚀 InitializationModule: "Application initialization services ready"
    - 📝 LoggerModule: "Logging service ready"
    - 🎯 AppModule: "All application modules loaded successfully"
    - 🎨 AvatarModule: "Avatar generation services ready"
    - ⚡ GeneratorModule: "Avatar generation engine ready"
    - 💾 StorageModule: "File storage services ready"

- **Улучшенная обработка ошибок инициализации**
  - Добавлены try-catch блоки во все методы onModuleInit модулей
  - Детальное логирование ошибок инициализации с трассировкой стека
  - Специальная обработка ошибок в LoggerModule (использует console.error)
  - Улучшена обработка ошибок в DatabaseService с индикацией успешного
    подключения
  - Теперь при ошибке инициализации модуля сразу видно:
    - ❌ Какой модуль не смог инициализироваться
    - ❌ Детальное сообщение об ошибке
    - ❌ Трассировку стека для отладки

## [0.0.1] - 2025-09-26

### Added

- Базовая структура React SDK проекта с архитектурой Feature-Sliced Design
- Интеграция с Vite для быстрой сборки и разработки
- Поддержка TypeScript с строгой типизацией
- Настройка Tailwind CSS v4 для стилизации
- Интеграция Storybook для разработки и тестирования компонентов
- Система интернационализации (i18n) с поддержкой русского, английского и
  испанского языков
- Темная/светлая тема с автоматическим переключателем
- Мобильное меню с контекстом для адаптивной навигации
- Интеграция с React Query для управления серверным состоянием
- React Router для клиентской маршрутизации
- React Hook Form с Zod для валидации форм
- Поддержка SCSS модулей для стилизации компонентов
- Настройка ESLint с правилами для React и TypeScript
- Prettier для автоматического форматирования кода
- Husky для pre-commit хуков
- Commitlint для стандартизации сообщений коммитов
- Поддержка Cursor IDE в конфигурации проекта

### Pages

- HomePage - главная страница приложения
- AboutPage - страница о проекте
- LoginPage - страница авторизации
- DevStackPage - страница технологического стека

### Features

- CounterIncrement - компонент счетчика
- LanguageButton - кнопка переключения языка
- LanguageSwitcher - переключатель языка
- LoginForm - форма авторизации
- ThemeToggle - переключатель темы

### Widgets

- Header (Default, Minimalism, Search) - различные варианты шапки
- Footer - подвал сайта
- MobileMenu - мобильное меню

### UI Components

- Button - кнопка с различными вариантами стилей
- InputField - поле ввода с валидацией
- Callout - компонент для уведомлений
- NavigationLink - ссылка навигации
- OverlayBlur - размытый оверлей для модальных окон
- BurgerIcon - иконка гамбургер-меню
- FlagIcon - иконка флага страны
- LanguagePopup - всплывающее окно выбора языка

### Technical Stack

- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.7
- Tailwind CSS 4.1.13
- Storybook 9.1.8
- i18next 25.5.2
- React Query 5.90.2
- React Router 1.132.0
- React Hook Form 7.63.0
- Zod 4.1.11
- Sass 1.93.1

---

## Типы изменений

- **Added** - для новых функций
- **Changed** - для изменений в существующей функциональности
- **Deprecated** - для функций, которые скоро будут удалены
- **Removed** - для удаленных функций
- **Fixed** - для исправления ошибок
- **Security** - для исправлений уязвимостей
