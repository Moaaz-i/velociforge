# 🐳 Docker & CI/CD Integration Guide

VelociForge optimizes Docker container builds and CI/CD pipelines for maximum caching efficiency.

---

## 🐳 Dockerfile Layer Generation

Generate an optimized Docker layer setup:

```bash
vforge export
```

---

## ⚙️ GitHub Actions Workflow

Add `.github/workflows/vforge-ci.yml`:

```yaml
name: VelociForge CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g velociforge
      - run: vforge ci
      - run: npm test
```
