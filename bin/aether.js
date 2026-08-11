#!/usr/bin/env node

const { main } = require('../src/cli');

main().catch((err) => {
    console.error('Fatal VelociForge Execution Error:', err);
    process.exit(1);
});
