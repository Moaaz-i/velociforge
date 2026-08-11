# 🛡️ Security Audit & License Compliance

VelociForge includes a built-in zero-dependency supply chain security scanner and Software Bill of Materials (SBOM) generator.

---

## 🔍 Running Security Audits

Inspect your installed dependencies for known CVE security vulnerabilities, copyleft viral licenses (e.g. GPL / AGPL), and suspicious `postinstall` shell hooks:

```bash
vforge security
```

---

## 📋 CycloneDX 1.4 & SPDX 2.3 SBOM Generation

During every `vforge pack` run, VelociForge automatically generates a compliant **CycloneDX 1.4 SBOM Manifest** inside `.vforge.json`.

Example manifest structure:

```json
{
  "generator": "VelociForge Engine v1.0.0",
  "fingerprint": "938331c5a1968a6d7a0c5f9c...",
  "sbom": {
    "bomFormat": "CycloneDX",
    "specVersion": "1.4",
    "components": [
      {
        "type": "library",
        "name": "velociradix",
        "version": "6.2.1",
        "purl": "pkg:npm/velociradix@6.2.1"
      }
    ]
  }
}
```
