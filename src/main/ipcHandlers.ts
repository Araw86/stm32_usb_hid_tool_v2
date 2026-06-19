import fs from 'fs';
import path from 'path';

import { ipcMain, dialog, BrowserWindow, OpenDialogOptions } from 'electron';
import { IpcMainInvokeEvent } from 'electron/main';

import { getUserDatabaseDir } from './iconPaths';
import { refreshIconList } from './storeIcons';

type IconAddResult =
  | { ok: true; added: string[] }
  | { ok: false; reason: 'cancelled' | 'error'; message?: string };

function fIpcHandlers(): void {
  ipcMain.handle('icon:add', async (event: IpcMainInvokeEvent): Promise<IconAddResult> => {
    const parent = BrowserWindow.fromWebContents(event.sender);
    const options: OpenDialogOptions = {
      title: 'Add icon',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Bitmap', extensions: ['bmp'] }],
    };
    const dlg = parent
      ? await dialog.showOpenDialog(parent, options)
      : await dialog.showOpenDialog(options);

    if (dlg.canceled || dlg.filePaths.length === 0) {
      return { ok: false, reason: 'cancelled' };
    }

    const targetDir = getUserDatabaseDir();
    fs.mkdirSync(targetDir, { recursive: true });
    const added: string[] = [];

    try {
      for (const src of dlg.filePaths) {
        const name = path.basename(src);
        const dst = path.join(targetDir, name);
        fs.copyFileSync(src, dst);
        added.push(name);
      }
    } catch (err) {
      console.error('icon:add copy failed', err);
      return { ok: false, reason: 'error', message: String(err) };
    }

    refreshIconList();
    return { ok: true, added };
  });

  ipcMain.handle('icon:refresh', async () => {
    return refreshIconList();
  });
}

const ipcHandlers = fIpcHandlers;

export default ipcHandlers;
