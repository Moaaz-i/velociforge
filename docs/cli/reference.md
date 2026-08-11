# 🛠️ Complete CLI Command Reference

Exhaustive reference for all commands supported by the `vforge` / `velociforge` binary.

---

## 📦 `vforge pack`
Bundles `node_modules` into optimized `.vforge` virtual archive and `.vforge.json` manifest.

```bash
vforge pack [--algo <gzip|brotli|uncompressed>] [--encrypt <key>]
```

---

## ⚡ `vforge ci` / `vforge restore`
Ultra-fast extraction or 0.00ms warm lockfile fingerprint verification.

```bash
vforge ci [--force] [--decrypt <key>]
```

---

## 🔄 `vforge run <command>` / `vforge boot`
Ephemeral run: mounts zero-copy virtual symlink, runs command, auto-cleans on exit.

```bash
vforge run npm start
vforge run node server.js
```

---

## 🧹 `vforge shrink`
Tree-shakes `node_modules` by stripping docs, markdown files, and source maps to save 30% space.

```bash
vforge shrink
```

---

## 🩺 `vforge doctor`
Self-diagnostic health checker & environment auditor.

```bash
vforge doctor
```

---

## 📸 `vforge snapshot <create|list|restore>`
Local dependency snapshot & rollback manager.

```bash
vforge snapshot create "my-backup"
vforge snapshot list
vforge snapshot restore "my-backup"
```

---

## 💡 `vforge advisor` / `vforge optimize`
AI optimization advisor recommending lighter package alternatives.

```bash
vforge advisor
```

---

## 🛡️ `vforge security`
Scans installed modules for CVE vulnerabilities and GPL copyleft licenses.

```bash
vforge security
```

---

## 🌐 `vforge ui`
Launches interactive browser analytics dashboard at `http://localhost:3456`.

```bash
vforge ui [--port 3456]
```
