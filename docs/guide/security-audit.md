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
