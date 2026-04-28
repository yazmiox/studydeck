import { Plus, LayoutDashboard, Code, Globe, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useAppContext } from "../../context/AppContext";
import { ScrollArea } from "../ui/scroll-area";
import { CourseCard } from "../features/courses/CourseCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { APP_CONFIG } from "../../constants";
import { Separator } from "../ui/separator";

interface SidebarProps {
    selectedCourseId: string | null;
    onSelectCourse: (id: string | null) => void;
    onAddCourse: () => void;
    onEditCourse: (id: string) => void;
}

export function Sidebar({ selectedCourseId, onSelectCourse, onAddCourse, onEditCourse }: SidebarProps) {
    const { state } = useAppContext();

    return (
        <div className="w-64 border-r bg-muted/30 flex flex-col h-full shrink-0">
            <div className="p-4 flex items-center justify-between">
                <h2 className="font-semibold text-sm tracking-tight text-muted-foreground uppercase">Courses</h2>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddCourse}>
                            <Plus className="w-7 h-7" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Add Course (Ctrl+N)</TooltipContent>
                </Tooltip>
            </div>

            <div className="px-3 pb-4">
                <Button
                    variant={selectedCourseId === null ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2 h-9"
                    onClick={() => onSelectCourse(null)}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Button>
            </div>

            <ScrollArea className="flex-1 px-3">
                <div className="space-y-1 pb-4">
                    {state.courses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            isSelected={course.id === selectedCourseId}
                            onClick={() => onSelectCourse(course.id)}
                            onEdit={() => onEditCourse(course.id)}
                        />
                    ))}
                    {state.courses.length === 0 && (
                        <div className="text-sm text-center text-muted-foreground py-4 px-2">
                            No courses added yet. Click + to add one.
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 mt-auto">
                <Separator className="mb-4 opacity-50" />
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Feedback</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 justify-start px-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                            asChild
                        >
                            <a href={`${APP_CONFIG.repoUrl}/issues`} target="_blank" rel="noreferrer">
                                <MessageSquare className="w-3.5 h-3.5 mr-2" />
                                Report an Issue
                            </a>
                        </Button>
                    </div>

                    <div className="pt-2 border-t border-muted-foreground/10">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] text-muted-foreground font-medium">
                                Made with ❤️ by <span className="text-foreground">{APP_CONFIG.author}</span>
                            </p>
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" asChild>
                                            <a href={APP_CONFIG.githubUrl} target="_blank" rel="noreferrer">
                                                <Code className="w-3.5 h-3.5" />
                                            </a>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Source Code</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" asChild>
                                            <a href={APP_CONFIG.portfolioUrl} target="_blank" rel="noreferrer">
                                                <Globe className="w-3.5 h-3.5" />
                                            </a>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Developer Portfolio</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
