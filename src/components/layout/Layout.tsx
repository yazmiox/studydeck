import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TooltipProvider } from "../ui/tooltip";

interface LayoutProps {
    children: React.ReactNode;
    selectedCourseId: string | null;
    onSelectCourse: (id: string | null) => void;
    onAddCourse: () => void;
    onEditCourse: (id: string) => void;
    onOpenSearch: () => void;
    onOpenSettings: () => void;
}

export function Layout({ 
    children, 
    selectedCourseId, 
    onSelectCourse, 
    onAddCourse,
    onEditCourse,
    onOpenSearch,
    onOpenSettings
}: LayoutProps) {
    return (
        <TooltipProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
                <Sidebar 
                    selectedCourseId={selectedCourseId}
                    onSelectCourse={onSelectCourse}
                    onAddCourse={onAddCourse}
                    onEditCourse={onEditCourse}
                />
                <div className="flex flex-col flex-1 min-w-0">
                    <Header 
                        onOpenSearch={onOpenSearch}
                        onOpenSettings={onOpenSettings}
                    />
                    <main className="flex-1 overflow-auto bg-card relative">
                        {children}
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}
