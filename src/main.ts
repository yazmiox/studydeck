import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';
import Store from 'electron-store';
import { initialize, trackEvent } from '@aptabase/electron/main';
import { updateElectronApp } from 'update-electron-app';
import { APP_CONFIG } from './constants';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
import started from 'electron-squirrel-startup';
if (started) {
  app.quit();
}

// Initialize Telemetry
try {
  initialize(APP_CONFIG.aptabaseKey);
} catch (e) {
  console.error('Failed to initialize Aptabase:', e);
}

// Auto updates via GitHub Releases
if (app.isPackaged) {
  updateElectronApp({
    repo: 'yazmiox/studydeck',
    updateInterval: '5 minutes'
  });
}

ipcMain.handle('track-event', (event, name, props) => {
  trackEvent(name, props);
});

ipcMain.handle('check-for-updates', () => {
  // @ts-ignore
  const { autoUpdater } = require('electron');
  try {
    autoUpdater.checkForUpdates();
    return { success: true };
  } catch (error) {
    console.error('Failed to check for updates:', error);
    return { success: false, error: error.message };
  }
});

const store = new Store() as any;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    center: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.removeMenu();
  mainWindow.maximize();
  mainWindow.show();

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http') || url.startsWith('https')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Basic IPC
  ipcMain.on('close-window', () => {
    mainWindow.close();
  });

  // State Persistence
  ipcMain.on('save-application-state', (event, state) => {
    store.set('applicationState', state);
  });

  ipcMain.handle('get-application-state', () => {
    return store.get('applicationState');
  });

  // File Attachments
  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections']
    });

    if (result.canceled) return [];

    const files = await Promise.all(result.filePaths.map(async (filePath) => {
      try {
        const stats = await fs.stat(filePath);
        return {
          name: path.basename(filePath),
          path: filePath,
          size: stats.size
        };
      } catch (err) {
        console.error('Failed to stat file:', filePath, err);
        return null;
      }
    }));

    return files.filter(Boolean);
  });

  ipcMain.handle('open-file', async (event, filePath) => {
    await shell.openPath(filePath);
  });

  ipcMain.handle('get-file-info', async (event, filePath) => {
    try {
      const stats = await fs.stat(filePath);
      return {
        name: path.basename(filePath),
        path: filePath,
        size: stats.size
      };
    } catch (err) {
      return null;
    }
  });

  // Export / Import
  ipcMain.handle('export-data', async (event, jsonData: string, defaultName?: string) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Data',
      defaultPath: defaultName || `${APP_CONFIG.name.toLowerCase()}-export.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });

    if (!result.canceled && result.filePath) {
      await fs.writeFile(result.filePath, jsonData, 'utf-8');
      return true;
    }
    return false;
  });

  ipcMain.handle('import-data', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: `Import ${APP_CONFIG.name} Data`,
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const content = await fs.readFile(result.filePaths[0], 'utf-8');
      return content;
    }
    return null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
