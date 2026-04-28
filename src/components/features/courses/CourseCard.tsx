import { MoreVertical, Trash, Edit, Download, Upload } from "lucide-react";
import { Course } from "../../../types";
import { cn } from "../../../lib/utils";
import { useCourseProgress } from "../../../hooks/useCourseProgress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { useAppContext } from "../../../context/AppContext";
import { APP_CONFIG } from "@/constants";

interface CourseCardProps {
    course: Course;
    isSelected: boolean;
    onClick: () => void;
    onEdit: () => void;
}

export function CourseCard({ course, isSelected, onClick, onEdit }: CourseCardProps) {
    const progress = useCourseProgress(course.lectures);
    const { dispatch } = useAppContext();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete ${course.name}?`)) {
            dispatch({ type: 'DELETE_COURSE', payload: course.id });
        }
    };

    const handleExport = (e: React.MouseEvent) => {
        e.stopPropagation();
        const dataStr = JSON.stringify(course, null, 2);
        window.electronAPI.exportData(dataStr, `${APP_CONFIG.name} - ${course.code ? course.code + ' - ' : ''}${course.name}.json`);
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "group flex flex-col gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all",
                isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted text-foreground"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex flex-col flex-1 min-w-0">
                    <span className={cn("text-xs font-semibold uppercase tracking-wider opacity-80 truncate", isSelected ? "text-primary-foreground" : "text-muted-foreground")}>
                        {course.code || "COURSE"}
                    </span>
                    <span className="font-medium text-sm truncate">
                        {course.name}
                    </span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                                isSelected ? "text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground" : ""
                            )}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                            <Edit className="h-4 w-4 mr-2" /> Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExport}>
                            <Upload className="h-4 w-4 mr-2" /> Export Course
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={handleDelete}>
                            <Trash className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
                <Progress
                    value={progress}
                    className={cn("h-1.5 flex-1", isSelected ? "bg-primary-foreground/20" : "")}
                    dynamicColor={!isSelected}
                    indicatorClassName={cn(isSelected ? "bg-primary-foreground" : "")}
                />
                <span className={cn("text-[10px] font-medium", isSelected ? "opacity-90" : "text-muted-foreground")}>
                    {progress}%
                </span>
            </div>
        </div>
    );
}
