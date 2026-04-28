import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Paperclip, FileText, ChevronDown, ChevronRight, MoreVertical, Trash, Edit } from "lucide-react";
import { Lecture } from "../../../types";
import { cn } from "../../../lib/utils";
import { STATUS_COLORS, STATUS_LABELS } from "../../../constants";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../ui/dropdown-menu";
import { LectureNotes } from "./LectureNotes";
import { LectureAttachments } from "./LectureAttachments";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface LectureItemProps {
    courseId: string;
    lecture: Lecture;
    onEdit: (lecture: Lecture) => void;
    onDelete: (lectureId: string) => void;
    onChangeStatus: (lectureId: string, status: Lecture['status']) => void;
}

export function LectureItem({ courseId, lecture, onEdit, onDelete, onChangeStatus }: LectureItemProps) {
    const [expanded, setExpanded] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lecture.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={cn(
                "group flex flex-col border rounded-md bg-card transition-all mb-2",
                isDragging ? "opacity-50 shadow-md ring-1 ring-primary relative z-50" : "hover:border-primary/50"
            )}
        >
            <div className="flex items-center p-2 gap-3">
                <div 
                    {...attributes} 
                    {...listeners} 
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 p-1.5 rounded hover:bg-muted"
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="shrink-0 p-1.5 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-border shadow-sm">
                                    <div 
                                        className={cn("w-3.5 h-3.5 rounded-full border shadow-sm transition-colors", STATUS_COLORS[lecture.status].split(' ')[0], "border-black/20 dark:border-white/20")} 
                                    />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {(Object.entries(STATUS_LABELS) as [Lecture['status'], string][]).map(([val, label]) => (
                                    <DropdownMenuItem key={val} onClick={() => onChangeStatus(lecture.id, val)} className="gap-2">
                                        <div className={cn("w-3 h-3 rounded-full border border-black/10 dark:border-white/10", STATUS_COLORS[val].split(' ')[0])} />
                                        {label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent side="right">Change Status</TooltipContent>
                </Tooltip>

                <div 
                    className="flex-1 min-w-0 cursor-pointer flex items-center gap-2 py-1"
                    onClick={() => setExpanded(!expanded)}
                >
                    <span className={cn("font-medium text-sm truncate", lecture.status === 'done' && "text-muted-foreground line-through opacity-70")}>
                        {lecture.name}
                    </span>
                    
                    {lecture.attachments.length > 0 && (
                        <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] gap-1 opacity-80 cursor-pointer">
                            <Paperclip className="w-3 h-3" />
                            {lecture.attachments.length}
                        </Badge>
                    )}
                    {lecture.notes && (
                        <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] opacity-80 cursor-pointer">
                            <FileText className="w-3 h-3" />
                        </Badge>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(lecture)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => onDelete(lecture.id)}>
                            <Trash className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </Button>
            </div>

            {expanded && (
                <div className="p-4 pt-0 border-t bg-muted/10 flex flex-col gap-4 overflow-hidden">
                    <LectureNotes courseId={courseId} lectureId={lecture.id} initialNotes={lecture.notes} />
                    <LectureAttachments courseId={courseId} lectureId={lecture.id} attachments={lecture.attachments} />
                </div>
            )}
        </div>
    );
}
