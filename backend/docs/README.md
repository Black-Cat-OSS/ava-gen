# Avatar Generation Backend

Backend service for generating and managing avatars similar to GitHub/GitLab.

## Features

- 🎨 Generate avatars with custom colors and patterns
- 🎯 Multiple size options (16x16 to 512x512 pixels)
- 🎭 Apply filters (grayscale, sepia, negative)
- 💾 Persistent storage with SQLite or PostgreSQL database
- 📁 File-based avatar object storage
- 🔧 YAML configuration
- 📚 OpenAPI/Swagger documentation
- 🐳 Docker support
- 🧪 Comprehensive test coverage

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: SQLite or PostgreSQL with Prisma ORM
- **Image Processing**: Sharp
- **Validation**: Zod + class-validator
- **Logging**: Pino
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure database in `settings.yaml`:
```yaml
database:
  driver: "sqlite"  # or "postgresql"
  connection:
    maxRetries: 3
    retryDelay: 2000
  sqlite_params:
    url: "file:./prisma/storage/database.sqlite"
  # postgresql_params:
  #   host: "localhost"
  #   port: 5432
  #   database: "avatar_gen"
  #   username: "postgres"
  #   password: "password"
  #   ssl: false
```

3. Generate environment file and Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Start the application:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/swagger`

## API Endpoints

### Generate Avatar
```
POST /api/generate
```

Query parameters:
- `primaryColor` (optional): Primary color for avatar
- `foreignColor` (optional): Secondary color for avatar
- `colorScheme` (optional): Predefined color scheme name
- `seed` (optional): Seed for deterministic generation (max 32 chars)

### Get Avatar
```
GET /api/:id
```

Query parameters:
- `filter` (optional): grayscale, sepia, negative
- `size` (optional): 5-9 (where 2^n, e.g., 6 = 64x64px)

### Delete Avatar
```
DELETE /api/:id
```

### Get Color Schemes
```
GET /api/color-schemes
```

### Health Check
```
GET /api/health
```

## Configuration

The application uses YAML-based configuration with environment-specific overrides:

### Base Configuration (`settings.yaml`)

The main configuration file that must always be present:

```yaml
app:
  save_path: "./storage/avatars"
  server:
    host: "0.0.0.0"
    port: 3000
  database:
    driver: "sqlite"
    connection:
      maxRetries: 3
      retryDelay: 2000
    sqlite_params:
      url: "file:./storage/database/database.sqlite"
    # postgresql_params:
    #   host: "localhost"
    #   port: 5432
    #   database: "avatar_gen"
    #   username: "postgres"
    #   password: "password"
    #   ssl: false
```

### Environment-Specific Configuration

Based on the `NODE_ENV` environment variable, the application will attempt to load environment-specific configuration files that override the base configuration:

- **Development**: `settings.development.yaml` - Loaded when `NODE_ENV=development`
- **Production**: `settings.production.yaml` - Loaded when `NODE_ENV=production`
- **Testing**: `settings.test.yaml` - Loaded when `NODE_ENV=test`

Example environment-specific configuration:

```yaml
# settings.development.yaml
app:
  server:
    port: 3001  # Different port for development
  database:
    connection:
      maxRetries: 5  # More retries for development
      retryDelay: 1000  # Faster retry for development
    sqlite_params:
      url: "file:./storage/database/database.dev.sqlite"  # Separate DB for development
```

### Configuration Loading Process

1. **Base Configuration**: Always loads `settings.yaml` (required)
2. **Environment Override**: If `NODE_ENV` is set to `development`, `production`, or `test`, attempts to load `settings.{NODE_ENV}.yaml`
3. **Merging**: Environment-specific configuration overrides base configuration using deep merge
4. **Validation**: Final configuration is validated against the schema

### Supported Environment Variables

- `NODE_ENV`: Environment mode (`development`, `production`, `test`)
- `CONFIG_PATH`: Custom path to base configuration file (defaults to `./settings.yaml`)

### Database Configuration

The application supports both SQLite and PostgreSQL databases with automatic connection retry logic:

#### SQLite (Default)
- File-based database
- No additional setup required
- Perfect for development and small deployments

#### PostgreSQL
- Full-featured relational database
- Better performance for production environments
- Requires PostgreSQL server to be running

#### Connection Retry Logic
- **maxRetries**: Number of connection attempts (default: 3)
- **retryDelay**: Delay between attempts in milliseconds (default: 2000)
- Automatic reconnection on connection loss

## Docker

### Build and run with Docker Compose

```bash
# Start with SQLite (default)
docker-compose up --build

# Start with PostgreSQL
# Uncomment PostgreSQL environment variables in docker-compose.yml
# Then run:
docker-compose up --build postgres avatar-backend
```

### Build Docker image

```bash
docker build -t avatar-backend .
```

### Run container

```bash
docker run -p 3000:3000 -v $(pwd)/storage:/app/storage avatar-backend
```

## Development

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run env:generate` - Generate .env file from settings.yaml
- `npm run prisma:generate` - Generate .env file and Prisma client
- `npm run prisma:migrate` - Generate .env file and run database migrations
- `npm run prisma:studio` - Generate .env file and open Prisma Studio
- `npm run prisma:reset` - Generate .env file and reset database (development only)
- `npm run prisma:deploy` - Generate .env file and deploy migrations to production

### Project Structure

```
src/
├── config/                 # Configuration modules
├── modules/
│   ├── avatar/            # Avatar generation and management
│   ├── database/          # Database service
│   └── logger/            # Logging service
├── common/
│   ├── dto/               # Data Transfer Objects
│   ├── interfaces/        # TypeScript interfaces
│   └── enums/             # Enums
└── utils/                 # Utility functions
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:cov
```

## Architecture

The application follows SOLID principles and uses:

- **Modular architecture** with separate modules for different concerns
- **Dependency injection** for loose coupling
- **Repository pattern** for data access
- **Service layer** for business logic
- **DTO pattern** for data validation
- **Error handling** with proper HTTP status codes

## License

ISC

