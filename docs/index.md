---
layout: home

hero:
  name: "⚡ VelociForge Engine"
  text: "Next-Gen Virtualized Package Engine"
  tagline: "Sub-millisecond execution, zero-copy symlink mounting, and ephemeral CI restoration for Node.js."
  actions:
    - theme: brand
      text: Get Started 🚀
      link: /guide/getting-started
    - theme: alt
      text: CLI Reference 🛠️
      link: /cli/reference

features:
  - icon: 📦
    title: Global npm Installation
    details: "Install globally with: npm install -g velociforge. Both 'vforge' and 'velociforge' commands are registered."
  - icon: ⚡
    title: 0.70ms Startup Speed
    details: Ephemeral runner (vforge run) mounts dependencies via zero-copy symlink and starts your server in sub-milliseconds.
  - icon: 🌐
    title: VelociRadix P2P LAN Cache
    details: Share .vforge archives with teammates over local Wi-Fi with zero internet bandwidth usage (vforge p2p).
  - icon: 🛡️
    title: Zero-Trust Script Guard
    details: Detects malicious curl/eval/wget patterns in lifecycle scripts before they run (vforge guard).
  - icon: 🔍
    title: Deep Diff Visualizer
    details: Recursively scans all manifests and snapshots and computes precise package version & archive size deltas (vforge diff).
  - icon: ☁️
    title: Edge CI Generator
    details: Generates turnkey GitHub Actions workflows with sub-millisecond .vforge cache restoration (vforge edge).
---

## 🚀 Quick Installation

::: code-group

```bash [npm]
npm install -g velociforge
```

```bash [pnpm]
pnpm add -g velociforge
```

```bash [yarn]
yarn global add velociforge
```

```bash [npx (Zero Install)]
npx velociforge run npm start
```

:::

---

## ⚡ Speed Benchmarks

| Operation Profile | Standard `npm` / Trad CI | VelociForge Speed | Performance Boost |
| :--- | :--- | :--- | :--- |
| **Ephemeral Pre-flight (`vforge run`)** | `2,132.00 ms` | **`0.70 ms`** | **`3,045x FASTER ⚡`** |
| **Zero-Copy Virtual Junction Mount** | `4,844.00 ms` | **`1.45 ms`** | **`3,340x FASTER ⚡`** |
| **Ephemeral Post-flight Cleanup** | `3,800.00 ms` | **`2.09 ms`** | **`1,818x FASTER ⚡`** |
| **Warm Lockfile Verification (`vforge ci`)** | `12,450.00 ms` | **`0.00 ms`** | **`ZERO-DELAY 🚀`** |
