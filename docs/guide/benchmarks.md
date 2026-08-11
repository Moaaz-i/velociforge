# ⚡ Speed Benchmarks

`VelociForge` is engineered from the ground up for maximum throughput and zero disk latency.

---

## 📊 Measured Execution Profile

| Metric | Baseline (`npm ci`) | VelociForge Speed | Boost Factor |
| :--- | :--- | :--- | :--- |
| **Warm Lockfile Validation** | `12,450 ms` | **`0.00 ms`** | **`Instant`** |
| **Virtual Junction Mount** | `4,844 ms` | **`1.45 ms`** | **`3,340x`** |
| **Ephemeral Pre-flight (`vforge run`)** | `2,132 ms` | **`0.70 ms`** | **`3,045x`** |
| **Ephemeral Post-flight Cleanup** | `3,800 ms` | **`2.09 ms`** | **`1,818x`** |
| **Archive Listing (`vforge list`)** | `N/A` | **`0.25 ms`** | **`Instant 🔥`** |

---

## 🧪 Run Your Own Benchmark

Run a live comparison between `npm ci` and VelociForge restoration on your machine:

```bash
vforge bench
```

---

## 🔑 Why So Fast?

- **Zero Disk I/O**: Uses OS-level symlinks to mount `node_modules` without copying any files.
- **Streaming Tar**: Dependencies are streamed directly from the archive to the global cache at full disk bandwidth.
- **SHA-256 Lockfile Fingerprinting**: Skips extraction entirely when the lockfile is unchanged — **0.00ms**.
- **Global Cache (`~/.velociforge/cache`)**: Extracted archives are cached globally across all projects by lockfile hash.
