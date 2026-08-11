/**
 * VelociForge Ephemeral Process Lifecycle Runner Engine
 * Sub-Millisecond Zero-Copy Symlink Mounting & Instant Unmounting
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const UnpackerEngine = require('./unpacker');
const CompressorEngine = require('./compressor');
const ManifestEngine = require('./manifest');
const { Logger } = require('../utils/logger');

class RunnerEngine {
    static getEnvironmentFingerprint(projectDir) {
        const lockFingerprint = ManifestEngine.getLockfileFingerprint(projectDir);
        const pkgPath = path.join(projectDir, 'package.json');
        let pkgMtime = 0;
        if (fs.existsSync(pkgPath)) {
            pkgMtime = fs.statSync(pkgPath).mtimeMs;
        }
        return `${lockFingerprint}:${pkgMtime}`;
    }

    static async run(commandStr, options = {}) {
        const projectDir = options.cwd || process.cwd();
        const nodeModulesPath = path.join(projectDir, 'node_modules');
        const bundlePath = path.join(projectDir, '.vforge');

        if (!fs.existsSync(nodeModulesPath) && !fs.existsSync(bundlePath)) {
            throw new Error('Neither node_modules nor .vforge archive exists in project.');
        }

        const preRunTimer = Logger.timerStart('preflight');

        // 1. Pre-flight: Instant Zero-Copy Symlink Mount (Sub-millisecond!)
        if (!fs.existsSync(nodeModulesPath) && fs.existsSync(bundlePath)) {
            const restoreRes = await UnpackerEngine.restore({ cwd: projectDir, useSymlink: true });
            Logger.info(`⚡ [Pre-Flight] ${restoreRes.message}`);
        }

        const initialFingerprint = this.getEnvironmentFingerprint(projectDir);
        const setupTime = Logger.timerEnd(preRunTimer);
        Logger.info(`🚀 [Runtime] Executing target command in ${setupTime}: '${commandStr}'...`);

        // 2. Spawn target command with node_modules/.bin injected into PATH
        const binPath = path.join(projectDir, 'node_modules', '.bin');
        const envPath = process.env.PATH ? `${binPath}:${process.env.PATH}` : binPath;

        const child = spawn(commandStr, {
            cwd: projectDir,
            shell: true,
            stdio: 'inherit',
            env: {
                ...process.env,
                PATH: envPath
            }
        });

        let isCleaning = false;
        let isDone = false;

        const performCleanup = async (exitCode = 0) => {
            if (isCleaning || isDone) return;
            isCleaning = true;

            const shutdownTimer = Logger.timerStart('shutdown');
            console.log('\n');
            Logger.info('🧹 [Post-Flight Shutdown] Ultra-Fast Ephemeral Cleanup Hook Triggered...');

            try {
                const currentFingerprint = this.getEnvironmentFingerprint(projectDir);
                const wasModified = currentFingerprint !== initialFingerprint;

                if (fs.existsSync(nodeModulesPath)) {
                    const stat = fs.lstatSync(nodeModulesPath);
                    const isSymlink = stat.isSymbolicLink();

                    if (wasModified) {
                        Logger.info('Dependencies modified during runtime. Repacking virtual archive...');
                        await CompressorEngine.pack({ cwd: projectDir, level: 1 });
                    } else {
                        Logger.info('⚡ Dependencies unchanged! Skipping re-pack.');
                    }

                    if (isSymlink) {
                        Logger.info('Unmounting Zero-Copy virtual junction...');
                        fs.unlinkSync(nodeModulesPath);
                    } else {
                        Logger.info('Purging node_modules directory...');
                        fs.rmSync(nodeModulesPath, { recursive: true, force: true });
                    }
                }

                // Purge temp files
                const files = fs.readdirSync(projectDir);
                for (const f of files) {
                    if (f.startsWith('.vforge.tmp') || f.startsWith('.vforge-unpack-tmp')) {
                        fs.rmSync(path.join(projectDir, f), { recursive: true, force: true });
                    }
                }

                const cleanDuration = Logger.timerEnd(shutdownTimer);
                Logger.success(`⚡ Ephemeral Cleanup Completed in ${cleanDuration}! Zero disk footprint restored.`);
            } catch (e) {
                Logger.error(`Cleanup error: ${e.message}`);
            }

            isDone = true;
            process.exit(exitCode);
        };

        // Trap signals
        const handleSignal = (sig) => {
            if (child && !child.killed) {
                child.kill(sig);
            }
        };

        process.once('SIGINT', () => handleSignal('SIGINT'));
        process.once('SIGTERM', () => handleSignal('SIGTERM'));

        child.on('exit', async (code) => {
            await performCleanup(code || 0);
        });
    }
}

module.exports = RunnerEngine;
