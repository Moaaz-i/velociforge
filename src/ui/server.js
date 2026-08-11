/**
 * VelociForge Web UI Dashboard Server
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const SecurityEngine = require('../core/security');
const { Logger } = require('../utils/logger');

class UIServer {
    static start(port = 3456, projectDir = process.cwd()) {
        const app = express();
        app.use(express.static(path.join(__dirname, 'public')));

        app.get('/api/manifest', (req, res) => {
            const manifestPath = path.join(projectDir, '.vforge.json');
            if (fs.existsSync(manifestPath)) {
                try {
                    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                    return res.json(manifest);
                } catch (e) {}
            }
            res.status(444).json({ error: 'No .vforge.json manifest found' });
        });

        app.get('/api/security', (req, res) => {
            const audit = SecurityEngine.audit(projectDir);
            res.json(audit);
        });

        app.listen(port, () => {
            const url = `http://localhost:${port}`;
            Logger.success(`VelociForge Interactive Web Dashboard running at: ${url}`);
        });
    }
}

module.exports = UIServer;
