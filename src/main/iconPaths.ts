import fs from 'fs';
import path from 'path';
import { app } from 'electron';

/**
 * Writable per-user folder where runtime icons live.
 * Windows: %APPDATA%/stm32_usb_hid_tool_v2/database
 */
export function getUserDatabaseDir(): string {
  return path.join(app.getPath('userData'), 'database');
}

/**
 * Read-only folder where icons shipped with the installer live.
 * - Packaged: next to the .exe (placed there by electron-builder `extraFiles`).
 * - Dev: build/database (placed there by CopyWebpackPlugin in webpack.preload.js).
 */
export function getBundledDatabaseDir(): string {
  if (app.isPackaged) {
    return path.join(path.dirname(app.getPath('exe')), 'database');
  }
  return path.join(app.getAppPath(), 'build', 'database');
}

/**
 * One-time copy of bundled defaults into the writable folder. A `.seeded`
 * marker prevents re-seeding so the user can delete defaults permanently.
 */
export function seedDefaultIcons(): void {
  const target = getUserDatabaseDir();
  fs.mkdirSync(target, { recursive: true });

  const marker = path.join(target, '.seeded');
  if (fs.existsSync(marker)) return;

  const source = getBundledDatabaseDir();
  if (fs.existsSync(source)) {
    for (const name of fs.readdirSync(source)) {
      const src = path.join(source, name);
      const dst = path.join(target, name);
      try {
        if (fs.statSync(src).isFile() && !fs.existsSync(dst)) {
          fs.copyFileSync(src, dst);
        }
      } catch (err) {
        console.error('seedDefaultIcons: failed to copy', src, err);
      }
    }
  }

  fs.writeFileSync(marker, new Date().toISOString());
}

/**
 * Resolve `name` to an absolute path inside the user database, with
 * basename sanitisation to block path traversal from a URL.
 */
export function resolveUserIconPath(name: string): string {
  return path.join(getUserDatabaseDir(), path.basename(name));
}
