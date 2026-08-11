# 🔄 Ephemeral Runner — `vforge run`

The ephemeral runner is VelociForge's flagship feature — it mounts `node_modules` as a zero-copy virtual symlink, runs your command, and then unmounts and cleans up automatically when the process exits.

---

## ⚡ How It Works

```
vforge run npm start
     │
     ▼
1. Pre-flight (0.70ms)
   → Reads .vforge.json fingerprint
   → If global cache hit: mount symlink (1.45ms) — no extraction needed
   → If cold start: extract to ~/.velociforge/cache/<hash>, then symlink
     │
     ▼
2. Spawn Process
   → node_modules/.bin injected into PATH
   → Your server starts as normal
     │
     ▼
3. Post-flight Cleanup (2.09ms)
   → Dependencies unchanged? Skip re-pack.
   → Unmount symlink / remove node_modules
   → Zero disk footprint restored
```

---

## 🚀 Usage

```bash
# Run any npm script
vforge run npm start
vforge run npm run dev
vforge run npm test

# Run any Node.js command directly
vforge run node server.js
vforge run tsx server.ts
```

---

## 🧠 Smart Dirty Detection

VelociForge tracks the `package.json` and lockfile SHA-256 fingerprint during the session.

- If dependencies **were not changed** during the run → skips re-packing.
- If dependencies **were modified** → automatically re-packs to a fresh `.vforge` archive before cleanup.
