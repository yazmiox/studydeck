import { useState, useEffect } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Textarea } from "../../ui/textarea";

interface LectureNotesProps {
    courseId: string;
    lectureId: string;
    initialNotes: string;
}

export function LectureNotes({ courseId, lectureId, initialNotes }: LectureNotesProps) {
    const [notes, setNotes] = useState(initialNotes);
    const { dispatch } = useAppContext();

    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);

    const handleBlur = () => {
        if (notes !== initialNotes) {
            dispatch({
                type: 'UPDATE_LECTURE',
                payload: { courseId, lectureId, updates: { notes } }
            });
        }
    };

    return (
        <div className="space-y-2 mt-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</h4>
            <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleBlur}
                placeholder="Add notes about this lecture..."
                className="min-h-[100px] resize-y bg-background"
            />
        </div>
    );
}
