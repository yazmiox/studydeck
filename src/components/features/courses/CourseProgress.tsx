import { Progress } from "../../ui/progress";
import { cn } from "../../../lib/utils";
import { Lecture } from "../../../types";
import { useCourseProgress } from "../../../hooks/useCourseProgress";

interface CourseProgressProps {
    lectures: Lecture[];
    className?: string;
}

export function CourseProgress({ lectures, className }: CourseProgressProps) {
    const progress = useCourseProgress(lectures);
    const completedCount = lectures.filter(l => l.status === 'done').length;
    const totalCount = lectures.length;

    let indicatorColor = "bg-primary";
    if (progress >= 75) indicatorColor = "bg-emerald-500";
    else if (progress < 50) indicatorColor = "bg-rose-500";
    else indicatorColor = "bg-amber-500";

    return (
        <div className={cn("space-y-1.5", className)}>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{progress}% Complete</span>
                <span>{completedCount} of {totalCount} lectures</span>
            </div>
            <Progress value={progress} className="h-2" indicatorClassName={indicatorColor} />
        </div>
    );
}
