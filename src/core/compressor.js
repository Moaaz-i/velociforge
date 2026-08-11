/**
 * VelociForge Multi-Algorithm Streaming Compression Engine
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const tar = require('tar');
const ManifestEngine = require('./manifest');
const { Logger } = require('../utils/logger');

class CompressorEngine {
    static getDirectorySize(dirPath) {
        let totalSize = 0;
        if (!fs.existsSync(dirPath)) return 0;

        function walk(currentPath) {
            const stats = fs.statSync(currentPath);
            if (stats.isFile()) {
                totalSize += stats.size;
            } else if (stats.isDirectory()) {
                const files = fs.readdirSync(currentPath);
                for (const file of files) {
                    walk(path.join(currentPath, file));
                }
            }
        }

        walk(dirPath);
        return totalSize;
    }

    /**
     * Pack node_modules directory into .vforge archive & manifest
     */
    static async pack(options = {}) {
        const projectDir = options.cwd || process.cwd();
        const outputName = options.output || '.vforge';
        const manifestName = `${outputName}.json`;
        const algorithm = options.algo || 'gzip';
        const encryptionKey = options.encryptKey || null;

        const nodeModulesPath = path.join(projectDir, 'node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            throw new Error(`Directory 'node_modules' not found in ${projectDir}. Please run 'npm install' first.`);
        }

        const timer = Logger.timerStart('packing');
        Logger.info(`Scanning dependency tree in ${nodeModulesPath}...`);
        const originalSize = this.getDirectorySize(nodeModulesPath);

        const tempBundlePath = path.join(projectDir, `${outputName}.tmp.${Date.now()}`);
        const finalBundlePath = path.join(projectDir, outputName);
        const finalManifestPath = path.join(projectDir, manifestName);

        Logger.info(`Creating compressed payload using algorithm [${algorithm.toUpperCase()}]...`);

        // Create tar payload stream
        await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(tempBundlePath);

            let compressionStream;
            const compLevel = options.level !== undefined ? options.level : 9;
            if (algorithm === 'brotli') {
                compressionStream = zlib.createBrotliCompress({
                    params: {
                        [zlib.constants.BROTLI_PARAM_QUALITY]: compLevel > 6 ? 6 : compLevel
                    }
                });
            } else if (algorithm === 'uncompressed') {
                compressionStream = null;
            } else {
                compressionStream = zlib.createGzip({ level: compLevel });
            }

            const tarStream = tar.c({
                cwd: projectDir,
                portable: true,
                noMtime: true,
            }, ['node_modules']);

            let pipelineStream = tarStream;
            if (compressionStream) {
                pipelineStream = pipelineStream.pipe(compressionStream);
            }

            if (encryptionKey) {
                const cipher = crypto.createCipheriv(
                    'aes-256-cbc',
                    crypto.scryptSync(encryptionKey, 'vforge-salt', 32),
                    Buffer.alloc(16, 0)
                );
                pipelineStream = pipelineStream.pipe(cipher);
            }

            pipelineStream.pipe(writeStream);

            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
            tarStream.on('error', reject);
        });

        // Atomic swap
        if (fs.existsSync(finalBundlePath)) {
            fs.unlinkSync(finalBundlePath);
        }
        fs.renameSync(tempBundlePath, finalBundlePath);

        const archiveSize = fs.statSync(finalBundlePath).size;
        const durationMs = Logger.timerEnd(timer);

        // Generate cryptographic manifest
        const manifest = ManifestEngine.createManifest(projectDir, archiveSize, originalSize, durationMs, algorithm);
        fs.writeFileSync(finalManifestPath, JSON.stringify(manifest, null, 2), 'utf8');

        return {
            archivePath: finalBundlePath,
            manifestPath: finalManifestPath,
            originalSize,
            archiveSize,
            durationMs,
            manifest
        };
    }
}

module.exports = CompressorEngine;
