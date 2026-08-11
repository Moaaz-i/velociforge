/**
 * VelociForge Web UI Dashboard Server
 */

const { createApp } = require('velociradix');
const path = require('path');
const fs = require('fs');
const SecurityEngine = require('../core/security');
const { Logger } = require('../utils/logger');

class UIServer {
    static start(port = 3456, projectDir = process.cwd()) {
        const app = createApp();

        app.serveStatic(path.join(__dirname, 'public'));

        app.fastGet('/api/manifest', (req, res) => {
            const manifestPath = path.join(projectDir, '.vforge.json');
            if (fs.existsSync(manifestPath)) {
                try {
                    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify(manifest));
                } catch (e) {}
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'No .vforge.json manifest found' }));
        });

        app.fastGet('/api/security', (req, res) => {
            const audit = SecurityEngine.audit(projectDir);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(audit));
        });

        app.listen(port, () => {
            const url = `http://localhost:${port}`;
            Logger.success(`VelociForge Interactive Web Dashboard (VelociRadix Powered 🚀) running at: ${url}`);
        });
    }
}

module.exports = UIServer;
