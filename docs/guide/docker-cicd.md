# 🐳 Docker & CI/CD Integration

VelociForge integrates seamlessly into Docker builds and any CI platform to deliver the fastest possible dependency restoration.

---

## 🐳 Docker Layer Optimization

Use `vforge export` to generate an optimized `Dockerfile` that uses `.vforge` as the cached dependency layer:

```bash
vforge export
```

**Example generated Dockerfile:**

```dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Install VelociForge
RUN npm install -g velociforge

# Copy only the archive and manifest (not node_modules/)
COPY .vforge .vforge
COPY .vforge.json .vforge.json

# Restore in sub-milliseconds
RUN vforge ci

# Copy source code
COPY . .

# Start using the ephemeral runner
CMD ["vforge", "run", "node", "server.js"]
```

Docker cache is invalidated **only** when the `.vforge` archive changes — not on every source code change.

---

## ☁️ GitHub Actions (Edge CI)

Generate a ready-to-use workflow automatically:

```bash
vforge edge
```

This writes `.github/workflows/velociforge-ci.yml` with:
- Exact lockfile SHA-256 cache key
- `vforge ci` restoration step (0.00ms warm, 1.45ms cold)
- Ephemeral `vforge run` for test execution

See the full [Edge CI guide](/guide/edge-ci) for details.

---

## 🔁 GitLab CI / CircleCI

Adapt the pattern for other platforms:

```yaml
# GitLab CI example
cache:
  key: vforge-${CI_COMMIT_SHA}
  paths:
    - .vforge

install:
  script:
    - npm install -g velociforge
    - vforge ci
```
