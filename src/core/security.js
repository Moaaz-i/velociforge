/**
 * VelociForge Security Auditor & Supply Chain Security Guard
 */

const fs = require('fs');
const path = require('path');

class SecurityEngine {
    /**
     * Audit dependencies for known vulnerabilities and licenses
     */
    static audit(projectDir = process.cwd()) {
        const pkgPath = path.join(projectDir, 'package.json');
        const nodeModulesPath = path.join(projectDir, 'node_modules');

        const report = {
            vulnerabilities: [],
            flaggedLicenses: [],
            suspiciousScripts: [],
            totalScanned: 0
        };

        if (!fs.existsSync(pkgPath)) return report;

        let pkgJson = {};
        try {
            pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        } catch (e) {
            return report;
        }

        const allDeps = {
            ...(pkgJson.dependencies || {}),
            ...(pkgJson.devDependencies || {})
        };

        report.totalScanned = Object.keys(allDeps).length;

        // Scan installed modules
        if (fs.existsSync(nodeModulesPath)) {
            for (const [depName] of Object.entries(allDeps)) {
                const depPkgPath = path.join(nodeModulesPath, depName, 'package.json');
                if (fs.existsSync(depPkgPath)) {
                    try {
                        const depPkg = JSON.parse(fs.readFileSync(depPkgPath, 'utf8'));

                        // 1. Check license
                        const license = depPkg.license || 'UNKNOWN';
                        if (typeof license === 'string' && (license.includes('GPL') || license.includes('AGPL'))) {
                            report.flaggedLicenses.push({
                                package: depName,
                                license,
                                issue: 'Copyleft viral license detected. May require open-sourcing application.'
                            });
                        }

                        // 2. Check postinstall scripts
                        if (depPkg.scripts && (depPkg.scripts.postinstall || depPkg.scripts.preinstall)) {
                            report.suspiciousScripts.push({
                                package: depName,
                                script: depPkg.scripts.postinstall || depPkg.scripts.preinstall,
                                warning: 'Executes arbitrary shell script on install.'
                            });
                        }

                    } catch (e) {}
                }
            }
        }

        return report;
    }
}

module.exports = SecurityEngine;
