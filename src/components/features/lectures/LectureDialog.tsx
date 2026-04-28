import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

interface LectureDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (name: string) => void;
    initialName?: string;
}

export function LectureDialog({ open, onOpenChange, onSave, initialName }: LectureDialogProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (open) {
            setName(initialName || "");
        }
    }, [open, initialName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave(name.trim());
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialName ? 'Edit Lecture' : 'Add New Lecture'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Lecture Name</label>
                        <Input 
                            id="name" 
                            placeholder="e.g. Set Theory Introduction" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={!name.trim()}>Save Lecture</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
