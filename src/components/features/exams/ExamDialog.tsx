import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../../../lib/utils";
import { useAppContext } from "../../../context/AppContext";
import { Exam } from "../../../types";

interface ExamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: () => void;
    initialData?: Exam & { courseId?: string };
}

export function ExamDialog({ open, onOpenChange, onSave, initialData }: ExamDialogProps) {
    const { state, dispatch } = useAppContext();
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [courseId, setCourseId] = useState("");
    const [time, setTime] = useState("");
    const [showCountdown, setShowCountdown] = useState(true);

    // Reset when opened
    useEffect(() => {
        if (open) {
            setName(initialData?.name || "");
            setDate(initialData?.date || "");
            setTime(initialData?.time || "");
            setShowCountdown(initialData?.showCountdown || false);
            setCourseId(initialData?.courseId || (state.courses.length > 0 ? state.courses[0].id : ""));
        }
    }, [open, state.courses, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !date || !courseId) return;

        if (initialData) {
            dispatch({
                type: 'UPDATE_EXAM',
                payload: {
                    courseId,
                    examId: initialData.id,
                    updates: {
                        name: name.trim(),
                        date,
                        time: time || undefined,
                        showCountdown
                    }
                }
            });
        } else {
            dispatch({
                type: 'ADD_EXAM',
                payload: {
                    id: crypto.randomUUID(),
                    name: name.trim(),
                    date,
                    time: time || undefined,
                    showCountdown,
                    courseId
                }
            });
            onSave?.();
        }

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Upcoming Exam</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label htmlFor="courseId" className="text-sm font-medium">Select Course</label>
                        <select
                            id="courseId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={courseId}
                            onChange={e => setCourseId(e.target.value)}
                            required
                        >
                            {state.courses.length === 0 && <option value="" disabled>No courses available</option>}
                            {state.courses.map(course => (
                                <option key={course.id} value={course.id}>{course.code} {course.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="examName" className="text-sm font-medium">Exam Name</label>
                        <Input
                            id="examName"
                            placeholder="e.g. Midterm, Final, CT-1"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 flex flex-col">
                            <label htmlFor="examDate" className="text-sm font-medium">Exam Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(parseISO(date), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date ? parseISO(date) : undefined}
                                        onSelect={(d) => setDate(d ? format(d, "yyyy-MM-dd") : "")}
                                        initialFocus
                                        fixedWeeks
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <label htmlFor="examTime" className="text-sm font-medium">Time (Optional)</label>
                            <Input
                                id="examTime"
                                type="time"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="w-full font-normal"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="showCountdown"
                            checked={showCountdown}
                            onChange={(e) => setShowCountdown(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="showCountdown" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Show live countdown on Dashboard
                        </label>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={!name.trim() || !date || !courseId || state.courses.length === 0}>Save Exam</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
