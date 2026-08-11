# 🔍 Archive Diff Visualizer — `vforge diff`

The **Diff Visualizer** recursively scans your project for all `.vforge.json` manifests and lets you compare any two — computing exact package deltas and archive size differences.

---

## 🚀 Usage

### Auto-compare current vs. latest snapshot

```bash
vforge diff
```

### Compare two specific manifest files

```bash
vforge diff .vforge.json .vforge-snapshots/my-backup/.vforge.json
```

---

## 📊 Example Output

```
ℹ [VelociForge] Comparing manifests:
  • Target A: .vforge.json
  • Target B: .vforge-snapshots/my-backup/.vforge.json

  • Archive Size Delta     : +1.23 MB
  • New Packages Added     : 3
  • Packages Removed       : 1
  • Versions Updated       : 5

✔ [VelociForge] Diff complete.
```

---

## 🔄 Recursive Manifest Discovery

`vforge diff` automatically walks the project tree to discover all `.vforge.json` files before comparison. This means it works seamlessly with:
- `.vforge-snapshots/` directories
- Nested monorepo workspaces
- CI artifact directories

---

## 📋 When to Use Diff

| Scenario | Command |
| :--- | :--- |
| Before merging a branch — compare dependency states | `vforge diff .vforge.json .vforge-snapshots/before-merge.json` |
| Audit a snapshot before restoring it | `vforge diff` |
| Review what changed in a new release | `vforge diff` |

---

## ⚠️ Error Handling

If either manifest path doesn't exist, VelociForge reports:

```
✖ [VelociForge Error] Both manifest target paths must exist to calculate delta.
```

Use `vforge snapshot list` to see all available snapshots before running a diff.
