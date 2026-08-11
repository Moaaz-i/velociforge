# 🛡️ Security, Guard & SBOM

VelociForge ships with two layers of security built-in.

---

## Layer 1 — `vforge security` (CVE & License Audit)

Scans all installed packages for known vulnerabilities and copyleft license risks:

```bash
vforge security
```

**What it checks:**
- ⚠️ Packages flagged with GPL / AGPL copyleft licenses (viral risk in commercial products).
- 🚨 Packages with suspicious `postinstall` shell scripts.
- 📋 Generates **CycloneDX 1.4** and **SPDX 2.3** SBOM manifests automatically.

---

## Layer 2 — `vforge guard` (Zero-Trust Malicious Script Inspector)

Scans lifecycle scripts (`preinstall`, `postinstall`, `install`) of **all installed packages** for dangerous shell patterns:

```bash
vforge guard
```

**Detected Patterns:**
| Pattern | Risk |
| :--- | :--- |
| `curl -s \| bash` | Remote code execution |
| `wget` with pipe | Remote payload delivery |
| `eval(Buffer.from(...))` | Obfuscated code execution |
| `base64 -d` | Encoded payload decoding |
| `.ssh/id_rsa` access | SSH private key harvesting |
| `process.env.AWS_` access | Cloud credential theft |

---

## 📋 SBOM — Software Bill of Materials

Every `vforge pack` operation automatically generates a **CycloneDX 1.4** SBOM inside `.vforge.json`:

```bash
vforge inspect   # View full SBOM in terminal
```

The SBOM records:
- All dependency names and versions.
- Package URLs (`pkg:npm/package@version`).
- Timestamp, generator tool, and lockfile fingerprint.
