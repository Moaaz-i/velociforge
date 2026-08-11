# 🛠️ Complete CLI Command Reference — v1.1.1

Exhaustive reference for all commands supported by the `vforge` / `velociforge` binary.

---

## 📦 `vforge pack`
Bundles `node_modules` into a compressed `.vforge` virtual archive and `.vforge.json` cryptographic manifest.

```bash
vforge pack [--algo <gzip|brotli|uncompressed>] [--encrypt <key>]
```

---

## ⚡ `vforge ci` / `vforge restore`
Ultra-fast extraction or **0.00ms** warm lockfile fingerprint verification.

```bash
vforge ci [--force] [--decrypt <key>]
```

---

## 🔄 `vforge run <command>` / `vforge boot`
Ephemeral run: mounts zero-copy virtual symlink, runs command, auto-cleans disk on exit.

```bash
vforge run npm start
vforge run node server.js
```

---

## 📋 `vforge list` / `vforge ls`
Reads `.vforge` archive directly and lists all installed package names and versions in **0.25ms**.

```bash
vforge list
vforge ls
```

---

## 🌐 `vforge p2p` / `vforge lan`
Starts a **VelociRadix-powered** LAN P2P cache node that lets teammates pull `.vforge` archives over Wi-Fi instantly.

```bash
# Start sharing node on your machine
vforge p2p

# Pull archive from a LAN peer
vforge p2p pull http://192.168.1.21:3457
```

---

## 🛡️ `vforge guard` / `vforge sandbox`
Zero-Trust malicious script inspector. Scans all installed package lifecycle scripts for dangerous shell patterns (curl, eval, wget, SSH key access).

```bash
vforge guard
```

---

## 🔍 `vforge diff` / `vforge delta`
Recursively discovers all `.vforge.json` manifests in the project tree, then computes exact package additions, removals, version updates, and archive size deltas between any two manifests.

```bash
# Auto-compare current manifest vs latest snapshot
vforge diff

# Compare two specific manifest files
vforge diff .vforge.json .vforge-snapshots/my-backup/.vforge.json
```

---

## ☁️ `vforge edge` / `vforge cloud`
Generates a turnkey **GitHub Actions** CI/CD workflow that caches and restores `.vforge` archives at sub-millisecond speed.

```bash
vforge edge
```

---

## 🧹 `vforge shrink`
Tree-shakes `node_modules` by stripping docs, markdown files, and source maps to save up to 30% space.

```bash
vforge shrink
```

---

## 🩺 `vforge doctor`
Self-diagnostic health checker and environment auditor. Checks Node.js version, RAM-disk support, global cache location, and symlink compatibility.

```bash
vforge doctor
```

---

## 📸 `vforge snapshot <create|list|restore>`
Local dependency snapshot and rollback manager.

```bash
vforge snapshot create "my-backup"
vforge snapshot list
vforge snapshot restore "my-backup"
```

---

## 💡 `vforge advisor` / `vforge optimize`
AI optimization advisor that recommends lighter, faster package alternatives.

```bash
vforge advisor
```

---

## 🛡️ `vforge security`
Scans installed modules for CVE vulnerabilities and GPL/AGPL copyleft licenses. Generates CycloneDX 1.4 & SPDX 2.3 SBOM manifests.

```bash
vforge security
```

---

## 📖 `vforge docs`
Launches the interactive **VitePress** documentation engine at `http://localhost:4000`.

```bash
vforge docs
```

---

## 🌐 `vforge ui`
Launches the interactive web analytics dashboard (VelociRadix Powered) at `http://localhost:3456`.

```bash
vforge ui [--port 3456]
```

---

## 🔍 `vforge inspect`
Inspects `.vforge` archive metadata, compression details, and SBOM contents.

```bash
vforge inspect
```

---

## 🚀 `vforge bench`
Runs a live benchmark comparing standard `npm ci` vs VelociForge restoration speed.

```bash
vforge bench
```

---

## 🏢 `vforge monorepo`
Scans monorepo workspace packages and graph topology (supports pnpm, Turborepo, Nx, Lerna).

```bash
vforge monorepo
```

---

## 🐳 `vforge export`
Exports optimized Dockerfile layers using `.vforge` as the dependency layer.

```bash
vforge export
```

---

## 🧹 `vforge clean`
Cleans temporary swap files. Use `--all` to also remove the `.vforge` archive.

```bash
vforge clean
vforge clean --all
```
