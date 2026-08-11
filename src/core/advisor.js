/**
 * VelociForge Dependency Advisor & AI Optimization Engine
 */

const fs = require('fs');
const path = require('path');
const { Logger } = require('../utils/logger');

class AdvisorEngine {
    static getFolderSize(dirPath) {
        let total = 0;
        if (!fs.existsSync(dirPath)) return 0;
        try {
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
                const fullPath = path.join(dirPath, file);
                try {
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        total += this.getFolderSize(fullPath);
                    } else if (stat.isFile()) {
                        total += stat.size;
                    }
                } catch (e) {}
            }
        } catch (e) {}
        return total;
    }

    static analyze(projectDir = process.cwd()) {
        const pkgPath = path.join(projectDir, 'package.json');
        const nodeModulesPath = path.join(projectDir, 'node_modules');

        if (!fs.existsSync(pkgPath)) {
            throw new Error("package.json not found.");
        }

        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

        const knownMap = {
            'moment': { alternative: 'dayjs', note: '67 KB -> 2 KB (97% smaller)' },
            'lodash': { alternative: 'lodash-es / native JS', note: '70 KB -> Tree-shakable (85% smaller)' },
            'request': { alternative: 'undici / fetch', note: 'Deprecated -> Native zero-dep' },
            'express': { alternative: 'velociradix / fastify', note: 'Standard REST -> High Throughput' },
            'axios': { alternative: 'ky / native fetch', note: '30 KB -> Native zero-dependency' },
            'webpack': { alternative: 'vite / esbuild / velociforge', note: 'Legacy bundler -> Sub-ms engine' },
            'babel-core': { alternative: 'swc / oxc', note: 'Slow compiler -> Rust/Go native' },
            'vitepress': { alternative: 'astro / docsify', note: 'Full SSG framework' }
        };

        const results = [];

        for (const [depName] of Object.entries(allDeps)) {
            const depDir = path.join(nodeModulesPath, depName);
            const sizeBytes = this.getFolderSize(depDir);
            const sizeFormatted = Logger.formatBytes(sizeBytes);

            if (knownMap[depName]) {
                const rec = knownMap[depName];
                results.push({
                    package: `${depName} (${sizeFormatted})`,
                    alternative: rec.alternative,
                    savings: rec.note,
                    sizeBytes
                });
            } else if (sizeBytes > 500 * 1024) { // Flag packages > 500 KB dynamically
                results.push({
                    package: `${depName} (${sizeFormatted})`,
                    alternative: 'Search npm for lighter pkg',
                    savings: `Measured footprint: ${sizeFormatted}`,
                    sizeBytes
                });
            }
        }

        results.sort((a, b) => b.sizeBytes - a.sizeBytes);

        Logger.info(`VelociForge Dynamic Optimization Advisor Result (${Object.keys(allDeps).length} packages analyzed):`);

        if (results.length > 0) {
            Logger.table(
                ['Package & Disk Size', 'Recommended Alternative', 'Analysis & Potential Savings'],
                results.map(r => [r.package, r.alternative, r.savings])
            );
        } else {
            Logger.success('Your project dependencies are already lean and highly optimized! Grade: A+');
        }

        return results;
    }
}

module.exports = AdvisorEngine;
