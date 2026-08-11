/**
 * VelociForge P2P LAN Cache Discovery Engine
 * Powered by VelociRadix Framework 🚀
 * Allows local Wi-Fi / LAN peers to discover and share .vforge archives instantly!
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { Logger, colors } = require('../utils/logger');

class P2PEngine {
    static getLocalIP() {
        const interfaces = os.networkInterfaces();
        for (const devName in interfaces) {
            const iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) {
                const alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
        return '127.0.0.1';
    }

    static async startP2PServer(port = 3457, projectDir = process.cwd()) {
        const { createApp } = await import('velociradix');
        const app = createApp();
        const localIP = this.getLocalIP();

        app.fastGet('/vforge-bundle', (req, res) => {
            const bundlePath = path.join(projectDir, '.vforge');
            if (!fs.existsSync(bundlePath)) {
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'No .vforge archive found' }));
            }
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=".vforge"');
            return fs.createReadStream(bundlePath).pipe(res);
        });

        app.fastGet('/vforge-manifest', (req, res) => {
            const manifestPath = path.join(projectDir, '.vforge.json');
            if (!fs.existsSync(manifestPath)) {
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'No .vforge.json manifest found' }));
            }
            res.setHeader('Content-Type', 'application/json');
            return fs.createReadStream(manifestPath).pipe(res);
        });

        app.fastGet('/', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ service: 'VelociForge P2P Node (VelociRadix Engine 🚀)', ip: localIP, port }));
        });

        app.listen(port, () => {
            Logger.success(`VelociForge P2P LAN Node (VelociRadix Powered 🚀) active at http://${localIP}:${port}`);
            Logger.info(`Teammates on local Wi-Fi can pull archive via: vforge p2p pull http://${localIP}:${port}`);
        });
    }

    static async pullFromPeer(peerUrl, projectDir = process.cwd()) {
        const timer = Logger.timerStart('p2p-pull');
        Logger.info(`Fetching .vforge archive from VelociRadix P2P LAN Peer: ${peerUrl}...`);

        const bundlePath = path.join(projectDir, '.vforge');
        const targetEndpoint = `${peerUrl}/vforge-bundle`;

        const response = await fetch(targetEndpoint);
        if (!response.ok) {
            throw new Error(`VelociRadix P2P Peer returned HTTP status code ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(bundlePath, buffer);

        const durationMs = Logger.timerEnd(timer);
        Logger.success(`Successfully pulled .vforge archive from VelociRadix LAN Peer in ${durationMs}!`);
        return bundlePath;
    }
}

module.exports = P2PEngine;
