# 🚀 Installation & Getting Started

Getting started with **VelociForge** (`vforge` / `velociforge`) is fast and straightforward.

---

## 📥 Installation

Install VelociForge globally on your development system:

```bash
npm install -g velociforge
```

Verify installation:

```bash
vforge --version
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
