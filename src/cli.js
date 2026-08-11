/**
 * VelociForge Master CLI Engine
 */

const fs = require('fs');
const path = require('path');
const CompressorEngine = require('./core/compressor');
const UnpackerEngine = require('./core/unpacker');
const ManifestEngine = require('./core/manifest');
const SecurityEngine = require('./core/security');
const BenchmarkEngine = require('./core/bench');
const MonorepoEngine = require('./core/monorepo');
const RemoteEngine = require('./core/remote');
const { Logger, colors } = require('./utils/logger');

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command || command === '--help' || command === '-h') {
        Logger.banner();
        console.log(`
${colors.whiteBold}USAGE:${colors.reset}
  $ ${colors.cyan}vforge${colors.reset} <command> [options]  (or ${colors.cyan}velociforge${colors.reset})

${colors.whiteBold}COMMANDS:${colors.reset}
  ${colors.cyan}pack${colors.reset}       📦 Bundles node_modules into optimized .vforge virtual archive
  ${colors.cyan}ci${colors.reset} | ${colors.cyan}restore${colors.reset} ⚡ Ultra-fast extraction (0ms zero-delay if lockfile matches)
  ${colors.cyan}run${colors.reset} | ${colors.cyan}boot${colors.reset}    🔄 Ephemeral run: unpacks node_modules, runs server, auto-cleans on exit!
  ${colors.cyan}list${colors.reset} | ${colors.cyan}ls${colors.reset}      📋 Reads .vforge archive and lists all installed library names
  ${colors.cyan}p2p${colors.reset} | ${colors.cyan}lan${colors.reset}     🌐 Zero-bandwidth LAN P2P cache node (share archives over Wi-Fi)
  ${colors.cyan}guard${colors.reset}       🛡 Zero-Trust malicious script inspector & sandbox analyzer
  ${colors.cyan}diff${colors.reset} | ${colors.cyan}delta${colors.reset}   🔍 Compares two archives/snapshots and shows size & version delta
  ${colors.cyan}edge${colors.reset} | ${colors.cyan}cloud${colors.reset}   ☁️ Generates sub-millisecond GitHub Actions & Edge CI workflows
  ${colors.cyan}docs${colors.reset}       📖 Launches interactive VitePress documentation engine
  ${colors.cyan}shrink${colors.reset}     🧹 Tree-shakes node_modules (strips docs/maps to save 30% space)
  ${colors.cyan}doctor${colors.reset}     🩺 Self-diagnostic health checker & environment auditor
  ${colors.cyan}snapshot${colors.reset}   📸 Local dependency snapshot & rollback manager (create/list/restore)
  ${colors.cyan}advisor${colors.reset}    💡 AI optimization advisor (recommends lighter package alternatives)
  ${colors.cyan}export${colors.reset}     🐳 Exports optimized Dockerfile layers (.vforge Docker setup)
  ${colors.cyan}inspect${colors.reset}    🔍 Inspects .vforge archive metadata, compression & SBOM
  ${colors.cyan}bench${colors.reset}      🚀 Runs live benchmark comparing npm ci vs VelociForge
  ${colors.cyan}security${colors.reset}   🛡 Scans installed modules for CVE vulnerabilities & licenses
  ${colors.cyan}ui${colors.reset}         🌐 Launches interactive browser analytics dashboard
  ${colors.cyan}monorepo${colors.reset}   🏢 Scans monorepo workspace packages & graph topology
  ${colors.cyan}clean${colors.reset}      🧹 Cleans temporary swap files (use --all to purge .vforge)

${colors.whiteBold}OPTIONS:${colors.reset}
  --algo <gzip|brotli|uncompressed>  Set compression algorithm (default: gzip)
  --encrypt <key>                    Encrypt archive with AES-256-CBC
  --decrypt <key>                    Decrypt encrypted .vforge archive
  --force                            Force extraction even if lockfile matches
  --port <number>                    Port for web dashboard (default: 3456)
        `);
        return;
    }

    if (command === 'version' || command === '-v' || command === '--version') {
        console.log('VelociForge Engine v1.0.0 (vforge)');
        return;
    }

    try {
        if (command === 'pack') {
            Logger.banner();
            const algoIndex = args.indexOf('--algo');
            const algo = algoIndex !== -1 ? args[algoIndex + 1] : 'gzip';
            const encryptIndex = args.indexOf('--encrypt');
            const encryptKey = encryptIndex !== -1 ? args[encryptIndex + 1] : null;

            const res = await CompressorEngine.pack({ algo, encryptKey });
            Logger.success('VelociForge Archiving Completed Successfully!');
            Logger.metric('Output File', path.basename(res.archivePath));
            Logger.metric('Original Directory Size', Logger.formatBytes(res.originalSize));
            Logger.metric('Compressed Size', Logger.formatBytes(res.archiveSize), `(${res.manifest.metrics.compressionRatio} saved)`);
            Logger.metric('Execution Time', res.durationMs);
            Logger.metric('Lockfile SHA-256', res.manifest.fingerprint.substring(0, 24) + '...');
        
        } else if (command === 'ci' || command === 'restore' || command === 'unpack') {
            Logger.banner();
            const force = args.includes('--force');
            const decryptIndex = args.indexOf('--decrypt');
            const decryptKey = decryptIndex !== -1 ? args[decryptIndex + 1] : null;

            const res = await UnpackerEngine.restore({ force, decryptKey });
            if (res.cached) {
                Logger.success(`⚡ [ZERO-DELAY] ${res.message}`);
            } else {
                Logger.success(`🚀 [EXTRACTED] ${res.message}`);
            }

        } else if (command === 'inspect') {
            Logger.banner();
            const manifestPath = path.resolve(process.cwd(), '.vforge.json');
            if (!fs.existsSync(manifestPath)) {
                Logger.error('No .vforge.json manifest found in current directory.');
                return;
            }
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            Logger.info('Bundle Metadata & Cryptographic Manifest:');
            console.log(JSON.stringify(manifest, null, 2));

        } else if (command === 'bench') {
            Logger.banner();
            await BenchmarkEngine.runBenchmark();

        } else if (command === 'security' || command === 'audit') {
            Logger.banner();
            Logger.info('Running VelociForge Security Audit & License Scan...');
            const report = SecurityEngine.audit();
            Logger.metric('Packages Scanned', report.totalScanned);
            Logger.metric('Flagged Copyleft Licenses', report.flaggedLicenses.length);
            Logger.metric('Suspicious Postinstall Scripts', report.suspiciousScripts.length);
            if (report.flaggedLicenses.length > 0) {
                console.log('\n' + colors.yellow + 'Flagged License Issues:' + colors.reset);
                console.log(JSON.stringify(report.flaggedLicenses, null, 2));
            }
            if (report.suspiciousScripts.length > 0) {
                console.log('\n' + colors.yellow + 'Suspicious Install Scripts:' + colors.reset);
                console.log(JSON.stringify(report.suspiciousScripts, null, 2));
            }
            if (report.flaggedLicenses.length === 0 && report.suspiciousScripts.length === 0) {
                Logger.success('No critical security vulnerabilities or copyleft compliance risks found!');
            }

        } else if (command === 'ui') {
            Logger.banner();
            const portIdx = args.indexOf('--port');
            const port = portIdx !== -1 ? parseInt(args[portIdx + 1], 10) : 3456;
            const UIServer = require('./ui/server');
            await UIServer.start(port);

        } else if (command === 'monorepo') {
            Logger.banner();
            const repo = MonorepoEngine.detectMonorepo();
            Logger.info(`Monorepo Detection Result:`);
            Logger.metric('Is Monorepo', repo.isMonorepo ? 'YES' : 'NO');
            Logger.metric('Workspace Type', repo.type);
            Logger.metric('Detected Workspaces', repo.workspaces.length > 0 ? repo.workspaces.join(', ') : 'None');

        } else if (command === 'push') {
            Logger.banner();
            const targetUrl = args[1] || 's3://vforge-ci-cache/bundles/default.vforge';
            await RemoteEngine.pushRemote(targetUrl);

        } else if (command === 'list' || command === 'ls') {
            Logger.banner();
            const ListerEngine = require('./core/lister');
            await ListerEngine.listPackages();

        } else if (command === 'p2p' || command === 'lan') {
            Logger.banner();
            const P2PEngine = require('./core/p2p');
            const subCmd = args[1];
            if (subCmd === 'pull') {
                const peerUrl = args[2] || 'http://localhost:3457';
                await P2PEngine.pullFromPeer(peerUrl);
            } else {
                const port = args[1] && !isNaN(args[1]) ? parseInt(args[1], 10) : 3457;
                await P2PEngine.startP2PServer(port);
            }

        } else if (command === 'guard' || command === 'sandbox') {
            Logger.banner();
            const GuardEngine = require('./core/guard');
            GuardEngine.inspect();

        } else if (command === 'diff' || command === 'delta') {
            Logger.banner();
            const DiffEngine = require('./core/diff');
            DiffEngine.compareManifests(args[1], args[2]);

        } else if (command === 'edge' || command === 'cloud') {
            Logger.banner();
            const EdgeEngine = require('./core/edge');
            EdgeEngine.generateGitHubActions();

        } else if (command === 'docs') {
            Logger.banner();
            const { spawn } = require('child_process');
            const docsPath = path.join(__dirname, '..', 'docs');
            const vitepressBin = path.join(__dirname, '..', 'node_modules', 'vitepress', 'bin', 'vitepress.js');
            
            Logger.info('Launching VitePress Interactive Documentation Engine at http://localhost:4000 ...');
            spawn(process.execPath, [vitepressBin, 'dev', docsPath, '--port', '4000'], {
                stdio: 'inherit',
                cwd: path.join(__dirname, '..')
            });

        } else if (command === 'doctor') {
            Logger.banner();
            const DoctorEngine = require('./core/doctor');
            DoctorEngine.diagnose();

        } else if (command === 'shrink') {
            Logger.banner();
            const ShrinkEngine = require('./core/shrink');
            ShrinkEngine.shrink();

        } else if (command === 'snapshot') {
            Logger.banner();
            const SnapshotEngine = require('./core/snapshot');
            const subCmd = args[1] || 'list';
            const name = args[2] || '';
            if (subCmd === 'create') {
                SnapshotEngine.createSnapshot(name);
            } else if (subCmd === 'restore') {
                SnapshotEngine.restoreSnapshot(name);
            } else {
                SnapshotEngine.listSnapshots();
            }

        } else if (command === 'advisor' || command === 'optimize') {
            Logger.banner();
            const AdvisorEngine = require('./core/advisor');
            await AdvisorEngine.analyze();

        } else if (command === 'export') {
            Logger.banner();
            const ExporterEngine = require('./core/exporter');
            ExporterEngine.exportDockerLayer();

        } else if (command === 'run' || command === 'boot') {
            Logger.banner();
            const targetCmd = args.slice(1).join(' ');
            if (!targetCmd) {
                Logger.error("Please specify a command to run, e.g. `vforge run npm start` or `vforge run node server.js`");
                return;
            }
            const RunnerEngine = require('./core/runner');
            await RunnerEngine.run(targetCmd);

        } else if (command === 'clean') {
            Logger.banner();
            const removeAll = args.includes('--all') || args.includes('--purge');
            const files = fs.readdirSync(process.cwd());
            let cleaned = 0;
            for (const f of files) {
                if (f.startsWith('.vforge.tmp') || f.startsWith('.vforge-unpack-tmp') || (removeAll && (f === '.vforge' || f === '.vforge.json'))) {
                    fs.rmSync(path.join(process.cwd(), f), { recursive: true, force: true });
                    cleaned++;
                }
            }
            if (removeAll) {
                Logger.success(`Cleaned ${cleaned} VelociForge archives and temporary files (Purged .vforge & manifest).`);
            } else {
                Logger.success(`Cleaned ${cleaned} temporary VelociForge swap files. (Tip: Use 'vforge clean --all' to also remove .vforge archive)`);
            }

        } else {
            Logger.error(`Unknown command '${command}'. Run 'vforge --help' to view all available commands.`);
        }
    } catch (err) {
        Logger.error(err.message);
        process.exit(1);
    }
}

module.exports = { main };
