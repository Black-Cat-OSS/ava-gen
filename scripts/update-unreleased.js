#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

/**
 * Скрипт для обновления CHANGELOG.md
 * Использует основной скрипт generate-changelog.js, который всегда включает секцию [Unreleased]
 * Оставлен для обратной совместимости
 */

function main() {
  console.log('🔄 Генерация changelog (включая секцию [Unreleased])...');

  try {
    execSync('node scripts/generate-changelog.js all', {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Ошибка при генерации changelog:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
