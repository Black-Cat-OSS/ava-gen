# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Avatar Generator is a monorepo avatar generation application built with NestJS
(backend) and React (frontend). It generates unique avatars with multiple
algorithms (gradient, wave, pixelize, lowpoly, emoji), supports custom color
palettes, and provides flexible storage (S3/local) and caching
(Redis/Memcached/memory) options.

**Key Stack:**

- Backend: NestJS 11 + TypeScript 5.9 + TypeORM
- Frontend: React 19 + Vite 7 + TanStack Router/Query
- Database: PostgreSQL (prod) / SQLite (dev)
- Cache: Redis / Memcached / In-memory
- Storage: S3-compatible / Local filesystem
- Monorepo: pnpm workspaces

## Essential Commands

### Development Workflow

```bash
# Start full stack (backend + frontend)
npm run dev

# Install dependencies (use pnpm, not npm/yarn)
pnpm install

# Backend only (from app/backend)
npm run start:dev          # Watch mode
npm run start:debug        # Debug mode (port 9229)
npm run start:verbose      # Verbose logging

# Frontend only (from app/frontend)
npm run dev                # Vite dev server (port 12965)
```

### Testing

```bash
# Backend tests (Vitest, NOT Jest)
cd app/backend
npm run test               # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:e2e           # End-to-end tests
npm run test:cov           # With coverage
npm run test:ui            # Vitest UI
npm run test:watch         # Watch mode

# Frontend tests
cd app/frontend
npm run test               # No tests currently configured
```

### Building

```bash
# Build both apps (frontend copies to backend/static)
npm run build

# Build individually
cd app/backend && npm run build
cd app/frontend && npm run build
```

### Linting & Formatting

```bash
# Root level
npm run lint               # Lint all workspaces
npm run lint:fix           # Fix issues
npm run format             # Prettier format
npm run format:check       # Check only

# Backend/Frontend individually
cd app/backend && npm run lint
cd app/frontend && npm run lint:fix
```

### Database Migrations

```bash
cd app/backend
npm run typeorm:generate   # Generate migration
npm run typeorm:run        # Run migrations
npm run typeorm:revert     # Revert migration
npm run migration          # Custom migration runner
```

### Git & Commits

```bash
npm run commit             # Commitizen interactive commit
npm run commit:wip         # WIP commit (bypasses commitlint)
npm run commitlint         # Check commit message

# Conventional commits enforced:
# Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert, deprecate
# Scopes: ui, auth, api, db, config, components, features, etc.
```

### Docker

```bash
# Development
docker compose -f docker/docker-compose.dev.yml --profile i-am-fullstack up -d

# Production (SQLite)
docker compose -f docker/docker-compose.yml up -d

# Production (PostgreSQL)
docker compose -f docker/docker-compose.yml --profile postgresql up -d

# Convenience script
./scripts/start.sh --db sqlite --storage local
./scripts/start.sh --db postgresql --storage s3
```

## Backend Architecture

### Module Structure (STRICT - see .cursor/rules/nest-modular.mdc)

**Every module MUST follow this structure:**

```
module-name/
├── __tests__/                    # Unit tests (*.spec.ts)
├── dto/                          # Data Transfer Objects + index.ts
├── schemes/                      # Validation schemas (Zod)
├── modules/                      # Submodules (1 level deep only)
│   └── submodule-name/
│       ├── __tests__/
│       ├── interfaces/
│       ├── utils/
│       ├── exceptions/
│       ├── submodule-name.service.ts
│       ├── submodule-name.module.ts
│       └── index.ts
├── exceptions/                   # Custom exceptions
├── middlewares/                  # Module-specific middleware
├── constants/                    # Constants
├── interfaces/                   # TypeScript interfaces
├── pipelines/                    # Validation pipes
├── utils/                        # Utility functions
├── events/                       # Event handlers
├── workers/                      # Background workers
├── module-name.service.ts        # Business logic
├── module-name.module.ts         # Module definition
├── module-name.controller.ts     # HTTP handlers (optional)
├── module-name.entity.ts         # Database entity (optional)
└── index.ts                      # Public API exports
```

**Module vs Submodule:**

- **Module**: Complex logical unit, interacts with entities, has controllers,
  full validation
- **Submodule**: Strategy/factory implementation, alternative entity
  interaction, logic separation

**Current Modules:**

- `avatar` - Avatar generation (submodules: emoji-driver, generator,
  gradient-driver, pixelize-driver, wave-driver)
- `cache` - Caching abstraction (Redis/Memcached/Memory)
- `database` - Database connection (TypeORM)
- `emoji` - Emoji processing
- `health` - Health checks
- `initialization` - App startup
- `logger` - Pino logging
- `palettes` - Color palette management
- `prometheus` - Metrics collection
- `s3` - S3 storage
- `storage` - Storage abstraction (S3/Local)
- `swagger-docs` - API documentation

### Configuration (settings.yaml)

Backend uses YAML-based configuration with hierarchy:

1. `app/backend/settings.yaml` (default)
2. Environment variables override
3. `.env` files (via yaml-dotenv)

**Key configuration areas:**

- Server settings (port, host)
- Database (PostgreSQL/SQLite)
- Storage (S3/local)
- Cache (Redis/Memcached/memory/disabled)
- Logging levels
- Prometheus metrics

### Key Backend Patterns

1. **Dependency Injection**: Use NestJS DI container extensively
2. **Validation**: class-validator for DTOs, Zod for schemas
3. **Logging**: Pino (structured, high-performance) - NOT console.log
4. **Metrics**: Prometheus interceptor tracks all HTTP requests
5. **Error Handling**: Custom exceptions in each module
6. **Testing**: Vitest (NOT Jest)

### Avatar Generation Flow

```
Controller (avatar.controller.ts)
    ↓ (CreateAvatarDto validation)
AvatarService
    ↓
GeneratorModule (strategy selection)
    ↓
├── GradientDriver
├── WaveDriver
├── PixelizeDriver
├── EmojiDriver
└── Lowpoly (Delaunator triangulation)
    ↓
StorageService (S3/Local)
    ↓
CacheService (optional caching)
```

## Frontend Architecture

### Feature-Sliced Design (FSD) - STRICTLY ENFORCED

**Dependency hierarchy (unidirectional):**

```
App → Pages → Widgets → Features → Entities → Shared
```

**Directory structure:**

```
src/
├── app/                          # Application layer
│   ├── providers/                # QueryClientProvider, ThemeProvider, etc.
│   ├── router/                   # TanStack Router config
│   └── index.tsx                 # App root
├── pages/                        # Route pages
│   ├── home/
│   ├── avatar-generator/
│   ├── avatar-viewer/
│   ├── palettes/
│   └── palettes-add/
├── widgets/                      # Complex UI blocks
├── features/                     # Business features
│   ├── avatar-generator/
│   ├── avatar-gallery/
│   ├── color-palette/
│   ├── ThemeToggle/
│   ├── LanguageSwitcher/
│   └── [20+ features]
├── entities/                     # Business entities
├── shared/                       # Shared utilities
│   ├── ui/                       # Reusable UI components
│   ├── lib/                      # Utils and hooks
│   ├── api/                      # API client
│   ├── config/                   # Configuration
│   ├── locales/                  # i18n translations
│   └── types/                    # TypeScript types
└── assets/                       # Static assets
```

**IMPORTANT FSD Rules:**

- Lower layers cannot import from upper layers
- Each layer is isolated and reusable
- Features are self-contained
- Shared layer has NO dependencies on other layers

### Component & Hook Documentation (.cursor/rules/)

**Components in features/, widgets/, shared/ui/ MUST have:**

1. **JSDoc documentation** - purpose, props, examples
2. **Storybook stories** - at least default story

**React hooks MUST have:**

1. **JSDoc documentation** - purpose, parameters, return value, examples

### State Management Strategy

- **Server State**: TanStack Query (avatars, palettes, API data)
- **UI State**: React Context (theme, mobile menu, popups)
- **Form State**: React Hook Form
- **Router State**: TanStack Router (params, search)

**DO NOT use Redux** - TanStack Query handles server state, Context handles UI
state.

### Provider Hierarchy

```tsx
<QueryClientProvider>
  {' '}
  // React Query for server state
  <ThemeProvider>
    {' '}
    // Dark/light mode
    <PopupProvider>
      {' '}
      // Popup management
      <MobileMenuProvider>
        {' '}
        // Mobile navigation
        <App />
      </MobileMenuProvider>
    </PopupProvider>
  </ThemeProvider>
</QueryClientProvider>
```

### Styling

- **Tailwind CSS 4.1** - Primary styling method
- **SCSS modules** - Component-specific styles when needed
- **Radix UI** - Accessible primitives (Separator, Slider, Tabs)
- **class-variance-authority** - Variant-based components

### Internationalization

**i18next is REQUIRED:**

- All user-facing text must be translatable
- Translation files in `shared/locales/`
- Use `useTranslation()` hook
- Language detection via i18next-browser-languagedetector

## Development Workflow Rules

### Branch Naming (.cursor/rules/branches.mdc)

```
feature/{issue-number}     # New features
fix/{issue-number}         # Bug fixes
```

### Commit Process (.cursor/rules/steps-of-resolve.mdc)

1. **Decompose task** into small steps
2. **Create WIP commit** after each step: `npm run commit:wip`
3. **Final commit** with proper message: `npm run commit`

### Commit Message Format (commitlint)

**Conventional commits enforced:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore, perf, ci, build,
revert, deprecate

**Scopes:** ui, auth, api, db, config, components, features, etc.

**WIP commits:** Prefixed with "wip:" - bypasses commitlint

### Bug Fix Process (.cursor/rules/bug-fix.mdc)

1. **Reproduce** the bug
2. **Locate** the root cause
3. **Fix** the issue
4. **Test** the fix
5. **Document** what was changed
6. **Commit** with fix type

## Key Technical Details

### Backend Libraries

- **Sharp** - Image processing (resize, filters)
- **Delaunator** - Triangulation for lowpoly
- **TypeORM** - ORM for PostgreSQL/SQLite
- **Pino** - Structured logging
- **Zod** - Schema validation
- **ioredis** - Redis client
- **@aws-sdk/client-s3** - S3 storage

### Frontend Libraries

- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **emoji-picker-react** - Emoji selection
- **qrcode** - QR code generation

### API Structure

**Base URL:** `/api`

**Main endpoints:**

- `POST /api/avatar/generate` - Generate avatar
- `GET /api/avatar/list` - List avatars
- `GET /api/avatar/:id` - Get avatar by ID
- `DELETE /api/avatar/:id` - Delete avatar
- `GET /api/palettes` - List color palettes
- `POST /api/palettes` - Create palette
- `GET /api/health` - Health check
- `GET /api/prometheus/metrics` - Prometheus metrics
- `GET /swagger` - Swagger documentation

### Testing Infrastructure

**Backend (Vitest):**

- Unit tests: `*.spec.ts`
- Integration tests: separate config
- E2E tests: separate config
- Coverage: @vitest/coverage-v8

**Frontend:**

- No tests currently configured
- Storybook for component testing

## Important Notes

1. **NEVER edit Dockerfiles** (.cursor/rules/no-edit-dockerfile.mdc) - use
   configuration instead
2. **Follow Prettier/ESLint configs** - auto-formatting enabled
3. **Use pnpm** - NOT npm or yarn (monorepo workspaces)
4. **Husky pre-commit hooks** - lint-staged runs automatically
5. **Changelog auto-generated** - from conventional commits
6. **Swagger docs** - auto-generated from NestJS decorators
7. **TypeScript strict mode** - enabled in both apps
8. **Mobile-responsive** - required for all UI components
9. **Theme support** - dark/light mode built-in
10. **Security** - Avoid SQL injection, XSS, command injection

## Deployment

**Docker multi-container architecture:**

- Gateway (Nginx) - SSL/TLS termination, ports 80/12745
- Frontend (Nginx) - Serves React SPA, port 8080
- Backend (NestJS) - API server, port 3000
- Database (PostgreSQL/SQLite) - port 5432
- Cache (Redis/Memcached) - optional

**Environment profiles:**

- Development: docker-compose.dev.yml
- Production: docker-compose.yml (SQLite or PostgreSQL profile)

**Volumes:**

- Storage (avatars)
- Logs
- Database data

**Networks:**

- internal (Gateway ↔ Frontend/Backend)
- backend-db (Backend ↔ Database)
- backend-cache (Backend ↔ Cache)

## Access Points (Development)

- **HTTPS:** https://localhost:12745
- **HTTP:** http://localhost:80
- **API:** https://localhost:12745/api
- **Swagger:** https://localhost:12745/swagger
- **Frontend Dev:** http://localhost:12965 (Vite)
- **Backend Dev:** http://localhost:3000 (NestJS)
- **Storybook:** http://localhost:6006

## Version & License

- **Version:** 3.1
- **License:** MIT
- **Language:** Primarily Russian (UI, docs, comments)
