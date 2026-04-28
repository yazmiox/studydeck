import { Timer } from "lucide-react";
import { cn } from "../../../lib/utils";

interface ExamCountdownProps {
    exam: {
        id: string;
        name: string;
        date: string;
        courseName: string;
    }
}

export function ExamCountdown({ exam }: ExamCountdownProps) {
    const examDate = new Date(exam.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    let colorClass = "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10";
    if (daysLeft <= 7) colorClass = "text-rose-600 dark:text-rose-400 bg-rose-500/10";
    else if (daysLeft <= 14) colorClass = "text-amber-600 dark:text-amber-400 bg-amber-500/10";

    return (
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors group">
            <div className={cn("p-1.5 rounded-full shrink-0", colorClass)}>
                <Timer className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium truncate">{exam.name}</span>
                <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">{exam.courseName}</span>
            </div>
            <div className="text-right shrink-0">
                <span className={cn("text-sm font-bold block", daysLeft === 0 && "text-rose-500 animate-pulse")}>
                    {daysLeft === 0 ? "TODAY" : daysLeft}
                </span>
                {daysLeft !== 0 && (
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block -mt-1 font-medium">Days</span>
                )}
            </div>
        </div>
    );
}
