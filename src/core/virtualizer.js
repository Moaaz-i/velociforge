/**
 * VelociForge Virtualization & RAM-Disk Mount Engine
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Logger } = require('../utils/logger');

class VirtualizerEngine {
    /**
     * Check if a RAM-disk / tmpfs directory is available or create virtual mount
     */
    static getOrMountRAMDisk() {
        const platform = process.platform;
        if (platform === 'linux' && fs.existsSync('/dev/shm')) {
            return '/dev/shm/vforge-virtual-cache';
        }
        
        const systemTmp = path.join(require('os').tmpdir(), 'vforge-ram-cache');
        if (!fs.existsSync(systemTmp)) {
            fs.mkdirSync(systemTmp, { recursive: true });
        }
        return systemTmp;
    }

    /**
     * Create zero-copy virtual symlink map for rapid instant module binding
     */
    static createVirtualSymlinkTree(sourceModulesDir, targetProjectDir) {
        const targetNodeModules = path.join(targetProjectDir, 'node_modules');
        if (!fs.existsSync(sourceModulesDir)) return false;

        if (fs.existsSync(targetNodeModules)) {
            fs.rmSync(targetNodeModules, { recursive: true, force: true });
        }

        fs.symlinkSync(sourceModulesDir, targetNodeModules, 'junction');
        Logger.info(`Virtual junction mounted: node_modules ➔ ${sourceModulesDir}`);
        return true;
    }
}

module.exports = VirtualizerEngine;
