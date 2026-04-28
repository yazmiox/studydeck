import type { AppState } from '../types';

export interface FileInfo {
    name: string;
    path: string;
    size: number;
}

export interface IElectronAPI {
    saveApplicationState: (state: AppState) => void;
    getApplicationState: () => Promise<AppState | null>;
    openFileDialog: () => Promise<FileInfo[]>;
    openFile: (path: string) => Promise<void>;
    getFileInfo: (path: string) => Promise<FileInfo | null>;
    exportData: (data: string) => Promise<boolean>;
    importData: () => Promise<string | null>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
