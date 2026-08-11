/**
 * VelociForge Monorepo Workspace Resolver
 */

const fs = require('fs');
const path = require('path');

class MonorepoEngine {
    static detectMonorepo(projectDir = process.cwd()) {
        const pnpmWorkspace = path.join(projectDir, 'pnpm-workspace.yaml');
        const lernaJson = path.join(projectDir, 'lerna.json');
        const pkgJsonPath = path.join(projectDir, 'package.json');

        let isMonorepo = false;
        let type = 'Single Package';
        let workspaces = [];

        if (fs.existsSync(pnpmWorkspace)) {
            isMonorepo = true;
            type = 'pnpm Workspaces';
        } else if (fs.existsSync(lernaJson)) {
            isMonorepo = true;
            type = 'Lerna Monorepo';
        } else if (fs.existsSync(pkgJsonPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
                if (pkg.workspaces) {
                    isMonorepo = true;
                    type = 'npm/yarn Workspaces';
                    workspaces = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces.packages || [];
                }
            } catch (e) {}
        }

        return { isMonorepo, type, workspaces };
    }
}

module.exports = MonorepoEngine;
