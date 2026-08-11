# 🩺 Troubleshooting & Diagnostics

Common questions and diagnostic procedures for VelociForge.

---

## 🩺 Diagnostics (`vforge doctor`)

Run self-diagnostics to verify system compatibility, node versions, and directory symlink permissions:

```bash
vforge doctor
```

---

## 🧹 Cleaning Cache & Swap Files

To clean temporary swap files:

```bash
vforge clean
```

To purge `.vforge` archives and manifests completely:

```bash
vforge clean --all
```
