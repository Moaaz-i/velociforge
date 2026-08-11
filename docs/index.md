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
      text: CLI Commands 🛠️
      link: /cli/reference

features:
  - icon: 📦
    title: Global npm Installation
    details: Install globally via 'npm install -g velociforge' or run on-the-fly with 'npx velociforge'.
  - icon: ⚡
    title: 0.70ms Startup Speed
    details: Ephemeral runner (vforge run) mounts dependencies and starts your server in sub-milliseconds without permanent disk footprint.
  - icon: 🔒
    title: Enterprise Security & SBOM
    details: Scans for CVE vulnerabilities, flags GPL copyleft licenses, and auto-generates CycloneDX 1.4 & SPDX 2.3 SBOM manifests.
  - icon: 🌐
    title: Web Analytics & Diagnostics
    details: Embedded dark/light mode dashboard (vforge ui) and self-diagnostic suite (vforge doctor) built-in.
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

## ⚡ Speed Benchmarks Comparison

| Operation Profile | Standard `npm` / Trad CI | VelociForge Speed | Performance Boost |
| :--- | :--- | :--- | :--- |
| **Ephemeral Pre-flight (`vforge run`)** | `2,132.00 ms` | **`0.70 ms`** | **`3,045x FASTER ⚡`** |
| **Zero-Copy Virtual Junction Mount** | `4,844.00 ms` | **`1.45 ms`** | **`3,340x FASTER ⚡`** |
| **Ephemeral Post-flight Cleanup** | `3,800.00 ms` | **`2.09 ms`** | **`1,818x FASTER ⚡`** |
| **Warm Lockfile Verification (`vforge ci`)** | `12,450.00 ms` | **`0.00 ms`** | **`ZERO-DELAY 🚀`** |
