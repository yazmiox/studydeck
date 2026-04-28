import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Moon, Sun, Download, Upload, Info } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import { APP_CONFIG } from "../../../constants";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { state, dispatch } = useAppContext();

    const handleExport = async () => {
        const dataStr = JSON.stringify(state, null, 2);
        const success = await window.electronAPI.exportData(dataStr, `${APP_CONFIG.name} - Full Backup.json`);
        if (success) {
            // Optional: Show a toast notification here
        }
    };

    const handleImport = async () => {
        const jsonData = await window.electronAPI.importData();
        if (jsonData) {
            try {
                const parsed = JSON.parse(jsonData);

                // Case 1: Full Backup (contains 'courses' array)
                if (parsed.courses && Array.isArray(parsed.courses)) {
                    if (window.confirm("This will overwrite your current data with the full backup. Proceed?")) {
                        dispatch({ type: 'LOAD_STATE', payload: parsed });
                    }
                }
                // Case 2: Single Course (contains 'name' and 'lectures' array)
                else if (parsed.name && Array.isArray(parsed.lectures)) {
                    if (window.confirm(`Found course "${parsed.name}". Add it to your current courses?`)) {
                        const newCourse = {
                            ...parsed,
                            id: crypto.randomUUID() // Assign new unique ID to avoid duplicates
                        };
                        dispatch({ type: 'ADD_COURSE', payload: newCourse });
                    }
                }
                else {
                    alert(`Invalid file format. This doesn't seem to be a ${APP_CONFIG.name} backup or a course export.`);
                }
            } catch (err) {
                alert("Failed to parse JSON file.");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appearance</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Dark Mode</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => dispatch({ type: 'SET_DARK_MODE', payload: !state.isDarkMode })}
                            >
                                {state.isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                                {state.isDarkMode ? 'Light' : 'Dark'}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data</h4>
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" className="justify-start" onClick={handleExport}>
                                <Upload className="w-4 h-4 mr-2" /> Export All Data
                            </Button>
                            <Button variant="outline" className="justify-start" onClick={handleImport}>
                                <Download className="w-4 h-4 mr-2" /> Import Data
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1">Importing will overwrite your current progress.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Keyboard Shortcuts</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Global Search</span>
                                <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs border">Ctrl + K</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">New Course</span>
                                <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs border">Ctrl + N</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">New Lecture</span>
                                <kbd className="px-2 py-1 bg-muted rounded font-mono text-xs border">Ctrl + L</kbd>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Updates</h4>
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={async () => {
                                    try {
                                        await window.electronAPI.checkForUpdates();
                                        alert("Checking for updates... If an update is available, it will download in the background.");
                                    } catch (err) {
                                        alert("Manual update check failed. This is normal in development mode. The app will check automatically in production.");
                                    }
                                }}
                            >
                                Check for Updates
                            </Button>
                        </div>

                        <div className="pt-2">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Info className="w-4 h-4" />
                                <span>{APP_CONFIG.name} v{APP_CONFIG.version}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
