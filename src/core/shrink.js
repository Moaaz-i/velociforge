/**
 * VelociForge Dependency Shrinker & Tree-Shaking Engine
 * Strips bloated documentation, markdown files, test directories, and .map source maps to save up to 30% space.
 */

const fs = require('fs');
const path = require('path');
const { Logger } = require('../utils/logger');

class ShrinkEngine {
    static shrink(projectDir = process.cwd()) {
        const nodeModulesPath = path.join(projectDir, 'node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            throw new Error("Directory 'node_modules' not found.");
        }

        Logger.info('Scanning node_modules for shrinkable bloat files (docs, tests, maps)...');

        let prunedCount = 0;
        let prunedBytes = 0;

        const bloatedExtensions = ['.md', '.map', '.ts', '.png', '.jpg', '.jpeg', '.gif', '.svg'];
        const bloatedDirNames = ['test', 'tests', 'docs', 'doc', 'example', 'examples', 'coverage', '.github'];

        function walk(currentDir) {
            const files = fs.readdirSync(currentDir);
            for (const file of files) {
                const fullPath = path.join(currentDir, file);
                try {
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        if (bloatedDirNames.includes(file.toLowerCase())) {
                            prunedCount++;
                            fs.rmSync(fullPath, { recursive: true, force: true });
                        } else {
                            walk(fullPath);
                        }
                    } else if (stat.isFile()) {
                        const ext = path.extname(file).toLowerCase();
                        if (bloatedExtensions.includes(ext) || file.toLowerCase().includes('changelog') || file.toLowerCase().includes('readme')) {
                            prunedBytes += stat.size;
                            prunedCount++;
                            fs.unlinkSync(fullPath);
                        }
                    }
                } catch (e) {}
            }
        }

        walk(nodeModulesPath);

        Logger.success(`Successfully shrunk node_modules! Pruned ${prunedCount} bloat files (${Logger.formatBytes(prunedBytes)} freed).`);
        return { prunedCount, prunedBytes };
    }
}

module.exports = ShrinkEngine;
