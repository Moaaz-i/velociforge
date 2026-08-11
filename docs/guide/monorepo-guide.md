# 🏢 Monorepo & Multi-Workspace Setup

VelociForge natively supports monorepo workspace setups including **pnpm workspaces**, **Turborepo**, **Nx**, and **Lerna**.

---

## 🔍 Monorepo Auto-Detection

Check your monorepo workspace graph:

```bash
vforge monorepo
```

---

## 📦 Scoped Workspace Bundling

Pack dependencies for a specific sub-workspace:

```bash
vforge pack --workspace=@app/api
```
