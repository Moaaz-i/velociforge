/**
 * VelociForge Package List & Archive Inspector Engine
 * Reads .vforge / .vforge.json directly to list all installed library names & versions.
 */

const fs = require('fs');
const path = require('path');
const tar = require('tar');
const zlib = require('zlib');
const { Logger, colors } = require('../utils/logger');

class ListerEngine {
    static async listPackages(options = {}) {
        const projectDir = options.cwd || process.cwd();
        const bundleName = options.input || '.vforge';
        const manifestName = `${bundleName}.json`;

        const bundlePath = path.join(projectDir, bundleName);
        const manifestPath = path.join(projectDir, manifestName);

        if (!fs.existsSync(bundlePath) && !fs.existsSync(manifestPath)) {
            throw new Error(`No .vforge archive or manifest found in ${projectDir}. Run 'vforge pack' first.`);
        }

        const timer = Logger.timerStart('listing');

        // Fast Path 1: Read CycloneDX SBOM from manifest
        if (fs.existsSync(manifestPath)) {
            try {
                const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                if (manifest.sbom && manifest.sbom.components) {
                    const durationMs = Logger.timerEnd(timer);
                    Logger.info(`Found ${manifest.sbom.components.length} packages inside '${bundleName}' (Read in ${durationMs}):`);
                    
                    const rows = manifest.sbom.components.map(c => [c.name, c.version, c.purl || 'npm']);
                    Logger.table(['Package Name', 'Version', 'Type'], rows);
                    return manifest.sbom.components;
                }
            } catch (e) {}
        }

        // Fast Path 2: Stream archive headers directly to detect top-level package directories
        Logger.info(`Streaming tar archive headers from '${bundleName}'...`);
        const topLevelPackages = new Set();

        await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(bundlePath);
            const gunzip = zlib.createGunzip();

            const parseStream = new tar.Parse({
                onentry(entry) {
                    // Path format: node_modules/package-name/...
                    const entryPath = entry.path;
                    const parts = entryPath.split('/');
                    if (parts.length >= 2 && parts[0] === 'node_modules') {
                        let pkgName = parts[1];
                        if (pkgName.startsWith('@') && parts.length >= 3) {
                            pkgName = `${parts[1]}/${parts[2]}`;
                        }
                        topLevelPackages.add(pkgName);
                    }
                    entry.resume();
                }
            });

            readStream.pipe(gunzip).pipe(parseStream);
            parseStream.on('finish', resolve);
            parseStream.on('error', resolve); // Graceful fallback
            gunzip.on('error', resolve);
            readStream.on('error', reject);
        });

        const durationMs = Logger.timerEnd(timer);
        const packageList = Array.from(topLevelPackages).sort();

        Logger.info(`Found ${packageList.length} top-level package modules inside '${bundleName}' (Read in ${durationMs}):`);
        Logger.table(['#', 'Package Name'], packageList.map((pkg, i) => [`[${i + 1}]`, pkg]));

        return packageList;
    }
}

module.exports = ListerEngine;
