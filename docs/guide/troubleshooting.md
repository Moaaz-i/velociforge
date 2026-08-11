# 🩺 Troubleshooting & Diagnostics

Common issues and diagnostic procedures for VelociForge.

---

## 🩺 Run Self-Diagnostics

Check system compatibility, RAM-disk support, cache location, and symlink availability:

```bash
vforge doctor
```

---

## 🔧 Common Issues

### `vforge: command not found`

VelociForge was not installed globally. Run:
```bash
npm install -g velociforge
```
Or use `npx velociforge` for zero-install execution.

---

### `vforge ci` fails — Archive not found

The `.vforge` archive doesn't exist yet. Pack first:
```bash
vforge pack
vforge ci
```

---

### `vforge diff` — "Both manifest target paths must exist"

One of the two manifest paths you're comparing doesn't exist. Check available snapshots:
```bash
vforge snapshot list
```
Then compare with a valid snapshot:
```bash
vforge diff .vforge.json .vforge-snapshots/<name>/.vforge.json
```

---

### `vforge p2p pull` — Connection refused

Ensure the sharing node is running on the remote machine:
```bash
# On the sharing machine:
vforge p2p
# Confirm the address shown, e.g.: http://192.168.1.21:3457

# Then on your machine:
vforge p2p pull http://192.168.1.21:3457
```

---

## 🧹 Cleaning Cache & Swap Files

```bash
vforge clean           # Remove temp swap files only
vforge clean --all     # Also remove the .vforge archive
```
