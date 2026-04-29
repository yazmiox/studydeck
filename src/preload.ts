import { contextBridge, ipcRenderer } from "electron";
import type { AppState } from "./types";

contextBridge.exposeInMainWorld("electronAPI", {
    saveApplicationState: (state: AppState) => ipcRenderer.send('save-application-state', state),
    getApplicationState: () => ipcRenderer.invoke('get-application-state'),
    
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    openFile: (path: string) => ipcRenderer.invoke('open-file', path),
    getFileInfo: (path: string) => ipcRenderer.invoke('get-file-info', path),
    
    exportData: (data: string, filename?: string) => ipcRenderer.invoke('export-data', data, filename),
    importData: () => ipcRenderer.invoke('import-data'),
    
    trackEvent: (name: string, props?: any) => ipcRenderer.invoke('track-event', name, props),
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
    openLink: (url: string) => ipcRenderer.invoke('open-link', url)
});