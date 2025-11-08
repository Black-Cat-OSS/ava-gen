#!/usr/bin/env node
require('ts-node/register');

const { runSwaggerGenerator } = require('../src/swagger/swagger.generator');

runSwaggerGenerator().catch(error => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
