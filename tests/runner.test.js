/**
 * VelociForge Automated Test Suite
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const CompressorEngine = require('../src/core/compressor');
const UnpackerEngine = require('../src/core/unpacker');
const ManifestEngine = require('../src/core/manifest');
const SecurityEngine = require('../src/core/security');
const { Logger } = require('../src/utils/logger');

async function runTests() {
    Logger.banner();
    Logger.info('Starting VelociForge Automated Verification Suite...');

    const projectDir = path.resolve(__dirname, '..');

    // Test 1: Lockfile fingerprinting
    Logger.info('Test 1: Lockfile Fingerprint Generation...');
    const fingerprint = ManifestEngine.getLockfileFingerprint(projectDir);
    assert.strictEqual(typeof fingerprint, 'string', 'Fingerprint should be a string');
    assert.strictEqual(fingerprint.length, 64, 'SHA-256 fingerprint must be 64 hex characters');
    Logger.success('Test 1 Passed: Lockfile SHA-256 fingerprint generated correctly.');

    // Test 2: SBOM Generation
    Logger.info('Test 2: Software Bill of Materials (SBOM) Generation...');
    const sbom = ManifestEngine.generateSBOM(projectDir);
    assert.strictEqual(sbom.bomFormat, 'CycloneDX', 'SBOM format should be CycloneDX');
    assert.ok(Array.isArray(sbom.components), 'SBOM components must be an array');
    Logger.success('Test 2 Passed: CycloneDX SBOM structure verified.');

    // Test 3: Packing node_modules
    Logger.info('Test 3: Packing node_modules into virtual archive...');
    const packRes = await CompressorEngine.pack({ cwd: projectDir, algo: 'gzip' });
    assert.ok(fs.existsSync(packRes.archivePath), 'Virtual archive file must exist');
    assert.ok(fs.existsSync(packRes.manifestPath), 'Manifest file must exist');
    Logger.success(`Test 3 Passed: Archive created (${Logger.formatBytes(packRes.archiveSize)}) in ${packRes.durationMs}.`);

    // Test 4: Unpacking with zero-delay cache checking
    Logger.info('Test 4: Zero-Delay Unpacking Verification...');
    const unpackRes = await UnpackerEngine.restore({ cwd: projectDir, force: false });
    assert.strictEqual(unpackRes.cached, true, 'Subsequent restoration must be zero-delay cached');
    Logger.success(`Test 4 Passed: ${unpackRes.message}`);

    // Test 4b: Forced double unpacking verification (Resilience against double extraction)
    Logger.info('Test 4b: Forced Double Unpacking Resilience Test...');
    const doubleUnpackRes = await UnpackerEngine.restore({ cwd: projectDir, force: true, useSymlink: false });
    assert.ok(fs.existsSync(path.join(projectDir, 'node_modules', 'tar')), 'Sub-package tar must exist after double unpacking');
    assert.ok(!fs.existsSync(path.join(projectDir, 'node_modules', 'node_modules')), 'No recursive node_modules/node_modules allowed');
    Logger.success('Test 4b Passed: Double extraction resilience verified successfully.');

    // Test 5: Security audit
    Logger.info('Test 5: Security & License Audit...');
    const auditRes = SecurityEngine.audit(projectDir);
    assert.ok(auditRes.totalScanned >= 0, 'Audit must count scanned packages');
    Logger.success(`Test 5 Passed: Scanned ${auditRes.totalScanned} packages successfully.`);

    console.log('\n✔ ALL 5 VELOCIFORGE INTEGRATION TESTS PASSED PERFECTLY!\n');
}

runTests().catch(err => {
    console.error('Test Suite Failed:', err);
    process.exit(1);
});
