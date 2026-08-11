# 🚀 Installation & Getting Started

Getting started with **VelociForge** (`vforge` / `velociforge`) is fast and straightforward.

---

## 📥 Installation Methods

### Method 1: Global Installation via npm (Recommended)

Install VelociForge globally on your development machine or CI server:

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

:::

Verify the installation:

```bash
vforge --version
# VelociForge Engine v1.1.1 (vforge)
```

---

### Method 2: Zero-Install Execution via npx

Run commands directly without permanent installation:

```bash
npx velociforge run npm start
```

---

### Method 3: Local Project Dependency

Add VelociForge as a development dependency in your `package.json`:

```bash
npm install -D velociforge
```

Then add scripts to `package.json`:

```json
{
  "scripts": {
    "vpack": "vforge pack",
    "vci": "vforge ci",
    "vrun": "vforge run npm start"
  }
}
```

---

## 🏁 Basic Workflow

### Step 1 — Pack Dependencies
Convert `node_modules` into a single compressed `.vforge` archive:

```bash
vforge pack
```

### Step 2 — Ephemeral Run (Sub-Millisecond Startup)
Mount zero-copy symlink, run your server, and auto-clean disk on exit:

```bash
vforge run npm start
```

### Step 3 — CI Restoration (Zero-Delay)
Restore dependencies in CI from `.vforge` archive:

```bash
vforge ci
```

### Step 4 — Inspect Archive Contents
List all installed packages inside `.vforge` in **0.25ms**:

```bash
vforge list
```

### Step 5 — Security & Guard Check
Scan for CVE vulnerabilities and malicious lifecycle scripts:

```bash
vforge security   # CVE & license scan
vforge guard      # Zero-Trust malicious script detector
```

### Step 6 — Self-Diagnostic Doctor
Check system compatibility, cache location, and symlink support:

```bash
vforge doctor
```
