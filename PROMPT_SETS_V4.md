# Portable Anchors — Vibe Coding Prompt Sets V4
### Rogue-AI-Proof · Locked Variable Names · Boundary Enforced on Every Prompt

> How to use: Find your section using --user_yourname. Open a fresh AI chat.
> Paste Prompt 1 EXACTLY as written. Save only the files listed. Paste Prompt 2. Repeat.
> NEVER save a file that is outside your assigned folder.

---

## MASTER CONTRACT — Variable & Function Names
### These are locked. Every prompt enforces them. Never deviate.

### Zustand Store — `src/shared/store.ts`
```
useAppStore() returns:
  STATE:   role, userId, detectedDevices, isServiceRunning
  ACTIONS: setRole(role), setUserId(id), upsertDevice(device), clearDevices(), setServiceRunning(v)
```

### Shared Types — `src/shared/types.ts`
```
AppRole       = 'idle' | 'broadcaster' | 'relay' | 'listener'
RSSIState     = 'hot' | 'warm' | 'cold'
SOSPacket     = { userId, medicalTag?, timestamp }
DetectedDevice = { id, rssi, packet, lastSeen }
getRSSIState(rssi: number): RSSIState
RSSI_COLORS   = { hot: '#00C853', warm: '#FFD600', cold: '#2979FF' }
```

### BLE Constants — `src/shared/bleConstants.ts`
```
SOS_SERVICE_UUID       = 'KUMBH-SOS-001'
BLE_HARDWARE_UUID      = '0000AA01-0000-1000-8000-00805F9B34FB'
RSSI_HOT               = -50
RSSI_WARM              = -70
RSSI_COLD              = -90
RELAY_COOLDOWN_MS      = 10000
BLE_SCAN_INTERVAL_MS   = 500
RELAY_BURST_DURATION_MS = 2000
```

### Native Module Signatures — written by Samran, called by everyone else
```
NativeModules.BLEAdvertiser.startAdvertising(uuid: string, payload: string): Promise<string>
NativeModules.BLEAdvertiser.stopAdvertising(): Promise<string>
NativeModules.ForegroundService.startService(): Promise<string>
NativeModules.ForegroundService.stopService(): Promise<string>
NativeModules.ForegroundService.isRunning(): Promise<boolean>
```

### Hook Return Signatures
```
useBroadcaster()  → { isAdvertising, error, startSOS, stopSOS }
useRelay()        → { isRelaying, relayCount, startRelaying, stopRelaying }
useListener()     → { isScanning, startListening, stopListening, sortedDevices }
usePermissions()  → { status, hasAll, checkAll, requestAll }
useForegroundService() → { startService, stopService, isRunning }
```

---

## BOUNDARY MAP — Who owns what
```
Samran   → android/  AND  src/permissions/   ONLY
Miran    → src/bootstrap/  AND  src/shared/  ONLY  (+ MainApplication.kt in Prompt 5)
Irfan    → src/broadcaster/                  ONLY
Sarfaraz → src/relay/                        ONLY
Adnan    → src/dashboard/                    ONLY
```

---
---

# --user_samran
# SAMRAN — Android Native + Permissions
> Branch: `feat/samran-permissions-service`
> Folder: `android/` + `src/permissions/`
> GO FIRST — everyone depends on your native modules

---

## SAMRAN — Prompt 1 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → android/app/src/main/java/com/portableanchors/
  → android/app/src/main/res/
  → android/app/src/main/AndroidManifest.xml
Do NOT create any file in src/shared/, src/bootstrap/,
src/broadcaster/, src/relay/, src/dashboard/, or src/permissions/.
At the end of your response write:
  FILES CREATED: [list every filepath you created]
If any file is outside the android/ folder, remove it.
════════════════════════════════════════════════

You are a Senior Android + React Native developer.

App: "Portable Anchors" — Android-only React Native CLI.
Package: com.portableanchors
Target: API 21 min, API 31+ primary.

Task: Write the complete AndroidManifest.xml.

PERMISSIONS:
- android.permission.BLUETOOTH_SCAN with android:usesPermissionFlags="neverForLocation"
- android.permission.BLUETOOTH_ADVERTISE
- android.permission.BLUETOOTH_CONNECT
- android.permission.ACCESS_FINE_LOCATION
- android.permission.ACCESS_COARSE_LOCATION
- android.permission.FOREGROUND_SERVICE
- android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE
- android.permission.WAKE_LOCK
- android.permission.VIBRATE
- android.permission.RECEIVE_BOOT_COMPLETED
- android.permission.INTERNET

FEATURES:
- <uses-feature android:name="android.hardware.bluetooth_le" android:required="true"/>

APPLICATION block:
1. Standard React Native MainActivity with intent filters
2. Service: android:name=".BLEForegroundService"
            android:foregroundServiceType="connectedDevice"
            android:exported="false"
3. Receiver: android:name=".BootReceiver"
             android:exported="false"
             with intent-filter for RECEIVE_BOOT_COMPLETED

Give me the COMPLETE file. No omissions.
```

---

## SAMRAN — Prompt 2 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → android/app/src/main/java/com/portableanchors/
Do NOT create any TypeScript, JS, or src/ files.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors. Package: com.portableanchors.

Task: Write two Kotlin files.

FILE 1: android/app/src/main/java/com/portableanchors/BLEForegroundService.kt
- Extends Service()
- companion object: NOTIFICATION_ID = 1001, CHANNEL_ID = "ble_mesh_channel"
- onCreate(): create NotificationChannel (API 26+)
  id = "ble_mesh_channel", name = "Safety Mesh", importance = IMPORTANCE_LOW
- onStartCommand():
  Build notification: NotificationCompat.Builder(this, CHANNEL_ID)
    .setContentTitle("Safety Mesh Active")
    .setContentText("You are part of the rescue network.")
    .setSmallIcon(android.R.drawable.ic_dialog_info)
    .setOngoing(true)
    .setPriority(NotificationCompat.PRIORITY_LOW)
  Call startForeground(NOTIFICATION_ID, notification)
  Return START_STICKY
- onDestroy(): stopForeground(true)
- onBind(): return null

FILE 2: android/app/src/main/java/com/portableanchors/BootReceiver.kt
- Extends BroadcastReceiver()
- onReceive(): if intent.action == Intent.ACTION_BOOT_COMPLETED
  call ContextCompat.startForegroundService(context, Intent(context, BLEForegroundService::class.java))

Include all imports. Full Kotlin.
```

---

## SAMRAN — Prompt 3 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → android/app/src/main/java/com/portableanchors/
  → src/permissions/
Do NOT create files in src/shared/, src/bootstrap/,
src/broadcaster/, src/relay/, or src/dashboard/.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors. Package: com.portableanchors.

Task: ForegroundService bridge — 2 Kotlin files + 1 TypeScript file.

FILE 1: android/.../ForegroundServiceModule.kt
ReactContextBaseJavaModule:
- getName() returns EXACTLY the string: "ForegroundService"
  ← This string is the NativeModules key. Do not change it.
- @ReactMethod startService(promise: Promise)
  Intent for BLEForegroundService → ContextCompat.startForegroundService()
  promise.resolve("started") / promise.reject("ERR", e.message)
- @ReactMethod stopService(promise: Promise)
  reactApplicationContext.stopService(intent) → promise.resolve("stopped")
- @ReactMethod isRunning(promise: Promise)
  ActivityManager.getRunningServices(Int.MAX_VALUE).any { it.service.className
  == BLEForegroundService::class.java.name } → promise.resolve(boolean)

FILE 2: android/.../ForegroundServicePackage.kt
ReactPackage implementing:
- createNativeModules() = listOf(ForegroundServiceModule(reactContext))
- createViewManagers() = emptyList()

FILE 3: src/permissions/useForegroundService.ts
TypeScript hook. Exact export signature (do not rename):

  export const useForegroundService = () => {
    const startService = async (): Promise<void> => { ... }
    const stopService = async (): Promise<void> => { ... }
    const isRunning = async (): Promise<boolean> => { ... }
    return { startService, stopService, isRunning }
  }

Calls NativeModules.ForegroundService.startService() etc.
If NativeModules.ForegroundService is undefined: console.warn and resolve gracefully.
Full TypeScript types. All Kotlin imports included.
```

---

## SAMRAN — Prompt 4 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → android/app/src/main/java/com/portableanchors/
Do NOT write any JS/TS files. My teammate Irfan writes the JS side.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors. Package: com.portableanchors.

Task: BLE Advertiser native module — 2 Kotlin files only.

FILE 1: android/.../BLEAdvertiserModule.kt
ReactContextBaseJavaModule:
- getName() returns EXACTLY the string: "BLEAdvertiser"
  ← This string is the NativeModules key. Do not change it.
- private var advertiseCallback: AdvertiseCallback? = null

- @ReactMethod startAdvertising(serviceUUID: String, payload: String, promise: Promise)
  Get BluetoothManager → adapter → bluetoothLeAdvertiser
  If advertiser null: promise.reject("BLE_UNAVAILABLE", "Not supported"); return
  AdvertiseSettings: ADVERTISE_MODE_LOW_LATENCY, ADVERTISE_TX_POWER_HIGH,
    connectable=false, timeout=0
  AdvertiseData: ParcelUuid.fromString("0000AA01-0000-1000-8000-00805F9B34FB"),
    addManufacturerData(0x0059, payload.toByteArray(Charsets.UTF_8).take(20).toByteArray()),
    setIncludeDeviceName(false)
  advertiseCallback: onStartSuccess → promise.resolve("advertising")
                     onStartFailure → promise.reject("ADV_FAIL", errorCode.toString())
  bluetoothLeAdvertiser.startAdvertising(settings, data, advertiseCallback)

- @ReactMethod stopAdvertising(promise: Promise)
  bluetoothLeAdvertiser?.stopAdvertising(advertiseCallback)
  advertiseCallback = null
  promise.resolve("stopped")

FILE 2: android/.../BLEAdvertiserPackage.kt
ReactPackage registering BLEAdvertiserModule.

At the very bottom of BLEAdvertiserModule.kt add this comment:
// TODO_MIRAN: register in MainApplication.kt getPackages():
// packages.add(ForegroundServicePackage())
// packages.add(BLEAdvertiserPackage())

All imports. Null safety throughout.
```

---

## SAMRAN — Prompt 5 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/permissions/
Do NOT create files in src/shared/, src/bootstrap/,
src/broadcaster/, src/relay/, src/dashboard/, or android/.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors.

Task: JS permissions layer — 2 TypeScript files.

FILE 1: src/permissions/usePermissions.ts
Exact export signature (do not rename anything):

  export const usePermissions = () => {
    // state
    const [status, setStatus] = useState<'unknown'|'granted'|'denied'|'blocked'>('unknown')
    // derived
    const hasAll = status === 'granted'
    // functions
    const checkAll = async (): Promise<boolean> => { ... }
    const requestAll = async (): Promise<boolean> => { ... }
    return { status, hasAll, checkAll, requestAll }
  }

Logic:
- Platform.Version >= 31: request BLUETOOTH_SCAN, BLUETOOTH_ADVERTISE,
  BLUETOOTH_CONNECT, ACCESS_FINE_LOCATION
- Platform.Version < 31: request ACCESS_FINE_LOCATION only
- Use PermissionsAndroid.requestMultiple()
- 'never_ask_again' result → setStatus('blocked'), Linking.openSettings()
- Auto-call checkAll() on mount

FILE 2: src/permissions/PermissionModal.tsx
Props: { visible: boolean, onAccept: () => void, onDismiss: () => void }

Design: Clean minimal. Dark overlay, white card from bottom.
- Overlay: rgba(0,0,0,0.75), flex 1, justifyContent flex-end
- Card: backgroundColor white, borderTopLeftRadius 16, borderTopRightRadius 16, padding 28
- Red rule: width 40, height 3, backgroundColor #E8001C, borderRadius 2, marginBottom 20
- Label: "PERMISSIONS REQUIRED" fontSize 13 letterSpacing 3 color #999 fontWeight '600'
- Heading: "Safety Mesh needs access" fontSize 22 fontWeight '800' color #0A0A0A marginTop 8

Three rows (flexDirection row, alignItems flex-start, marginTop 16 each):
  Left: 8x8 square backgroundColor #E8001C marginTop 4 marginRight 12
  Right: title (fontSize 13 fontWeight '700' color #0A0A0A)
         + body (fontSize 12 color #888 marginTop 2)
  Row 1: "Bluetooth" / "Detects and broadcasts SOS signals nearby"
  Row 2: "Location" / "Required by Android for Bluetooth scanning. Never uploaded."
  Row 3: "Background" / "Keeps the mesh alive when your screen is off"

Privacy note: "No data leaves your device."
fontSize 12 color #999 marginTop 20

Buttons:
- "Continue": backgroundColor #0A0A0A, height 52, borderRadius 8, marginTop 24
  Text: "Continue" fontSize 13 fontWeight '700' color white letterSpacing 1
  onPress: onAccept
- "Not Now": no background, marginTop 12, textAlign center
  Text: "Not Now" fontSize 13 color #999
  onPress: onDismiss

Export PermissionModal as default.
Also add at bottom: export { usePermissions } from './usePermissions'
TypeScript. StyleSheet only. No emojis. No icons.

After your response write:
FILES CREATED:
- src/permissions/usePermissions.ts
- src/permissions/PermissionModal.tsx

NATIVE MODULE BRIDGE (paste this into team group chat):
NativeModules.BLEAdvertiser.startAdvertising(uuid: string, payload: string)
NativeModules.BLEAdvertiser.stopAdvertising()
NativeModules.ForegroundService.startService()
NativeModules.ForegroundService.stopService()
NativeModules.ForegroundService.isRunning()
```

---
---

# --user_miran
# MIRAN — Shared Contracts + Navigation Shell + Native Merge
> Branch: `feat/miran-bootstrap`
> Folder: `src/shared/` + `src/bootstrap/` + `MainApplication.kt` (Prompt 5 only)
> Run Prompts 1–4 in parallel with everyone. Run Prompt 5 ONLY after Samran pushes.

---

## MIRAN — Prompt 1 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/shared/
Do NOT create files in src/bootstrap/, src/broadcaster/,
src/relay/, src/dashboard/, src/permissions/, or android/.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

You are a Senior React Native TypeScript developer.

App: "Portable Anchors" — Android-only BLE mesh SOS system.

Task: Create the 3 shared contract files. These are the single source of truth
for the entire team. Every name here is LOCKED and used by all 5 developers.

FILE 1: src/shared/bleConstants.ts
Export these EXACTLY (names are locked — teammates depend on them):

export const SOS_SERVICE_UUID = 'KUMBH-SOS-001';
export const BLE_HARDWARE_UUID = '0000AA01-0000-1000-8000-00805F9B34FB';
export const RSSI_HOT = -50;
export const RSSI_WARM = -70;
export const RSSI_COLD = -90;
export const RELAY_COOLDOWN_MS = 10000;
export const BLE_SCAN_INTERVAL_MS = 500;
export const RELAY_BURST_DURATION_MS = 2000;

FILE 2: src/shared/types.ts
Export these EXACTLY (names are locked):

export type AppRole = 'idle' | 'broadcaster' | 'relay' | 'listener';
export type RSSIState = 'hot' | 'warm' | 'cold';

export interface SOSPacket {
  userId: string;
  medicalTag?: string;
  timestamp: number;
}

export interface DetectedDevice {
  id: string;
  rssi: number;
  packet: SOSPacket;
  lastSeen: number;
}

export function getRSSIState(rssi: number): RSSIState {
  if (rssi >= -50) return 'hot';
  if (rssi >= -70) return 'warm';
  return 'cold';
}

export const RSSI_COLORS: Record<RSSIState, string> = {
  hot: '#00C853',
  warm: '#FFD600',
  cold: '#2979FF',
};

FILE 3: src/shared/store.ts
Zustand store. Export these EXACTLY (names are locked):

import { create } from 'zustand';
import { AppRole, DetectedDevice } from './types';

interface AppState {
  role: AppRole;
  userId: string;
  detectedDevices: DetectedDevice[];
  isServiceRunning: boolean;
  setRole: (role: AppRole) => void;
  setUserId: (id: string) => void;
  upsertDevice: (device: DetectedDevice) => void;
  clearDevices: () => void;
  setServiceRunning: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: 'idle',
  userId: '',
  detectedDevices: [],
  isServiceRunning: false,
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
  upsertDevice: (device) => set((s) => ({
    detectedDevices: [
      ...s.detectedDevices.filter((d) => d.id !== device.id),
      device,
    ],
  })),
  clearDevices: () => set({ detectedDevices: [] }),
  setServiceRunning: (isServiceRunning) => set({ isServiceRunning }),
}));

Copy the above VERBATIM. Do not rename, restructure, or add fields.
```

---

## MIRAN — Prompt 2 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/bootstrap/
Do NOT create files in src/shared/ (already done),
src/broadcaster/, src/relay/, src/dashboard/, src/permissions/, or android/.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors.

Task: Splash screen component.

FILE: src/bootstrap/SplashScreen.tsx

Props: { onFinish: () => void }

Design: Clean minimal emergency.
- Full screen, backgroundColor '#0A0A0A', flex 1,
  justifyContent center, alignItems center
- No emojis. No icon libraries. Pure geometry + typography.

Layout (top to bottom, all centered):
1. Geometric logo mark:
   Outer square: 64x64, borderWidth 2, borderColor white
   Inner square: 40x40, borderWidth 2, borderColor #E8001C
   Both absolutely positioned and centered within a 64x64 container View

2. "PORTABLE ANCHORS"
   fontSize 18, fontWeight '800', color white, letterSpacing 6, marginTop 24

3. "Offline Safety Mesh"
   fontSize 12, color '#666', letterSpacing 2, marginTop 6

Animation:
- Wrap all content in Animated.View
- On mount: Animated.timing opacity 0 → 1 over 600ms
- After 2200ms total call onFinish()

Use only React Native Animated API. StyleSheet only. TypeScript. Export default.
```

---

## MIRAN — Prompt 3 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/bootstrap/
Do NOT create or modify src/shared/,
src/broadcaster/, src/relay/, src/dashboard/, src/permissions/, or android/.
If you need something from another module IMPORT it — never recreate it.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors.

LOCKED IMPORTS (use these exact paths and names — do not rename):
  import { useAppStore } from '../shared/store'
  useAppStore() gives: { role, userId, detectedDevices, isServiceRunning }

Task: Root navigator.

FILE: src/bootstrap/RootNavigator.tsx

Stack: @react-navigation/native + @react-navigation/bottom-tabs

Three tabs (text labels only — no icon libraries, no emojis):
1. Label "HOME"   → HomeScreen defined locally in this file
2. Label "SOS"    → React.lazy(() => import('../broadcaster/BroadcasterScreen'))
3. Label "RESCUE" → React.lazy(() => import('../dashboard/RescueDashboard'))

Wrap lazy screens in <Suspense fallback={<FallbackScreen />}>
FallbackScreen: dark bg #0A0A0A, centered text "Loading..." color #444 fontSize 13

Tab bar style:
- backgroundColor: '#0A0A0A'
- borderTopWidth: 1, borderTopColor: '#1C1C1C'
- height: 56
- tabBarLabelStyle: fontSize 10, fontWeight '700', letterSpacing 2
- tabBarActiveTintColor: '#E8001C'
- tabBarInactiveTintColor: '#444'

HomeScreen (local):
- backgroundColor '#0A0A0A', flex 1, padding 24, paddingTop 60
- Label: "CURRENT ROLE" fontSize 10 letterSpacing 3 color #666
- Role display: role from useAppStore toUpperCase()
  fontSize 32 fontWeight '800'
  color: role==='idle' → white | role==='broadcaster' → #E8001C | else → #00C853
- Divider: height 1 backgroundColor #1C1C1C marginVertical 24
- Two-column row:
  Left: label "MESH STATUS" / value isServiceRunning ? "ACTIVE" (color #00C853) : "INACTIVE" (color #444)
  Right: label "NEARBY" / value detectedDevices.length toString color white
  Each: label fontSize 9 letterSpacing 3 color #666 | value fontSize 20 fontWeight '800' marginTop 4

Export RootNavigator as default. TypeScript. StyleSheet.
```

---

## MIRAN — Prompt 4 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/bootstrap/
  → root index.js
Do NOT create files in src/shared/, src/broadcaster/,
src/relay/, src/dashboard/, src/permissions/, or android/.
Import from other modules — never recreate them.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors.

LOCKED IMPORTS (exact paths and names — do not rename):
  import { usePermissions } from '../permissions/PermissionModal'
  import { useForegroundService } from '../permissions/useForegroundService'
  usePermissions() gives: { hasAll, requestAll }
  useForegroundService() gives: { startService }

Task: Root App component + index.js

FILE: src/bootstrap/App.tsx

- useState splashDone = false
- If !splashDone → <SplashScreen onFinish={() => setSplashDone(true)} />
- If splashDone → main app

Main app:
Root View: flex 1, backgroundColor '#0A0A0A'

1. Try to import RelayEngine from '../relay/RelayEngine'
   If unavailable: const RelayEngine = () => null
   Render <RelayEngine /> (renders null, manages BLE background scanning)

2. Try to import PermissionModal from '../permissions/PermissionModal'
   Try to import { usePermissions } from '../permissions/PermissionModal'
   If unavailable: mock both as no-ops
   Show <PermissionModal> if !hasAll
   onAccept: call requestAll() then startService()
   onDismiss: just close

3. <NavigationContainer theme={{
     dark: true,
     colors: {
       background: '#0A0A0A',
       card: '#0A0A0A',
       text: '#FFFFFF',
       border: '#1C1C1C',
       notification: '#E8001C',
       primary: '#E8001C',
     }
   }}>
     <RootNavigator />
   </NavigationContainer>

AppState listener: log '[App] state → ' + nextState on any change.

FILE: index.js (project root)
import { AppRegistry } from 'react-native';
import App from './src/bootstrap/App';
import { name as appName } from './app.json';
AppRegistry.registerComponent(appName, () => App);

TypeScript for App.tsx. Export App as default.
```

---

## MIRAN — Prompt 5 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
ONLY run this prompt after Samran has pushed feat/samran-permissions-service.
You are ONLY allowed to create/edit:
  → android/app/src/main/java/com/portableanchors/MainApplication.kt
Do NOT touch any other file.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors. Package: com.portableanchors.

Task: Write MainApplication.kt registering all native modules.

LOCKED PACKAGE NAMES (copy exactly from Samran's files):
  ForegroundServicePackage  — from ForegroundServicePackage.kt
  BLEAdvertiserPackage      — from BLEAdvertiserPackage.kt

FILE: android/app/src/main/java/com/portableanchors/MainApplication.kt

Standard React Native MainApplication:
- Extends Application(), implements ReactApplication
- getReactNativeHost():
  - getUseDeveloperSupport() = BuildConfig.DEBUG
  - getPackages():
      val packages = PackageList(this).packages
      packages.add(ForegroundServicePackage())
      packages.add(BLEAdvertiserPackage())
      return packages
  - getJSMainModuleName() = "index"
- onCreate():
  super.onCreate()
  SoLoader.init(this, false)
  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    val channel = NotificationChannel(
      "ble_mesh_channel",
      "Safety Mesh",
      NotificationManager.IMPORTANCE_LOW
    ).apply { description = "BLE mesh background operation" }
    getSystemService(NotificationManager::class.java)
      .createNotificationChannel(channel)
  }

Include all imports. Full Kotlin.

Also give me:
1. The complete npm install command:
   npm install @react-navigation/native @react-navigation/bottom-tabs
   react-native-screens react-native-safe-area-context zustand
   react-native-ble-plx @react-native-async-storage/async-storage

2. android/app/build.gradle addition for react-native-screens:
   implementation 'androidx.appcompat:appcompat:1.4.1'
```

---
---

# --user_irfan
# IRFAN — SOS Broadcaster (Role A)
> Branch: `feat/irfan-broadcaster`
> Folder: `src/broadcaster/` ONLY
> You can start immediately in parallel

---

## IRFAN — Prompt 1 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/broadcaster/
Do NOT create files in src/shared/, src/bootstrap/, src/relay/,
src/dashboard/, src/permissions/, or android/.
Do NOT rewrite shared files — only import from them.
At the end write: FILES CREATED: [list]
If any file is outside src/broadcaster/, remove it.
════════════════════════════════════════════════

You are a Senior React Native TypeScript developer.
App: "Portable Anchors" — Android-only BLE mesh SOS system.

LOCKED IMPORTS — use these EXACTLY, do not rename:
  import { SOS_SERVICE_UUID } from '../shared/bleConstants'
  import { useAppStore } from '../shared/store'
  useAppStore() gives: { setRole, setUserId }
  setRole accepts: 'idle' | 'broadcaster' | 'relay' | 'listener'

LOCKED NATIVE MODULE — call exactly as shown:
  NativeModules.BLEAdvertiser.startAdvertising(uuid: string, payload: string): Promise<string>
  NativeModules.BLEAdvertiser.stopAdvertising(): Promise<string>
  (This module is written by teammate Samran — just call it, never recreate it)

Task: BLE broadcaster hook.

FILE: src/broadcaster/useBroadcaster.ts

Export signature (locked — teammates may depend on this):
  export const useBroadcaster = () => {
    return { isAdvertising, error, startSOS, stopSOS }
  }

Implementation:
- State: isAdvertising (boolean, default false), error (string | null, default null)

- startSOS(userId: string, medicalTag?: string): Promise<void>
  payload = JSON.stringify({ userId, medicalTag: medicalTag ?? '', timestamp: Date.now() })
  Call NativeModules.BLEAdvertiser?.startAdvertising(SOS_SERVICE_UUID, payload)
  On success: setIsAdvertising(true), store.setRole('broadcaster'), store.setUserId(userId)
  Vibration.vibrate([0, 200, 100, 200])
  If NativeModules.BLEAdvertiser undefined: setError('Native BLE module unavailable'); return
  try/catch: setError(e.message)

- stopSOS(): Promise<void>
  NativeModules.BLEAdvertiser?.stopAdvertising()
  setIsAdvertising(false), store.setRole('idle')

- useEffect cleanup: stopSOS() on unmount

TypeScript strict. Handle all null/undefined cases.
```

---

## IRFAN — Prompt 2 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/broadcaster/
Do NOT create files anywhere else.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors broadcaster module.

Task: Animated SOS button.

FILE: src/broadcaster/SOSButton.tsx

Props: { isActive: boolean, onPress: () => void, disabled?: boolean }

IDLE (isActive=false):
- Circle: width 180, height 180, borderRadius 90, backgroundColor '#E8001C'
- Text: "SOS", fontSize 42, fontWeight '900', color white, letterSpacing 4
- No animation

ACTIVE (isActive=true):
- Same circle, text "ACTIVE" fontSize 18 fontWeight '800' letterSpacing 6
- Three pulse rings (position absolute, centered behind circle):
  Each ring: width 180, height 180, borderRadius 90,
  borderWidth 1.5, borderColor '#E8001C', position absolute
  Animated: scale 1→2.2, opacity 0.6→0, duration 1800ms easeOut
  Stagger: ring1 delay 0ms, ring2 delay 600ms, ring3 delay 1200ms
  Use Animated.loop wrapping Animated.parallel([scale anim, opacity anim])

DISABLED: opacity 0.4, no animations run

useEffect:
  if isActive=true → start all 3 loops
  if isActive=false → stop all loops, reset values

No icon libraries. No emojis. StyleSheet only. TypeScript. Export default.
```

---

## IRFAN — Prompt 3 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/broadcaster/
Do NOT create files anywhere else.
Import SOSButton and useBroadcaster from your own folder.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors broadcaster module.

LOCKED IMPORTS:
  import SOSButton from './SOSButton'
  import { useBroadcaster } from './useBroadcaster'
  useBroadcaster() gives: { isAdvertising, error, startSOS, stopSOS }

Task: Main SOS screen.

FILE: src/broadcaster/BroadcasterScreen.tsx

Design: Clean minimal emergency. #0A0A0A bg, #E8001C accent.
No emojis. No icon libraries. StyleSheet only.

═══ IDLE STATE (isAdvertising=false) ═══

Full screen, flex 1, backgroundColor '#0A0A0A', padding 24

TOP (paddingTop 52):
  "EMERGENCY BROADCAST" fontSize 10 fontWeight '700' letterSpacing 3 color '#666'

MIDDLE (flex 1, justifyContent center, alignItems center):
  <SOSButton isActive={false} onPress={handleActivate} />
  "TAP TO ACTIVATE SOS" fontSize 11 fontWeight '700' letterSpacing 3 color '#666' marginTop 20

INPUT SECTION (marginBottom 32):
  "YOUR DETAILS" fontSize 10 letterSpacing 3 color '#666' marginBottom 12

  Name TextInput:
    placeholder "Name or ID", placeholderTextColor '#444'
    backgroundColor '#111', color white, borderRadius 8
    borderWidth 1, borderColor '#222', padding 14
    fontSize 15, fontWeight '600'

  Medical TextInput (marginTop 10, maxLength 60):
    placeholder "Medical info (optional)", placeholderTextColor '#444'
    same styles as name input
  Character count: "{medicalInfo.length} / 60"
    fontSize 11, color '#444', textAlign 'right', marginTop 4

Both inputs stored in local useState: nameInput, medicalInput

═══ ACTIVE STATE (isAdvertising=true) ═══

Animated background: Animated.loop between #0A0A0A ↔ #1A0000 (900ms each direction)
Use Animated.Value + interpolate for backgroundColor.

Centered layout:
  <SOSButton isActive={true} onPress={() => {}} disabled={true} />
  "SOS BROADCAST ACTIVE" fontSize 13 fontWeight '800' letterSpacing 4 color white marginTop 28
  Divider: width 40, height 2, backgroundColor '#E8001C', marginVertical 16
  "Rescuers are being guided to you" fontSize 13 color '#888' letterSpacing 1
  userId from store: fontSize 12 color '#666' marginTop 8

Cancel button (marginBottom 40):
  borderWidth 1, borderColor '#333', borderRadius 6, height 48
  "CANCEL" fontSize 12 letterSpacing 3 color '#888'
  onPress: stopSOS()

═══ CONFIRMATION ═══
handleActivate:
  Alert.alert(
    'Activate SOS Broadcast?',
    'Only use in a genuine emergency. This will alert nearby volunteers.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Activate', style: 'destructive', onPress: handleStartSOS }
    ]
  )

handleStartSOS:
  userId = nameInput.trim() || 'USR-' + Date.now().toString(36).toUpperCase()
  startSOS(userId, medicalInput.trim() || undefined)

TypeScript. Export default.
```

---

## IRFAN — Prompt 4 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to modify files inside:
  → src/broadcaster/
At the end write: FILES MODIFIED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors broadcaster module.

Task: Add 2 safety features to BroadcasterScreen.tsx.
Show me the COMPLETE updated file.

FEATURE 1 — 30-second welfare check:
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  When isAdvertising becomes true:
    safetyTimerRef.current = setTimeout(() => {
      Alert.alert(
        'Are you still in danger?',
        'Your SOS is still broadcasting.',
        [
          { text: 'Yes, still need help', style: 'cancel' },
          { text: 'I am safe — Cancel SOS', style: 'destructive', onPress: stopSOS }
        ]
      )
    }, 30000)

  When isAdvertising becomes false OR on unmount:
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current)

  Track in useEffect watching [isAdvertising].

FEATURE 2 — Screen wake lock:
  When isAdvertising becomes true:
    try { NativeModules.PowerManager?.acquire?.() } catch(_) {}
  When isAdvertising becomes false:
    try { NativeModules.PowerManager?.release?.() } catch(_) {}

  Same useEffect as above.

Show the complete BroadcasterScreen.tsx. Keep all UI from Prompt 3 intact.
```

---

## IRFAN — Prompt 5 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/broadcaster/
At the end write: FILES CREATED: [list]
Confirm no file is outside src/broadcaster/.
════════════════════════════════════════════════

Final step for broadcaster module.

Task: Broadcast status banner.

FILE: src/broadcaster/BroadcastStatusBar.tsx

No props. No icon libraries. No emojis.

Design: dark card at bottom of active SOS screen.
- backgroundColor '#111', borderRadius 10, padding 16, marginHorizontal 24

Three equal columns (flexDirection row):
  Col 1: label "STATUS"  / value "LIVE"    color '#00C853' fontWeight '800'
  Col 2: label "SIGNAL"  / value "BLE 5.0" color white
  Col 3: label "RANGE"   / value "~30m"    color white
  Each: label fontSize 9 letterSpacing 2 color '#666'
        value fontSize 13 fontWeight '700' marginTop 4

Bottom breathing bar:
  Full width, height 2, backgroundColor '#E8001C'
  Animated.loop: opacity 1 → 0.2 → 1 over 1200ms

Export as default. TypeScript. StyleSheet.

After response:
FILES CREATED:
- src/broadcaster/BroadcastStatusBar.tsx

FINAL FILE LIST for src/broadcaster/:
- useBroadcaster.ts   → BLE advertise hook
- SOSButton.tsx       → Animated pulse button
- BroadcasterScreen.tsx → Full SOS victim UI
- BroadcastStatusBar.tsx → Live status banner

Confirm none import from src/relay, src/dashboard, src/permissions, or android/.
```

---
---

# --user_sarfaraz
# SARFARAZ — Relay Engine (Role B)
> Branch: `feat/sarfaraz-relay`
> Folder: `src/relay/` ONLY
> You can start immediately in parallel

---

## SARFARAZ — Prompt 1 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/relay/
Do NOT create files in src/shared/, src/bootstrap/, src/broadcaster/,
src/dashboard/, src/permissions/, or android/.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

You are a Senior React Native TypeScript developer.
App: "Portable Anchors" — Android-only BLE mesh SOS system.

Task: Debounce cache module.

FILE: src/relay/debounceCache.ts

Pure TypeScript module. No React. No imports from other project files.

const cache = new Map<string, number>();

Export these EXACTLY (names are used by useRelay.ts — do not rename):

export const shouldRelay = (userId: string, cooldownMs: number): boolean => {
  const now = Date.now();
  // Sweep stale entries first (older than cooldownMs * 3)
  cache.forEach((ts, key) => { if (now - ts > cooldownMs * 3) cache.delete(key) })
  const lastSeen = cache.get(userId);
  if (lastSeen && now - lastSeen < cooldownMs) return false;
  cache.set(userId, now);
  return true;
}

export const clearCache = (): void => cache.clear();
export const getCacheSize = (): number => cache.size;
export const removeEntry = (userId: string): void => { cache.delete(userId); };

Copy these signatures exactly. The names shouldRelay, clearCache, getCacheSize,
removeEntry are locked — useRelay.ts imports them by these exact names.
```

---

## SARFARAZ — Prompt 2 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/relay/
Do NOT create files anywhere else.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors relay module.

Task: Jitter module.

FILE: src/relay/relayJitter.ts

Pure TypeScript. No React. No imports from other project files.

Export these EXACTLY (names are used by useRelay.ts — do not rename):

export const getJitterDelay = (minMs: number = 150, maxMs: number = 1800): number =>
  Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

export const getSessionSeed = (): number =>
  (Date.now() % 97331) + 100;

export const MY_SESSION_JITTER_MS: number = getSessionSeed();

MY_SESSION_JITTER_MS is computed ONCE at module load. Every relay call uses this
same value so this device always has its own consistent delay per session.
```

---

## SARFARAZ — Prompt 3 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/relay/
Do NOT create or modify src/shared/ files.
Only IMPORT from shared — never rewrite them.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors relay module.

LOCKED IMPORTS (use exactly — do not rename):
  import { SOS_SERVICE_UUID, RELAY_COOLDOWN_MS, RELAY_BURST_DURATION_MS } from '../shared/bleConstants'
  import { useAppStore } from '../shared/store'
  import { DetectedDevice, SOSPacket } from '../shared/types'
  useAppStore() gives: { upsertDevice }
  upsertDevice takes: DetectedDevice object

  import { shouldRelay } from './debounceCache'
  import { MY_SESSION_JITTER_MS } from './relayJitter'

LOCKED NATIVE MODULE:
  NativeModules.BLEAdvertiser.startAdvertising(uuid: string, payload: string): Promise<string>
  NativeModules.BLEAdvertiser.stopAdvertising(): Promise<string>

Task: Core relay hook.

FILE: src/relay/useRelay.ts

Export signature (locked):
  export const useRelay = () => {
    return { isRelaying, relayCount, startRelaying, stopRelaying }
  }

State: isRelaying (boolean), relayCount (number)
Refs: managerRef (BleManager | null), activeTimers (Set<ReturnType<typeof setTimeout>>)

startRelaying():
  if (isRelaying) return
  const manager = new BleManager()
  managerRef.current = manager
  setIsRelaying(true)
  manager.startDeviceScan([SOS_SERVICE_UUID], { allowDuplicates: true }, (error, device) => {
    if (error || !device) return
    const userId = device.name ?? device.id
    let packet: SOSPacket
    try {
      const raw = device.manufacturerData
        ? Buffer.from(device.manufacturerData, 'base64').toString('utf8')
        : ''
      packet = JSON.parse(raw)
    } catch {
      packet = { userId, timestamp: Date.now() }
    }
    const detected: DetectedDevice = {
      id: device.id,
      rssi: device.rssi ?? -99,
      packet,
      lastSeen: Date.now(),
    }
    upsertDevice(detected)
    if (shouldRelay(userId, RELAY_COOLDOWN_MS)) {
      const t = setTimeout(async () => {
        try {
          await NativeModules.BLEAdvertiser?.startAdvertising(SOS_SERVICE_UUID, JSON.stringify(packet))
          const stopT = setTimeout(() => {
            NativeModules.BLEAdvertiser?.stopAdvertising()
          }, RELAY_BURST_DURATION_MS)
          activeTimers.current.add(stopT)
        } catch (e) { console.warn('[Relay] advertise error', e) }
        setRelayCount(c => c + 1)
      }, MY_SESSION_JITTER_MS)
      activeTimers.current.add(t)
    }
  })

stopRelaying():
  managerRef.current?.stopDeviceScan()
  activeTimers.current.forEach(clearTimeout)
  activeTimers.current.clear()
  NativeModules.BLEAdvertiser?.stopAdvertising()
  setIsRelaying(false)

useEffect cleanup: stopRelaying() on unmount.
TypeScript. Handle all null/undefined.
```

---

## SARFARAZ — Prompt 4 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/relay/
Do NOT create files anywhere else.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors relay module.

LOCKED IMPORTS:
  import { useRelay } from './useRelay'
  import { useAppStore } from '../shared/store'
  import { getCacheSize } from './debounceCache'
  useRelay() gives: { isRelaying, relayCount, startRelaying, stopRelaying }
  useAppStore() gives: { isServiceRunning }

Task: Headless RelayEngine + RelayStatusBadge.

FILE: src/relay/RelayEngine.tsx

Default export: RelayEngine component (renders null)
- On mount: startRelaying()
- AppState listener:
    'active' + !isRelaying → startRelaying()
    'background'/'inactive' → do nothing (foreground service keeps it alive)
- Watch isServiceRunning: if false → console.warn('[RelayEngine] foreground service stopped')
- On unmount: stopRelaying()
- return null

Named export: RelayStatusBadge
Props: { style?: object }
- Reads isRelaying from useRelay()
- Pill View:
  paddingHorizontal 10, paddingVertical 5, borderRadius 20
  flexDirection row, alignItems center, gap 6
  backgroundColor: isRelaying ? 'rgba(0,200,83,0.1)' : 'rgba(255,255,255,0.05)'
  borderWidth 1, borderColor: isRelaying ? '#00C853' : '#333'
- Left dot: 6x6, borderRadius 3,
  backgroundColor: isRelaying ? '#00C853' : '#333'
- Right text: isRelaying ? 'MESH ACTIVE' : 'MESH INACTIVE'
  fontSize 9, fontWeight '700', letterSpacing 2
  color: isRelaying ? '#00C853' : '#444'

TypeScript. StyleSheet.
```

---

## SARFARAZ — Prompt 5 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/relay/
At the end write: FILES CREATED: [list]
Confirm no file is outside src/relay/.
════════════════════════════════════════════════

Final step for relay module.

LOCKED IMPORTS:
  import { useRelay } from './useRelay'
  import { clearCache, getCacheSize } from './debounceCache'
  useRelay() gives: { isRelaying, relayCount, startRelaying, stopRelaying }

Task: Dev-only debug panel.

FILE: src/relay/RelayDebugPanel.tsx

if (!__DEV__) return null  ← first line of component body

Toggle: local useState showPanel (default false)
When hidden: fixed 28x28 square button, bottom 8, right 8
  backgroundColor '#111', borderWidth 1 borderColor '#333'
  Text "D" fontSize 10 fontWeight '700' color '#666'
  onPress: setShowPanel(true)

When visible: fixed panel bottom 0, left 0, right 0, height 220
  backgroundColor 'rgba(10,10,10,0.96)', borderTopWidth 1 borderTopColor '#1C1C1C'
  padding 16, fontFamily 'monospace'

Content:
Row 1: "[RELAY DEBUG]" fontSize 10 letterSpacing 2 color '#666'
Row 2 (flexDirection row, gap 16):
  "status: {isRelaying ? 'ACTIVE' : 'INACTIVE'}"
  "relays: {relayCount}"
  "cache: {getCacheSize()}"
  Each: fontSize 11 color '#CCC'

Log list (ScrollView, last 5 entries):
  Watch relayCount with useEffect — on increment push:
  ">> relayed at {new Date().toTimeString().slice(0,8)}"
  to local log array (cap 5, newest first)
  Each entry: fontSize 11 color '#888' fontFamily 'monospace'

Two buttons (flexDirection row, gap 8, marginTop 8):
  "CLEAR CACHE": onPress clearCache(), borderWidth 1 borderColor '#333' color '#888'
  "SIM SOS": onPress → fake relay log entry 'SIM-TEST-001'
  Both: fontSize 10 paddingHorizontal 12 paddingVertical 6

Close button: text "CLOSE" fontSize 9 color '#555' marginTop 8 onPress setShowPanel(false)

TypeScript. StyleSheet. Export default.

FINAL FILE LIST for src/relay/:
- debounceCache.ts
- relayJitter.ts
- useRelay.ts
- RelayEngine.tsx
- RelayDebugPanel.tsx
```

---
---

# --user_adnan
# ADNAN — Rescue Dashboard (Listener / Role C)
> Branch: `feat/adnan-dashboard`
> Folder: `src/dashboard/` ONLY
> You can start immediately in parallel

---

## ADNAN — Prompt 1 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/dashboard/
Do NOT create files in src/shared/, src/bootstrap/, src/broadcaster/,
src/relay/, src/permissions/, or android/.
Do NOT rewrite shared files — only import from them.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

You are a Senior React Native TypeScript developer.
App: "Portable Anchors" — Android-only BLE mesh SOS system.

LOCKED IMPORTS (use exactly — do not rename):
  import { SOS_SERVICE_UUID } from '../shared/bleConstants'
  import { useAppStore } from '../shared/store'
  import { DetectedDevice, SOSPacket, getRSSIState, RSSI_COLORS } from '../shared/types'
  useAppStore() gives: { detectedDevices, upsertDevice, clearDevices, setRole }
  setRole accepts: 'idle' | 'broadcaster' | 'relay' | 'listener'

Task: BLE listener hook.

FILE: src/dashboard/useListener.ts

Export signature (locked):
  export const useListener = () => {
    return { isScanning, startListening, stopListening, sortedDevices }
  }

State: isScanning (boolean)
Ref: managerRef (BleManager | null)

startListening():
  store.setRole('listener')
  const manager = new BleManager()
  managerRef.current = manager
  setIsScanning(true)
  manager.startDeviceScan([SOS_SERVICE_UUID], { allowDuplicates: true }, (error, device) => {
    if (error || !device) return
    let packet: SOSPacket
    try {
      const raw = device.manufacturerData
        ? Buffer.from(device.manufacturerData, 'base64').toString('utf8') : ''
      packet = JSON.parse(raw)
    } catch { packet = { userId: device.id, timestamp: Date.now() } }
    const detected: DetectedDevice = {
      id: device.id,
      rssi: device.rssi ?? -99,
      packet,
      lastSeen: Date.now(),
    }
    store.upsertDevice(detected)
  })

stopListening():
  managerRef.current?.stopDeviceScan()
  store.setRole('idle')
  setIsScanning(false)

sortedDevices: useMemo or inline sort of detectedDevices by rssi descending

Cleanup interval (every 5000ms): console.log('[Listener] stale cleanup ran')
Cleanup on unmount: stopListening()

TypeScript. All null/undefined handled.
```

---

## ADNAN — Prompt 2 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/dashboard/
Do NOT create files anywhere else.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors dashboard module.

LOCKED IMPORTS (use exactly):
  import { useAppStore } from '../shared/store'
  import { DetectedDevice, getRSSIState, RSSI_COLORS, RSSIState } from '../shared/types'
  getRSSIState(rssi) returns: 'hot' | 'warm' | 'cold'
  RSSI_COLORS = { hot: '#00C853', warm: '#FFD600', cold: '#2979FF' }
  DetectedDevice = { id, rssi, packet: { userId, medicalTag?, timestamp }, lastSeen }

Task: Full-screen RSSI radar.

FILE: src/dashboard/RadarScreen.tsx

Props: { device: DetectedDevice, onBack: () => void }

Local state:
  rssi (number) — live updated
  rssiHistory (number[], max 20)

Update interval (500ms useEffect):
  Read latest device from store by id → update rssi, push to rssiHistory

Derived: currentState = getRSSIState(rssi), currentColor = RSSI_COLORS[currentState]

═══ LAYOUT (full screen, backgroundColor '#0A0A0A') ═══

TOP BAR (paddingTop 48, paddingHorizontal 24, flexDirection row, alignItems center):
  Back button: 40x40, borderWidth 1 borderColor '#222' borderRadius 4
    Text "<" fontSize 18 color white. onPress: onBack()
  Center text: device.packet.userId fontSize 13 fontWeight '700' color white flex 1 textAlign center
  Right: "LIVE" fontSize 9 letterSpacing 3 color '#666'
    + 6x6 circle borderRadius 3 backgroundColor '#00C853'
    Animated.loop opacity 1→0.3→1 over 1000ms

MAIN (flex 1, justifyContent center, alignItems center):

Concentric circles (all absolutely positioned and centered):
  Outer:  260x260, borderRadius 130, borderWidth 1.5, borderColor currentColor + '33'
  Middle: 190x190, borderRadius 95,  borderWidth 1.5, borderColor currentColor + '66'
  Inner:  130x130, borderRadius 65,  backgroundColor currentColor + '14',
                                     borderWidth 1.5, borderColor currentColor + 'CC'
Animate scale: Animated.loop Animated.sequence
  [ timing 1→1.04 over 1200ms, timing 1.04→1 over 1200ms ]
Apply to a wrapper View around all three.

Inside inner circle (centered via absolute):
  RSSI number: String(rssi) fontSize 36 fontWeight '900' color currentColor
  "dBm": fontSize 12 color currentColor opacity 0.7 letterSpacing 1

Below circles:
  State label: hot→"CLOSE" | warm→"WARMING" | cold→"SEARCHING"
    fontSize 22 fontWeight '800' letterSpacing 6 color white marginTop 24
  Sublabel: hot→"Keep your current heading"
             warm→"Move toward stronger signal"
             cold→"Change direction and scan"
    fontSize 12 color '#666' letterSpacing 1 marginTop 6

Signal bars (marginTop 24, flexDirection row, alignItems flex-end):
  5 bars, heights [12,18,26,34,42], width 6, borderRadius 3, marginHorizontal 3
  activeCount = Math.max(1, Math.min(5, Math.round((rssi + 100) / 12)))
  Active bars: backgroundColor currentColor | Inactive: backgroundColor '#222'

BOTTOM (padding 24):
  If medicalTag: pill borderWidth 1 borderColor '#E8001C' borderRadius 4
    paddingHorizontal 12 paddingVertical 6
    Text: medicalTag fontSize 11 fontWeight '700' color '#E8001C' letterSpacing 1
  "Last updated {X}s ago" fontSize 10 color '#444' marginTop 8

No emojis. No icon libraries. StyleSheet only. TypeScript. Export default.
```

---

## ADNAN — Prompt 3 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to modify files inside:
  → src/dashboard/
Do NOT create files anywhere else.
At the end write: FILES MODIFIED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors dashboard module.

Task: Add trend indicator + sparkline to RadarScreen.tsx.
Show COMPLETE updated file.

ADDITION 1 — Trend Indicator (insert between state label and signal bars):

  const prevRssi = rssiHistory.length >= 6 ? rssiHistory[rssiHistory.length - 6] : null
  const latestRssi = rssiHistory[rssiHistory.length - 1] ?? rssi
  const diff = prevRssi !== null ? latestRssi - prevRssi : 0
  const trend = diff > 3 ? 'improving' : diff < -3 ? 'retreating' : 'stable'

  Display row (flexDirection row, alignItems center, marginTop 12):
    Arrow View (no icon library):
      improving: two 10x2 Views, one rotated -45deg, one rotated 45deg, color '#00C853'
      retreating: same but rotated +45deg / +135deg, color '#E8001C'
      stable: one 14x2 View, color '#FFD600'
    Trend text (marginLeft 6):
      improving → "APPROACHING" color '#00C853'
      retreating → "MOVING AWAY" color '#E8001C'
      stable → "STABLE" color '#FFD600'
      fontSize 10 fontWeight '700' letterSpacing 3

ADDITION 2 — SparkLine (define in same file, insert below trend row):

  const SparkLine = ({ data, height, color }: { data: number[], height: number, color: string }) => {
    if (!data.length) return null
    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height }}>
        {data.map((v, i) => {
          const barH = Math.max(2, ((v + 100) / 100) * height)
          return <View key={i} style={{ width: 3, height: barH, borderRadius: 1,
                   marginHorizontal: 1, backgroundColor: color }} />
        })}
      </View>
    )
  }

  Render: <SparkLine data={rssiHistory} height={32} color={currentColor} />

Keep all existing RadarScreen.tsx code intact. TypeScript.
```

---

## ADNAN — Prompt 4 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to create files inside:
  → src/dashboard/
Do NOT create files anywhere else.
At the end write: FILES CREATED: [list]
════════════════════════════════════════════════

Continuing Portable Anchors dashboard module.

LOCKED IMPORTS (use exactly):
  import { useListener } from './useListener'
  import RadarScreen from './RadarScreen'
  import { useAppStore } from '../shared/store'
  import { DetectedDevice, getRSSIState, RSSI_COLORS } from '../shared/types'
  useListener() gives: { isScanning, startListening, stopListening, sortedDevices }
  sortedDevices: DetectedDevice[] sorted by rssi descending

Task: Rescue Dashboard list screen.

FILE: src/dashboard/RescueDashboard.tsx

Local state: selectedDevice (DetectedDevice | null)
If selectedDevice: render <RadarScreen device={selectedDevice} onBack={() => setSelectedDevice(null)} />
  absolute, top 0, left 0, right 0, bottom 0, zIndex 100

═══ MAIN SCREEN (flex 1, backgroundColor '#0A0A0A') ═══

HEADER (paddingTop 52, paddingHorizontal 24, paddingBottom 20,
        borderBottomWidth 1, borderBottomColor '#111'):
  Row 1 (flexDirection row, justifyContent space-between, alignItems flex-start):
    Left:
      "RESCUE DASHBOARD" fontSize 10 fontWeight '700' letterSpacing 4 color '#666'
      "Find & Assist" fontSize 22 fontWeight '800' color white marginTop 2
    Right:
      Scan button: height 36, paddingHorizontal 16, borderRadius 4
        !isScanning → backgroundColor '#E8001C', text "SCAN" fontSize 11 fontWeight '700' letterSpacing 2 color white
        isScanning  → borderWidth 1 borderColor '#333', text "STOP" color '#666'
      onPress: isScanning ? stopListening() : startListening()
  Row 2 (marginTop 16, visible only if isScanning):
    5x5 circle Animated loop opacity 1→0.3, backgroundColor '#E8001C'
    "  SCANNING FOR SOS SIGNALS" fontSize 9 letterSpacing 3 color '#666'

EMPTY STATE (sortedDevices.length === 0):
  flex 1, justifyContent center, alignItems center
  Outer 48x48 square borderWidth 1.5 borderColor '#1C1C1C'
  Inner 24x24 square borderWidth 1 borderColor '#2C2C2C' (absolute centered)
  "NO SIGNALS DETECTED" fontSize 11 fontWeight '700' letterSpacing 3 color '#333' marginTop 20
  "Start scanning to detect\nSOS broadcasts nearby"
    fontSize 12 color '#444' textAlign center marginTop 6 lineHeight 18

LIST (FlatList, paddingHorizontal 24, paddingTop 8, paddingBottom 100):
  Each card (marginBottom 10, backgroundColor '#111', borderRadius 8, padding 16,
    borderLeftWidth 3, borderLeftColor RSSI_COLORS[getRSSIState(device.rssi)],
    flexDirection row, alignItems center):
    Left (flex 1):
      userId fontSize 15 fontWeight '700' color white
      medicalTag (if exists) fontSize 11 color '#666' marginTop 2
      "Last seen {Math.round((Date.now()-device.lastSeen)/1000)}s ago"
        fontSize 10 color '#444' marginTop 4
    Right (alignItems flex-end):
      rssi value fontSize 22 fontWeight '900' color RSSI_COLORS[getRSSIState(device.rssi)]
      "dBm" fontSize 9 opacity 0.6 letterSpacing 1 same color
      "TRACK" fontSize 9 fontWeight '700' letterSpacing 3 color '#E8001C' marginTop 4
    If index===0 AND sortedDevices.length>1: show "NEAREST" pill above card
      borderWidth 1 borderColor '#E8001C' borderRadius 3 paddingHorizontal 8 paddingVertical 3
      Text "NEAREST" fontSize 8 fontWeight '800' letterSpacing 2 color '#E8001C'
    onPress: setSelectedDevice(device)

BOTTOM BAR (absolute bottom 0, left 0, right 0, backgroundColor '#0A0A0A',
  borderTopWidth 1 borderTopColor '#111', padding 16):
  isScanning ? sortedDevices.length + " signal(s) active" : "Scanner off"
  fontSize 10 letterSpacing 2 color '#666' textAlign center

TypeScript. StyleSheet. Export default.
```

---

## ADNAN — Prompt 5 of 5

```
════════════════════════════════════════════════
BOUNDARY RULES — READ FIRST, OBEY ALWAYS
You are ONLY allowed to modify files inside:
  → src/dashboard/
At the end write: FILES MODIFIED: [list]
════════════════════════════════════════════════

Final step for dashboard module.

PART 1 — Vibration on HOT zone entry (add to RadarScreen.tsx):

Add this ref: const prevStateRef = useRef<RSSIState | null>(null)

In the 500ms update interval, after computing currentState:
  if (currentState === 'hot' && prevStateRef.current !== 'hot') {
    Vibration.vibrate([0, 80, 60, 80])
  }
  prevStateRef.current = currentState

Show me ONLY the updated interval useEffect block + the new ref declaration.

---

PART 2 — Onboarding modal (add to RescueDashboard.tsx):

Use: import AsyncStorage from '@react-native-async-storage/async-storage'
Key: 'pa_volunteer_onboarded'

On mount: AsyncStorage.getItem('pa_volunteer_onboarded').then(v => { if(!v) setShowOnboarding(true) })
On CTA press: AsyncStorage.setItem('pa_volunteer_onboarded', 'true').then(() => setShowOnboarding(false))

Modal: animationType 'slide', transparent true, visible={showOnboarding}
Overlay: flex 1, justifyContent flex-end, backgroundColor 'rgba(0,0,0,0.7)'
Card: backgroundColor white, borderTopLeftRadius 16, borderTopRightRadius 16, padding 28

Red rule: width 32, height 3, backgroundColor '#E8001C', borderRadius 2, marginBottom 20
"HOW TO FIND SOMEONE" fontSize 10 fontWeight '700' letterSpacing 4 color '#999'
"Your rescue guide" fontSize 24 fontWeight '800' color '#0A0A0A' marginTop 4 marginBottom 24

4 step rows (flexDirection row, marginBottom 16):
  Number circle: 24x24, borderWidth 1.5, borderColor '#E8001C', borderRadius 12
    Text: "1"/"2"/"3"/"4", fontSize 11 fontWeight '700' color '#E8001C', textAlign center
  Text block (marginLeft 12, flex 1):
    Title: fontSize 13 fontWeight '700' color '#0A0A0A'
    Body: fontSize 12 color '#888' marginTop 2

Steps:
  1. "Start Scanning" / "Tap SCAN to detect SOS broadcasts nearby"
  2. "Select a Signal" / "Tap any signal to open the live tracker"
  3. "Follow the Color" / "Green means close. Walk toward stronger signal."
  4. "Share Medical Info" / "Show the medical tag to first responders"

CTA: full width, backgroundColor '#0A0A0A', height 52, borderRadius 8, marginTop 8
  "Got it — Start Helping" fontSize 13 fontWeight '700' color white letterSpacing 1

Show the complete updated RescueDashboard.tsx.
```

---
---

## Final Merge Note for Miran

Run Prompt 5 only after Samran pushes. Copy the exact class names
`ForegroundServicePackage` and `BLEAdvertiserPackage` from Samran's Kotlin files.

```
Merge order:
1. feat/samran-permissions-service → main  (Samran first)
2. feat/miran-bootstrap            → main  (Prompts 1–4 then Prompt 5 last)
3. feat/irfan-broadcaster          → main  (any order)
4. feat/sarfaraz-relay             → main  (any order)
5. feat/adnan-dashboard            → main  (any order)
```
