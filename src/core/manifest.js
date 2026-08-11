/**
 * VelociForge Cryptographic Manifest & Lockfile Fingerprinting Module
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ManifestEngine {
    /**
     * Compute SHA-256 fingerprint for project lockfiles
     */
    static getLockfileFingerprint(projectDir = process.cwd()) {
        const lockfiles = [
            'package-lock.json',
            'pnpm-lock.yaml',
            'bun.lockb',
            'yarn.lock',
            'package.json'
        ];

        const hash = crypto.createHash('sha256');
        let foundAny = false;

        for (const file of lockfiles) {
            const filePath = path.join(projectDir, file);
            if (fs.existsSync(filePath)) {
                foundAny = true;
                const fileBuffer = fs.readFileSync(filePath);
                hash.update(file).update(fileBuffer);
            }
        }

        if (!foundAny) {
            hash.update('empty-lockfile');
        }

        return hash.digest('hex');
    }

    /**
     * Generate Software Bill of Materials (SBOM) metadata
     */
    static generateSBOM(projectDir = process.cwd()) {
        const pkgPath = path.join(projectDir, 'package.json');
        let dependencies = {};
        let devDependencies = {};

        if (fs.existsSync(pkgPath)) {
            try {
                const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                dependencies = pkgJson.dependencies || {};
                devDependencies = pkgJson.devDependencies || {};
            } catch (err) {
                // Ignore parse errors
            }
        }

        const sbom = {
            bomFormat: "CycloneDX",
            specVersion: "1.4",
            serialNumber: `urn:uuid:${crypto.randomUUID()}`,
            version: 1,
            metadata: {
                timestamp: new Date().toISOString(),
                tools: [{ vendor: "VelociForge", name: "vforge", version: "1.1.0" }]
            },
            components: Object.entries({ ...dependencies, ...devDependencies }).map(([name, version]) => ({
                type: "library",
                name,
                version: String(version).replace(/[\^~]/g, ''),
                purl: `pkg:npm/${name}@${version}`
            }))
        };

        return sbom;
    }

    /**
     * Build the full .vforge.json manifest
     */
    static createManifest(projectDir, archiveSize, originalSize, timeTakenMs, algo = 'gzip') {
        const lockHash = this.getLockfileFingerprint(projectDir);
        const sbom = this.generateSBOM(projectDir);
        
        return {
            generator: "VelociForge Engine v1.0.0",
            createdAt: new Date().toISOString(),
            git: this.getGitInfo(projectDir),
            fingerprint: lockHash,
            algorithm: algo,
            metrics: {
                originalSizeBytes: originalSize,
                compressedSizeBytes: archiveSize,
                compressionRatio: originalSize ? ((1 - (archiveSize / originalSize)) * 100).toFixed(1) + '%' : '0%',
                packDurationMs: timeTakenMs
            },
            sbom
        };
    }

    static getGitInfo(projectDir) {
        try {
            const headPath = path.join(projectDir, '.git', 'HEAD');
            if (fs.existsSync(headPath)) {
                const head = fs.readFileSync(headPath, 'utf8').trim();
                if (head.startsWith('ref:')) {
                    const refPath = path.join(projectDir, '.git', head.split(' ')[1]);
                    const branch = head.split('/').pop();
                    const commit = fs.existsSync(refPath) ? fs.readFileSync(refPath, 'utf8').trim() : 'unknown';
                    return { branch, commit: commit.substring(0, 7) };
                }
                return { branch: 'HEAD', commit: head.substring(0, 7) };
            }
        } catch (e) {
            // Ignore git read failure
        }
        return { branch: 'main', commit: 'standalone' };
    }
}

module.exports = ManifestEngine;
