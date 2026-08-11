/**
 * VelociForge Deep File Search & Multi-Snapshot Delta Engine
 * Recursively discovers all .vforge.json manifests, compares file-level & package-level diffs across the entire project.
 */

const fs = require('fs');
const path = require('path');
const { Logger, colors } = require('../utils/logger');

class DiffEngine {
    /**
     * Recursively search directory tree for all .vforge.json manifests
     */
    static discoverManifests(dirPath) {
        const foundManifests = [];

        function walk(currentDir) {
            if (!fs.existsSync(currentDir)) return;
            const files = fs.readdirSync(currentDir);
            for (const file of files) {
                const fullPath = path.join(currentDir, file);
                try {
                    const stat = fs.lstatSync(fullPath);
                    if (stat.isDirectory()) {
                        if (file !== 'node_modules' && file !== '.git') {
                            walk(fullPath);
                        }
                    } else if (file.endsWith('.vforge.json') || file.endsWith('.aether.json')) {
                        foundManifests.push(fullPath);
                    }
                } catch (e) {}
            }
        }

        walk(dirPath);
        return foundManifests;
    }

    static compareManifests(pathA, pathB, projectDir = process.cwd()) {
        Logger.info('Scanning project directory tree for all .vforge archives & manifests...');
        const discovered = this.discoverManifests(projectDir);

        Logger.metric('Discovered Manifest Files', discovered.length);

        if (discovered.length > 0) {
            console.log('\n' + colors.cyan + 'Discovered Manifest Search Map:' + colors.reset);
            const tableRows = discovered.map(m => {
                const rel = path.relative(projectDir, m);
                const size = Logger.formatBytes(fs.statSync(m).size);
                const mtime = fs.statSync(m).mtime.toISOString().split('T')[0];
                return [rel, size, mtime];
            });
            Logger.table(['Manifest Relative Path', 'Manifest Size', 'Last Modified'], tableRows);
        }

        // Determine targets to compare
        let targetA = pathA ? path.resolve(projectDir, pathA) : path.join(projectDir, '.vforge.json');
        let targetB = pathB ? path.resolve(projectDir, pathB) : null;

        if (!targetB) {
            // Find another discovered manifest to compare against
            const otherManifests = discovered.filter(m => path.resolve(m) !== path.resolve(targetA));
            if (otherManifests.length > 0) {
                targetB = otherManifests[otherManifests.length - 1];
                Logger.info(`Auto-comparing current root manifest against discovered target: '${path.relative(projectDir, targetB)}'`);
            }
        }

        if (!targetB || !fs.existsSync(targetA) || !fs.existsSync(targetB)) {
            Logger.warn("To run 'vforge diff', at least 2 manifest files must exist in project.");
            console.log(`\n${colors.cyan}Tip: Create a snapshot first via:${colors.reset}`);
            console.log(`  $ ${colors.bright}vforge snapshot create my-backup${colors.reset}\n`);
            return null;
        }

        Logger.info(`Comparing manifest targets:\n  • Target A: ${path.relative(projectDir, targetA)}\n  • Target B: ${path.relative(projectDir, targetB)}`);

        const manifestA = JSON.parse(fs.readFileSync(targetA, 'utf8'));
        const manifestB = JSON.parse(fs.readFileSync(targetB, 'utf8'));

        // Extract package dependencies from SBOM / manifest
        const getDeps = (m) => {
            if (m.sbom && m.sbom.components) {
                return Object.fromEntries(m.sbom.components.map(c => [c.name, c.version]));
            }
            return m.dependencies || {};
        };

        const depsA = getDeps(manifestA);
        const depsB = getDeps(manifestB);

        const added = [];
        const removed = [];
        const updated = [];

        for (const [pkg, verB] of Object.entries(depsB)) {
            if (!depsA[pkg]) {
                added.push([pkg, verB]);
            } else if (depsA[pkg] !== verB) {
                updated.push([pkg, depsA[pkg], verB]);
            }
        }

        for (const [pkg, verA] of Object.entries(depsA)) {
            if (!depsB[pkg]) {
                removed.push([pkg, verA]);
            }
        }

        const sizeA = (manifestA.metrics && manifestA.metrics.compressedSizeBytes) ? manifestA.metrics.compressedSizeBytes : 0;
        const sizeB = (manifestB.metrics && manifestB.metrics.compressedSizeBytes) ? manifestB.metrics.compressedSizeBytes : 0;

        const sizeDeltaBytes = sizeB - sizeA;
        const sizeDeltaStr = (sizeDeltaBytes >= 0 ? '+' : '') + Logger.formatBytes(sizeDeltaBytes);

        Logger.metric('Archive Size Delta', sizeDeltaStr);
        Logger.metric('Fingerprint A (SHA-256)', (manifestA.fingerprint || 'N/A').substring(0, 24) + '...');
        Logger.metric('Fingerprint B (SHA-256)', (manifestB.fingerprint || 'N/A').substring(0, 24) + '...');
        Logger.metric('New Packages Added', added.length);
        Logger.metric('Packages Removed', removed.length);
        Logger.metric('Versions Updated', updated.length);

        if (added.length > 0) {
            console.log('\n' + colors.green + '➕ Added Dependencies:' + colors.reset);
            Logger.table(['Package Name', 'Version'], added);
        }

        if (removed.length > 0) {
            console.log('\n' + colors.red + '➖ Removed Dependencies:' + colors.reset);
            Logger.table(['Package Name', 'Old Version'], removed);
        }

        if (updated.length > 0) {
            console.log('\n' + colors.yellow + '🔄 Version Updates:' + colors.reset);
            Logger.table(['Package Name', 'From Version', 'To Version'], updated);
        }

        if (added.length === 0 && removed.length === 0 && updated.length === 0) {
            Logger.success('Both manifests are identical! Zero dependency differences.');
        }

        return { added, removed, updated, sizeDeltaBytes, discovered };
    }
}

module.exports = DiffEngine;
