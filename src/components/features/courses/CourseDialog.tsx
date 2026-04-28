import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Course } from "../../../types";

interface CourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (name: string, code: string) => void;
    initialData?: Course | null;
}

export function CourseDialog({ open, onOpenChange, onSave, initialData }: CourseDialogProps) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    useEffect(() => {
        if (open) {
            setName(initialData?.name || "");
            setCode(initialData?.code || "");
        }
    }, [open, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave(name.trim(), code.trim());
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Course Name</label>
                        <Input 
                            id="name" 
                            placeholder="e.g. Discrete Mathematics" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-medium">Course Code (Optional)</label>
                        <Input 
                            id="code" 
                            placeholder="e.g. CSE 101" 
                            value={code} 
                            onChange={e => setCode(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={!name.trim()}>Save Course</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
