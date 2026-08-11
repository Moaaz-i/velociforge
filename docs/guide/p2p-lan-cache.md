# 🌐 P2P LAN Cache — `vforge p2p`

The **VelociRadix-powered** LAN P2P cache lets you share `.vforge` archives with teammates on the same Wi-Fi network **instantly** — no internet, no cloud storage.

---

## ⚙️ Architecture

```
  [Your Machine]                [Teammate Machine]
  vforge p2p                    vforge p2p pull http://192.168.1.x:3457
       │                                 │
       │    VelociRadix P2P Server       │
       │◄────────────────────────────────┘
       │
  Serves .vforge archive
  over LAN port 3457
```

The sharing node auto-discovers `.vforge` archives in the current project and serves them over **port 3457** using the **VelociRadix HTTP server** framework.

---

## 🚀 Usage

### Start Sharing Node (Server Side)

```bash
vforge p2p
# ✔ [VelociForge P2P] VelociRadix P2P node live → http://0.0.0.0:3457
# ✔ [VelociForge P2P] Serving: my-project.vforge
```

### Pull Archive from a Peer (Client Side)

```bash
vforge p2p pull http://192.168.1.21:3457
# → Downloads .vforge archive from teammate's machine at full LAN speed
```

---

## ✅ Why Use P2P Cache?

- ⚡ **LAN-speed transfer** (hundreds of MB/s vs. cloud CDN throttling).
- 📡 **Zero internet dependency** in offline dev environments.
- 🔒 **Local-only** — never uploads your dependencies to any external service.
- 🏢 **Great for pair programming** and onboarding new team members instantly.

---

## 🔧 VelociRadix Under the Hood

VelociForge uses the **`velociradix`** framework for all networking operations — the same engine powering the web dashboard. `velociradix` provides:
- High-speed async HTTP routing.
- Streaming file transfer support.
- Sub-millisecond route resolution.
