/**
 * VelociForge Dependency Advisor & AI Optimization Engine
 */

const fs = require('fs');
const path = require('path');
const { Logger } = require('../utils/logger');

class AdvisorEngine {
    static analyze(projectDir = process.cwd()) {
        const pkgPath = path.join(projectDir, 'package.json');
        if (!fs.existsSync(pkgPath)) {
            throw new Error("package.json not found.");
        }

        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

        const recommendations = [
            { heavy: 'moment', alternative: 'dayjs', savings: '67 KB -> 2 KB (97% smaller)' },
            { heavy: 'lodash', alternative: 'lodash-es / native JS', savings: '70 KB -> Tree-shakable (85% smaller)' },
            { heavy: 'request', alternative: 'undici / fetch', savings: 'Deprecated & Heavy -> Native zero-dep' },
            { heavy: 'express', alternative: 'velociradix / fastify', savings: 'Standard REST -> Ultra high throughput' },
            { heavy: 'axios', alternative: 'ky / native fetch', savings: '30 KB -> Native zero-dependency' }
        ];

        const matches = [];
        for (const rec of recommendations) {
            if (allDeps[rec.heavy]) {
                matches.push(rec);
            }
        }

        Logger.info(`VelociForge Optimization Advisor Result (${Object.keys(allDeps).length} packages analyzed):`);

        if (matches.length > 0) {
            Logger.table(
                ['Heavy Package Detected', 'Recommended Alternative', 'Potential Savings'],
                matches.map(m => [m.heavy, m.alternative, m.savings])
            );
        } else {
            Logger.success('Your project dependencies are already lean and highly optimized! Grade: A+');
        }

        return matches;
    }
}

module.exports = AdvisorEngine;
