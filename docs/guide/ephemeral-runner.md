# 🔄 Ephemeral Lifecycle Runner (`vforge run`)

The **Ephemeral Runner Engine** allows running your Node.js code or server with **Zero Permanent Disk Footprint**.

---

## ⚡ How It Works

1. **Pre-flight Mounting (0.70ms)**:
   Instantly mounts a **Zero-Copy Virtual Symlink Junction** from `~/.velociforge/cache` to `./node_modules`.

2. **Runtime Execution**:
   Executes your target command (`npm start`, `node server.js`, `tsx server.ts`) directly.

3. **Post-flight Cleanup (2.09ms)**:
   When the process exits or `Ctrl + C` is pressed:
   - Checks if dependencies were modified. If unchanged, skips re-pack.
   - Unmounts the virtual symlink junction.
   - Restores 0-byte disk footprint.
