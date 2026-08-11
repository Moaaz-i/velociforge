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
# or
velociforge --version
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

Add npm scripts to `package.json`:

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

### 1. Pack Project Dependencies
Convert `node_modules` into a single compressed `.vforge` archive:

```bash
vforge pack
```

### 2. Run Server Ephemerally (Sub-Millisecond Startup)
Unpack dependencies in memory, run script, and clean disk on exit:

```bash
vforge run npm start
```

### 3. Run Self-Diagnostic Doctor
Check system compatibility and RAM-disk mounts:

```bash
vforge doctor
```

### 4. Inspect Archive Contents
List all top-level installed libraries inside `.vforge` in 0.25ms:

```bash
vforge list
```
