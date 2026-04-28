import { useEffect } from 'react';

type ShortcutAction = () => void;

interface ShortcutMap {
    [key: string]: ShortcutAction;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Determine the shortcut string
            let keyStr = '';
            if (e.ctrlKey || e.metaKey) keyStr += 'ctrl+';
            if (e.shiftKey) keyStr += 'shift+';
            if (e.altKey) keyStr += 'alt+';
            
            keyStr += e.key.toLowerCase();

            // e.g., 'ctrl+k', 'escape', 'ctrl+n'
            const action = shortcuts[keyStr] || shortcuts[e.key.toLowerCase()];

            if (action) {
                // Prevent default behavior if shortcut is handled
                e.preventDefault();
                action();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.addEventListener('keydown', handleKeyDown);
        };
    }, [shortcuts]);
}
