# stm32_usb_hid_tool_v2

Electron + React + MUI desktop app that pairs with a custom STM32-based mechanical keyboard over USB HID.

## What the app does

Two main views:

1. **Keyboard layout view** — renders the physical key layout and displays each key's analog ADC value (live from HID). Clicking a key opens a real-time chart of the last 10 s of analog readings.
2. **Icon management** — three-panel layout:
   - **Icon Pages tree view** (left) — page hierarchy with subpages
   - **Page configuration** (middle) — 3×3 editable grid for the active page; click a slot to assign an icon + linked program, or create a subpage
   - **Active keyboard display view** (right) — read-only preview of what the keyboard is currently showing

When the user presses a screen-key on the device, firmware sends a HID report; the app updates the active page and pushes the new icon page back to the keyboard.

## Stack

- Electron 34, React 19, MUI 7 (+ `@mui/x-tree-view`, `@mui/lab`)
- Redux Toolkit + `electron-redux` (main↔renderer state sync)
- `node-hid` + `usb` for device communication
- Webpack — separate configs for main / renderer / preload
- `electron-builder` (Windows installer, auto-update via GitHub releases)
- `electron-store` for persisted icon-state JSON

## Key files / data flow

### Main process
- `src/main/main.ts` — entry, BrowserWindow, auto-updater, registers `icon://` protocol
- `src/main/usbManager.ts` — HID open/read/write; dispatches into the Redux store
- `src/main/storeIcons.ts` — seeds defaults, persists icon state, exposes `refreshIconList()`
- `src/main/imageFileReader.ts` — lists `.bmp` files in the writable user folder
- `src/main/iconPaths.ts` — resolves bundled vs userData paths; one-time seed
- `src/main/ipcHandlers.ts` — `icon:add` (file picker → copy → refresh), `icon:refresh`
- `src/main/preload/preload.ts` — exposes `window.ipc_handlers.iconAdd / iconRefresh`

### Renderer
- `src/renderer/App.tsx`, `src/renderer/store/storeRenderer.ts`
- `src/renderer/components/keyboard_layout/` — `KeyboardContainer`, `KeyboardGridComponent`, `KeyboardKeyContainer`, `KeyboardConnectionStatus`, `KeyAnalogChartDialog`, `keyHistoryStore.ts`
- `src/renderer/components/icon_view_setup/` — `IconsViewSetupC` (wrapper with titled Paper panels), `IconPagesViewC` (tree), `IconPageSetupViewC` (editor grid), `IconActiveScreenC` (preview), `IconSetupMenuC` (per-slot dialog), `IconSelectroScreenC` (icon picker + "Add icon" button)

### Shared
- `src/shared/redux/slices/` — `iconStateSlice`, `keyboardKeysStateSlice`, `testSlice` (holds USB `connectState`)
- `src/shared/config/imageArrayConf.ts` — `KEYBOARD_KEYS_LENGTH = 120`, key-name → key-id map
- `src/shared/config/chartConfig.ts` — `KEY_ANALOG_MIN`, `KEY_ANALOG_MAX`, `HISTORY_WINDOW_MS` (global chart settings)

## Where data lives

- **Bundled defaults** at build time: copied from repo `database/` → `build/database/` by CopyWebpackPlugin in `webpack.preload.js`, then to `<install-dir>/database/` by electron-builder `extraFiles`.
- **Runtime icon storage**: `%APPDATA%\stm32_usb_hid_tool_v2\database\` (writable, per-user). On first launch the bundled defaults are copied there; a `.seeded` marker prevents re-copying so the user can permanently delete defaults. The icon-state JSON also lives here.
- **Per-key analog history**: in-memory only (renderer), ring buffer in `keyHistoryStore.ts` — typed arrays, ~1 MB total.

## HID protocol

- Command byte **3** = analog key state (2 bytes/key, little-endian) — coalesced at 60 Hz before dispatch (see `usbManager.ts`)
- Command byte **4** = screen-button press
- Send command **1** = image header
- Send command **2** = image data chunk
- VID `1155`, PID `22288`, interface `1`

## Architectural decisions worth remembering

### Runtime icons are loaded via a custom `icon://` protocol
Renderer HTML lives inside `app.asar` in packaged builds. Using a relative URL like `'../database/...'` only resolves to icons that were bundled at build time. So instead:
1. Main registers `icon://` as a privileged scheme (in `main.ts`, before `app.ready`).
2. `protocol.handle('icon', ...)` maps `icon://<name>` → `userData/database/<name>` via `net.fetch` + `pathToFileURL`.
3. Renderer uses `<img src={'icon://' + encodeURIComponent(name)}>` — works in dev and prod, no relative-path fragility.

### HID dispatch is coalesced at 60 Hz, not per-packet
HID can fire at 1 kHz. Dispatching every packet through Redux + electron-redux + IPC swamps the renderer on slower machines and causes visible lag. `usbManager.ts` buffers the latest value and flushes every 16 ms with "latest wins" semantics + array-equality check. UI sees max 60 updates/sec, no IPC queue buildup. Firmware can run at full HID rate.

### Per-key analog history lives outside Redux
`keyHistoryStore.ts` is a module-level ring buffer (per-key `Float64Array`/`Uint16Array`). One `store.subscribe` in `storeRenderer.ts` detects `aKeyAnalogState` reference changes and records a sample. Keeping this out of Redux avoids: (a) flooding electron-redux with array writes, (b) re-renders of every selector when only the buffer changed. The chart modal subscribes to the store for re-renders only while open.

### Icons folder is in `userData`, not the install dir
Install dir may be read-only (Program Files). On first run, bundled defaults are copied into `userData/database/` and a `.seeded` marker file is written. Subsequent launches skip the copy so user-deleted defaults stay deleted.

## Build / run

```bash
yarn watch                        # webpack dev build with --watch
yarn start                        # launch electron against build/
yarn build_prod                   # one-shot prod webpack
yarn build_dist_only --win        # installer (assumes node-hid already rebuilt)
yarn build_dist_github            # build + publish to GitHub release
```

## App icon

- Source: `assets/generate_icon.ps1` — PowerShell + `System.Drawing`, no extra deps. Re-run the script after editing it to regenerate.
- Outputs: `assets/icon.png` (256×256), `assets/icon.ico` (multi-size 16/24/32/48/64/128/256, PNG-payload).
- `electron-builder` picks up `assets/icon.ico` automatically (`directories.buildResources: "assets"`).
- BrowserWindow uses the icon directly in dev so the taskbar shows it without rebuilding. In packaged builds, the `.exe` icon (set by electron-builder) becomes the window icon automatically.

## Things to watch out for

- `KEYBOARD_KEYS_LENGTH` is 120; not every slot maps to a physical key — `KEYBOARD_KEY_ARRAY` in `imageArrayConf.ts` is the authoritative key-name → key-id map.
- `electron-redux` syncs all dispatches both ways; main can dispatch and the renderer sees it without extra IPC plumbing.
- `package.json` `extraFiles` copies `build/database/*` to install-dir `database/` — this is the *seed source* on first run, not the live runtime location.
- The icon-name placeholder in `IconActiveScreenC` / `IconPageSetupViewC` is `icon://default.bmp` — that file is bundled in `database/`.
- `node-hid` is a native module; after switching machines, run `yarn` then `npx electron-rebuild -f -w node-hid` if HID fails to load.

## Recent significant work (history, not a changelog)

This list exists so a fresh session can pick up cold without re-reading all commits. It is **not** authoritative — `git log` is. Don't extend it for every change.

1. **Post-install icon support** — moved runtime icons to userData, `icon://` protocol, "Add icon" button in the picker dialog with file-dialog → copy → refresh IPC flow.
2. **HID coalescing** — 60 Hz "latest wins" dispatch buffer in `usbManager.ts` to stop slower CPUs from falling behind.
3. **Icon-management UI** — three titled Paper panels with equal heights; both grids now use `aspectRatio: '1 / 1'` and the same `maxWidth: 260` so icons match across views; icon name became a caption overlay instead of a CardContent block.
4. **USB connection chip** — `KeyboardConnectionStatus` above the keyboard reading `testSlice.connectState`.
5. **Per-key analog chart** — click any key → modal with live SVG chart of last 10 s; history captured for all keys continuously via module-level ring buffer; global min/max in `shared/config/chartConfig.ts`.
6. **App icon** — keyboard-themed icon generated by `assets/generate_icon.ps1`.
