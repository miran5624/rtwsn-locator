# AGENTS.md — Portable Anchors
### Offline WSN/MANET SOS System | Hackathon Edition
> **Project**: Portable Anchors — BLE Mesh SOS for Extreme Crowd Events (e.g., Kumbh Mela)
> **Stack**: React Native CLI · Android Only · `react-native-ble-plx` · Zustand
> **Team**: Miran · Samran · Sarfaraz · Adnan · Irfan
> **Prompt Sets**: Use `PROMPT_SETS_V4.md` — find your `--user_name` section and run prompts 1–5

---

## Trigger Tags (Ctrl+F your name in PROMPT_SETS_V4.md)

```
--user_miran     → Navigation Shell, Shared Contracts & Native Merge
--user_samran    → Android Native + Permissions (GO FIRST)
--user_sarfaraz  → Relay Engine (Background Role B)
--user_adnan     → Rescue Dashboard (Listener Role C)
--user_irfan     → SOS Broadcaster (Role A)
```

> **Rule**: You NEVER edit another person's files. You only import from them.
> **Rule**: If AI generates a file outside your folder — do not save it.

---

## Repo Structure (Canonical)

```
PortableAnchors/
├── android/                             ← SAMRAN ONLY
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       └── java/com/portableanchors/
│           ├── BLEForegroundService.kt
│           ├── BLEAdvertiserModule.kt
│           ├── BLEAdvertiserPackage.kt
│           ├── ForegroundServiceModule.kt
│           ├── ForegroundServicePackage.kt
│           ├── BootReceiver.kt
│           └── MainApplication.kt       ← MIRAN ONLY (Prompt 5, last)
│
├── src/
│   ├── shared/                          ← MIRAN ONLY (Prompt 1, first)
│   │   ├── bleConstants.ts
│   │   ├── types.ts
│   │   └── store.ts
│   │
│   ├── bootstrap/                       ← MIRAN ONLY
│   │   ├── App.tsx
│   │   ├── RootNavigator.tsx
│   │   └── SplashScreen.tsx
│   │
│   ├── broadcaster/                     ← IRFAN ONLY
│   │   ├── BroadcasterScreen.tsx
│   │   ├── useBroadcaster.ts
│   │   ├── SOSButton.tsx
│   │   └── BroadcastStatusBar.tsx
│   │
│   ├── relay/                           ← SARFARAZ ONLY
│   │   ├── RelayEngine.tsx
│   │   ├── useRelay.ts
│   │   ├── debounceCache.ts
│   │   ├── relayJitter.ts
│   │   └── RelayDebugPanel.tsx
│   │
│   ├── dashboard/                       ← ADNAN ONLY
│   │   ├── RescueDashboard.tsx
│   │   ├── RadarScreen.tsx
│   │   └── useListener.ts
│   │
│   └── permissions/                     ← SAMRAN ONLY
│       ├── PermissionModal.tsx
│       └── usePermissions.ts
│
├── index.js                             ← MIRAN ONLY
├── AGENTS.md
└── package.json
```

---

## Master Contract — Locked Names (Read Once, Never Deviate)

### Store — `src/shared/store.ts`
```ts
useAppStore() → {
  // state
  role, userId, detectedDevices, isServiceRunning,
  // actions
  setRole(role), setUserId(id), upsertDevice(device),
  clearDevices(), setServiceRunning(v)
}
```

### Types — `src/shared/types.ts`
```ts
AppRole        = 'idle' | 'broadcaster' | 'relay' | 'listener'
RSSIState      = 'hot' | 'warm' | 'cold'
SOSPacket      = { userId, medicalTag?, timestamp }
DetectedDevice = { id, rssi, packet, lastSeen }
getRSSIState(rssi): RSSIState
RSSI_COLORS    = { hot: '#00C853', warm: '#FFD600', cold: '#2979FF' }
```

### BLE Constants — `src/shared/bleConstants.ts`
```ts
SOS_SERVICE_UUID        = 'KUMBH-SOS-001'
BLE_HARDWARE_UUID       = '0000AA01-0000-1000-8000-00805F9B34FB'
RSSI_HOT                = -50
RSSI_WARM               = -70
RSSI_COLD               = -90
RELAY_COOLDOWN_MS       = 10000
BLE_SCAN_INTERVAL_MS    = 500
RELAY_BURST_DURATION_MS = 2000
```

### Native Module Signatures (written by Samran, called by all)
```ts
NativeModules.BLEAdvertiser.startAdvertising(uuid: string, payload: string): Promise<string>
NativeModules.BLEAdvertiser.stopAdvertising(): Promise<string>
NativeModules.ForegroundService.startService(): Promise<string>
NativeModules.ForegroundService.stopService(): Promise<string>
NativeModules.ForegroundService.isRunning(): Promise<boolean>
```

### Hook Return Signatures (locked — import only, never redefine)
```ts
useBroadcaster()       → { isAdvertising, error, startSOS, stopSOS }
useRelay()             → { isRelaying, relayCount, startRelaying, stopRelaying }
useListener()          → { isScanning, startListening, stopListening, sortedDevices }
usePermissions()       → { status, hasAll, checkAll, requestAll }
useForegroundService() → { startService, stopService, isRunning }
```

---

## Ownership & Boundaries

| File / Folder | Owner | Everyone else |
|---|---|---|
| `android/` (all Kotlin + Manifest) | Samran | Never touch |
| `android/.../MainApplication.kt` | Miran (Prompt 5 only) | Never touch |
| `src/shared/` | Miran (Prompt 1 only) | Import only, never edit |
| `src/bootstrap/` + `index.js` | Miran | Never touch |
| `src/broadcaster/` | Irfan | Never touch |
| `src/relay/` | Sarfaraz | Never touch |
| `src/dashboard/` | Adnan | Never touch |
| `src/permissions/` | Samran | Never touch |

---

## Execution Order

```
START (all at once):
  Samran   → runs Prompts 1–5  (go first, others depend on native modules)
  Miran    → runs Prompts 1–4  (parallel)
  Irfan    → runs Prompts 1–5  (parallel)
  Sarfaraz → runs Prompts 1–5  (parallel)
  Adnan    → runs Prompts 1–5  (parallel)

AFTER Samran pushes:
  Miran    → runs Prompt 5     (MainApplication.kt — registers Samran's packages)

THEN everyone pushes and Miran merges all into main.
```

---

## Git Workflow

```bash
# Each person — run once at start
# Samran
git checkout -b feat/samran-permissions-service

# Miran
git checkout -b feat/miran-bootstrap

# Irfan
git checkout -b feat/irfan-broadcaster

# Sarfaraz
git checkout -b feat/sarfaraz-relay

# Adnan
git checkout -b feat/adnan-dashboard
```

```bash
# When done with all your prompts — push your branch
git add .
git commit -m "feat: [name] complete"
git push origin [your-branch]
```

```bash
# Merge order — Miran does this after everyone pushes
git checkout main
git merge feat/samran-permissions-service
git merge feat/miran-bootstrap
git merge feat/irfan-broadcaster
git merge feat/sarfaraz-relay
git merge feat/adnan-dashboard
git push origin main
```

---

## Integration Checklist (Final 2 Hours)

| Task | Owner | Depends On |
|---|---|---|
| Shared store + types + constants | Miran | — |
| AndroidManifest + Kotlin services | Samran | — |
| Permissions hook + modal UI | Samran | Manifest |
| Root navigator + splash + App.tsx | Miran | Samran's permissions |
| SOS screen + BLE advertise hook | Irfan | Samran's native module |
| Relay engine + debounce + jitter | Sarfaraz | Samran's native module |
| Rescue dashboard + radar screen | Adnan | Sarfaraz's store updates |
| MainApplication.kt native merge | Miran | Samran done and pushed |
| End-to-end BLE test on device | All | Everything above |

---

## Emergency Contacts

> BLE native crash → ping **Samran** (owns the native bridge)
> Navigation broken → ping **Miran**
> Store shape needs changing → **ALL 5 agree** before touching `src/shared/store.ts`
> AI generated a file outside your folder → **don't save it**, ping the file's owner

---

*Last updated: V4 — Irfan and Samran roles swapped. Refer to PROMPT_SETS_V4.md.*
