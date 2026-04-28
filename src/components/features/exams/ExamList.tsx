import { ExamCountdown } from "./ExamCountdown";
import { useAppContext } from "../../../context/AppContext";

export function ExamList() {
    const { state } = useAppContext();
    
    // Flatten exams from all courses
    const allExams = state.courses.flatMap(c => 
        c.exams.map(e => ({ ...e, courseName: c.name }))
    );

    // Sort by nearest date (keep past exams for today, filter older)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingExams = allExams
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (upcomingExams.length === 0) return null;

    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Upcoming Exams</h3>
            <div className="space-y-1">
                {upcomingExams.slice(0, 5).map(exam => (
                    <ExamCountdown key={exam.id} exam={exam} />
                ))}
            </div>
        </div>
    );
}
