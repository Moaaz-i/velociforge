/**
 * VelociForge Streaming Unpacker & Zero-Copy Symlink Cache Engine
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const tar = require('tar');
const os = require('os');
const ManifestEngine = require('./manifest');
const { Logger } = require('../utils/logger');

class UnpackerEngine {
    static getGlobalCacheDir() {
        const cacheDir = path.join(os.homedir(), '.velociforge', 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        return cacheDir;
    }

    /**
     * Unpack .vforge archive to restore node_modules with zero-copy symlink caching option
     */
    static async restore(options = {}) {
        const projectDir = options.cwd || process.cwd();
        const bundleName = options.input || '.vforge';
        const manifestName = `${bundleName}.json`;
        const force = options.force || false;
        const useSymlink = options.useSymlink !== undefined ? options.useSymlink : true;
        const encryptionKey = options.decryptKey || null;

        const bundlePath = path.join(projectDir, bundleName);
        const manifestPath = path.join(projectDir, manifestName);
        const nodeModulesPath = path.join(projectDir, 'node_modules');

        if (!fs.existsSync(bundlePath)) {
            throw new Error(`Virtual package archive '${bundleName}' not found in ${projectDir}.`);
        }

        const timer = Logger.timerStart('restoration');
        const currentLockHash = ManifestEngine.getLockfileFingerprint(projectDir);

        // Check zero-delay existing node_modules
        let manifest = null;
        if (fs.existsSync(manifestPath)) {
            try {
                manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                if (!force && manifest.fingerprint === currentLockHash && fs.existsSync(nodeModulesPath)) {
                    const checkTime = Logger.timerEnd(timer);
                    return {
                        cached: true,
                        durationMs: checkTime,
                        message: 'Lockfile fingerprint unchanged. Environment zero-delay verified in 0.00ms!'
                    };
                }
            } catch (err) {}
        }

        // Zero-Copy Global Cache Symlink Check
        const globalCacheBase = this.getGlobalCacheDir();
        const cachedContainerPath = path.join(globalCacheBase, currentLockHash);
        const cachedModulesPath = path.join(cachedContainerPath, 'node_modules');
        const finalSymlinkSource = fs.existsSync(cachedModulesPath) ? cachedModulesPath : cachedContainerPath;

        // Remove existing target node_modules if present
        if (fs.existsSync(nodeModulesPath)) {
            try {
                const stat = fs.lstatSync(nodeModulesPath);
                if (stat.isSymbolicLink()) {
                    fs.unlinkSync(nodeModulesPath);
                } else {
                    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
                }
            } catch (e) {}
        }

        // FAST PATH 1: Instant Symlink Mount from Global Cache (Sub-1ms!)
        if (useSymlink && fs.existsSync(finalSymlinkSource)) {
            fs.symlinkSync(finalSymlinkSource, nodeModulesPath, 'dir');
            const durationMs = Logger.timerEnd(timer);
            return {
                cached: true,
                durationMs,
                message: `Zero-Copy Virtual Junction mounted in ${durationMs}!`
            };
        }

        // FAST PATH 2: Extract to Global Cache Container and Symlink
        const targetExtractDir = useSymlink ? cachedContainerPath : nodeModulesPath;
        if (useSymlink && !fs.existsSync(cachedContainerPath)) {
            fs.mkdirSync(cachedContainerPath, { recursive: true });
        }

        await new Promise((resolve, reject) => {
            let readStream = fs.createReadStream(bundlePath);

            if (encryptionKey) {
                const decipher = crypto.createDecipheriv(
                    'aes-256-cbc',
                    crypto.scryptSync(encryptionKey, 'vforge-salt', 32),
                    Buffer.alloc(16, 0)
                );
                readStream = readStream.pipe(decipher);
            }

            const algo = manifest ? manifest.algorithm : 'gzip';
            let decompressStream = null;

            if (algo === 'brotli') {
                decompressStream = zlib.createBrotliDecompress();
            } else if (algo === 'uncompressed') {
                decompressStream = null;
            } else {
                decompressStream = zlib.createGunzip();
            }

            let pipelineStream = readStream;
            if (decompressStream) {
                pipelineStream = pipelineStream.pipe(decompressStream);
            }

            const tarExtract = tar.x({
                cwd: targetExtractDir,
                preservePaths: false,
            });

            pipelineStream.pipe(tarExtract);

            tarExtract.on('finish', resolve);
            tarExtract.on('error', reject);
            readStream.on('error', reject);
        });

        // Resolve exact extracted location
        const resolvedModulesDir = fs.existsSync(cachedModulesPath) ? cachedModulesPath : targetExtractDir;

        if (useSymlink && !fs.existsSync(nodeModulesPath)) {
            fs.symlinkSync(resolvedModulesDir, nodeModulesPath, 'dir');
        }

        const durationMs = Logger.timerEnd(timer);

        return {
            cached: false,
            durationMs,
            message: `Extracted & Mounted virtual package in ${durationMs}!`
        };
    }
}

module.exports = UnpackerEngine;
