#!/bin/bash

# Development script for Avatar Generator
# Usage: ./dev.sh [profile]
# profile: sqlite (default) | postgresql

set -e

PROFILE="${1:-sqlite}"

echo "🔧 Starting Avatar Generator in development mode..."
echo "📦 Profile: $PROFILE"

# Change to project root
cd "$(dirname "$0")/.."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start services in detached mode for development
if [ "$PROFILE" = "sqlite" ]; then
    echo "🔨 Starting services with SQLite in background..."
    docker-compose -f docker/docker-compose.yml -f docker/docker-compose.sqlite.yml up -d
elif [ "$PROFILE" = "postgresql" ]; then
    echo "🔨 Starting services with PostgreSQL in background..."
    docker-compose -f docker/docker-compose.yml -f docker/docker-compose.postgresql.yml --profile postgresql up -d
else
    echo "❌ Invalid profile: $PROFILE"
    echo "Valid profiles: sqlite, postgresql"
    exit 1
fi

echo ""
echo "✅ Services started in background!"
echo "🌐 Frontend: http://localhost"
echo "🌐 Backend API: http://localhost:3000"
echo "📚 Swagger docs: http://localhost:3000/swagger"
echo "📊 Health check: http://localhost:3000/api/health"
echo ""
echo "📋 Useful commands:"
if [ "$PROFILE" = "sqlite" ]; then
    echo "  View logs: docker-compose -f docker/docker-compose.yml -f docker/docker-compose.sqlite.yml logs -f"
else
    echo "  View logs: docker-compose -f docker/docker-compose.yml -f docker/docker-compose.postgresql.yml --profile postgresql logs -f"
fi
echo "  Stop services: ./scripts/stop.sh"
echo "  Restart: ./scripts/dev.sh $PROFILE"
