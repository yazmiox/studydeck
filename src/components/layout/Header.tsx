import { Search, Settings, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { APP_CONFIG } from "@/constants";

interface HeaderProps {
    onOpenSearch: () => void;
    onOpenSettings: () => void;
}

export function Header({ onOpenSearch, onOpenSettings }: HeaderProps) {
    return (
        <header className="flex h-14 items-center justify-between border-b px-6 shrink-0 bg-card">
            <div className="flex items-center gap-2 font-semibold text-lg text-primary">
                <BookOpen className="w-5 h-5" />
                <span>{APP_CONFIG.name}</span>
            </div>

            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={onOpenSearch} className="text-muted-foreground w-48 justify-start">
                            <Search className="w-4 h-4 mr-2" />
                            <span>Search...</span>
                            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Search Courses and Lectures (Ctrl+K)</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onOpenSettings}>
                            <Settings className="w-5 h-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Settings</TooltipContent>
                </Tooltip>
            </div>
        </header>
    );
}
