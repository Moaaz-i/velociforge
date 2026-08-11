/**
 * VelociForge Dependency Snapshot & Rollback Engine
 */

const fs = require('fs');
const path = require('path');
const { Logger } = require('../utils/logger');

class SnapshotEngine {
    static getSnapshotDir(projectDir = process.cwd()) {
        const snapDir = path.join(projectDir, '.vforge-snapshots');
        if (!fs.existsSync(snapDir)) {
            fs.mkdirSync(snapDir, { recursive: true });
        }
        return snapDir;
    }

    static createSnapshot(name, projectDir = process.cwd()) {
        const bundlePath = path.join(projectDir, '.vforge');
        const manifestPath = path.join(projectDir, '.vforge.json');

        if (!fs.existsSync(bundlePath)) {
            throw new Error("No active .vforge bundle found to snapshot. Run 'vforge pack' first.");
        }

        const snapName = name || `snap-${Date.now()}`;
        const targetDir = path.join(this.getSnapshotDir(projectDir), snapName);
        fs.mkdirSync(targetDir, { recursive: true });

        fs.copyFileSync(bundlePath, path.join(targetDir, '.vforge'));
        if (fs.existsSync(manifestPath)) {
            fs.copyFileSync(manifestPath, path.join(targetDir, '.vforge.json'));
        }

        Logger.success(`Snapshot '${snapName}' saved successfully in .vforge-snapshots/${snapName}`);
    }

    static listSnapshots(projectDir = process.cwd()) {
        const snapDir = this.getSnapshotDir(projectDir);
        const snaps = fs.readdirSync(snapDir).filter(f => fs.statSync(path.join(snapDir, f)).isDirectory());

        Logger.info(`Found ${snaps.length} local dependency snapshots:`);
        Logger.table(['Snapshot Name', 'Created Date', 'Size'], snaps.map(s => {
            const p = path.join(snapDir, s, '.vforge');
            const size = fs.existsSync(p) ? Logger.formatBytes(fs.statSync(p).size) : 'N/A';
            const mtime = fs.existsSync(p) ? fs.statSync(p).mtime.toISOString().split('T')[0] : 'N/A';
            return [s, mtime, size];
        }));
    }

    static restoreSnapshot(name, projectDir = process.cwd()) {
        const snapDir = path.join(this.getSnapshotDir(projectDir), name);
        if (!fs.existsSync(snapDir)) {
            throw new Error(`Snapshot '${name}' not found.`);
        }

        fs.copyFileSync(path.join(snapDir, '.vforge'), path.join(projectDir, '.vforge'));
        if (fs.existsSync(path.join(snapDir, '.vforge.json'))) {
            fs.copyFileSync(path.join(snapDir, '.vforge.json'), path.join(projectDir, '.vforge.json'));
        }

        Logger.success(`Restored snapshot '${name}' into project root!`);
    }
}

module.exports = SnapshotEngine;
