import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command";
import { BookOpen, FileText } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";

interface SearchCommandProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectCourse: (id: string) => void;
}

export function SearchCommand({ open, onOpenChange, onSelectCourse }: SearchCommandProps) {
    const { state } = useAppContext();

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Search courses and lectures..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Courses">
                    {state.courses.map(course => (
                        <CommandItem 
                            key={course.id} 
                            onSelect={() => {
                                onSelectCourse(course.id);
                                onOpenChange(false);
                            }}
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>{course.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">{course.code}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Lectures">
                    {state.courses.flatMap(course => 
                        course.lectures.map(lecture => (
                            <CommandItem 
                                key={lecture.id}
                                onSelect={() => {
                                    onSelectCourse(course.id);
                                    onOpenChange(false);
                                }}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                <span>{lecture.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground">in {course.name}</span>
                            </CommandItem>
                        ))
                    )}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
