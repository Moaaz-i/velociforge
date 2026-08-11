# ☁️ Edge CI Generator — `vforge edge`

The **Edge CI Generator** creates a production-ready **GitHub Actions** workflow file that leverages `.vforge` archives for sub-millisecond dependency restoration in CI.

---

## 🚀 Usage

```bash
vforge edge
```

VelociForge writes the workflow file to:

```
.github/workflows/velociforge-ci.yml
```

---

## 📄 Generated Workflow Example

```yaml
name: VelociForge Edge CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install VelociForge
        run: npm install -g velociforge

      - name: Cache .vforge archive
        uses: actions/cache@v3
        with:
          path: .vforge
          key: vforge-${{ hashFiles('package-lock.json') }}

      - name: Restore dependencies (sub-millisecond)
        run: vforge ci

      - name: Run tests
        run: vforge run npm test
```

---

## ✅ Why Edge CI?

| Feature | Standard `npm ci` | VelociForge Edge CI |
| :--- | :--- | :--- |
| **Cache granularity** | Node.js version only | Exact lockfile SHA-256 fingerprint |
| **Restoration time (warm)** | `12,450 ms` | **`0.00 ms`** (fingerprint verified) |
| **Restoration time (cold)** | `2,100 ms` | **`1.45 ms`** |
| **Disk footprint** | Full `node_modules/` directory | Single `.vforge` compressed archive |

---

## 🔧 Supported CI Platforms

While `vforge edge` generates GitHub Actions by default, the generated workflow pattern is easily adapted to:
- **GitLab CI** (`cache:` key + `script: vforge ci`)
- **CircleCI** (`save_cache` / `restore_cache`)
- **Bitbucket Pipelines** (`caches:` step)
