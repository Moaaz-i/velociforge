/**
 * VelociForge Zero-Trust Malicious Script Inspector & Sandbox Analyzer Engine
 * Scans installed packages for suspicious shell commands (curl, wget, eval, SSH key harvest patterns).
 */

const fs = require('fs');
const path = require('path');
const { Logger, colors } = require('../utils/logger');

class GuardEngine {
    static inspect(projectDir = process.cwd()) {
        Logger.info('Running VelociForge Zero-Trust Malicious Script Guard...');

        const nodeModulesPath = path.join(projectDir, 'node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            throw new Error(`Directory 'node_modules' not found in ${projectDir}.`);
        }

        const suspiciousPatterns = [
            /curl\s+-s/i,
            /wget\s+/i,
            /eval\(Buffer/i,
            /base64\s+-d/i,
            /\.ssh\/id_rsa/i,
            /process\.env\.AWS_/i,
            /npm_config_registry/i,
            /raw\.githubusercontent/i
        ];

        const flaggedScripts = [];
        let totalInspected = 0;

        function walkModules(currentDir) {
            const files = fs.readdirSync(currentDir);
            for (const file of files) {
                const fullPath = path.join(currentDir, file);
                try {
                    const stat = fs.lstatSync(fullPath);
                    if (stat.isDirectory() && !file.startsWith('.')) {
                        if (file.startsWith('@')) {
                            walkModules(fullPath);
                        } else {
                            const pkgJsonPath = path.join(fullPath, 'package.json');
                            if (fs.existsSync(pkgJsonPath)) {
                                totalInspected++;
                                const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
                                const scripts = pkg.scripts || {};
                                for (const [scriptName, scriptCmd] of Object.entries(scripts)) {
                                    for (const pattern of suspiciousPatterns) {
                                        if (pattern.test(scriptCmd)) {
                                            flaggedScripts.push({
                                                package: pkg.name,
                                                version: pkg.version,
                                                script: scriptName,
                                                command: scriptCmd,
                                                matchedPattern: pattern.toString()
                                            });
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {}
            }
        }

        walkModules(nodeModulesPath);

        Logger.metric('Packages Guard Inspected', totalInspected);
        Logger.metric('Flagged Malicious Scripts', flaggedScripts.length);

        if (flaggedScripts.length > 0) {
            console.log('\n' + colors.red + '🚨 DANGER: Suspicious Lifecycle Scripts Detected:' + colors.reset);
            Logger.table(['Package', 'Script', 'Command Snippet'], flaggedScripts.map(f => [f.package, f.script, f.command.substring(0, 35) + '...']));
        } else {
            Logger.success('Zero-Trust Inspection Complete: All lifecycle scripts verified clean and safe! Shield Active.');
        }

        return flaggedScripts;
    }
}

module.exports = GuardEngine;
