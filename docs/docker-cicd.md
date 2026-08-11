# 🐳 Docker & CI/CD Integration Guide

VelociForge optimizes Docker container builds and CI/CD pipelines (GitHub Actions, GitLab CI, Bitbucket) for maximum caching efficiency.

---

## 🐳 Dockerfile Layer Generation

Generate an optimized Docker layer setup:

```bash
vforge export
```

This creates `Dockerfile.vforge`:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Copy VelociForge virtual archive & manifest
COPY .vforge .vforge.json ./

# Install VelociForge global CLI & restore in sub-milliseconds
RUN npm install -g velociforge && vforge ci

# Copy application source code
COPY . .

CMD ["npm", "start"]
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
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install -g velociforge
      - run: vforge ci
      - run: npm test
```
