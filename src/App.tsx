import { useEffect, useState } from "react";
import { CourseDetail } from "./components/features/courses/CourseDetail";
import { CourseDialog } from "./components/features/courses/CourseDialog";
import { Dashboard } from "./components/features/dashboard/Dashboard";
import { ExamDialog } from "./components/features/exams/ExamDialog";
import { SearchCommand } from "./components/features/search/SearchCommand";
import { SettingsDialog } from "./components/features/settings/SettingsDialog";
import { TelemetryPrompt } from "./components/features/settings/TelemetryPrompt";
import { Layout } from "./components/layout/Layout";
import { useAppContext } from "./context/AppContext";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useTelemetry } from "./hooks/useTelemetry";
import { Course } from "./types";

export function App() {
    const { state, dispatch } = useAppContext();
    const { trackEvent } = useTelemetry();
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    // Track app open
    useEffect(() => {
        trackEvent("app_opened");
    }, []);

    // Dialog states
    const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
    const [courseDialogData, setCourseDialogData] = useState<Course | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
    const [examDialogData, setExamDialogData] = useState<any>(null);

    // Keyboard shortcuts
    useKeyboardShortcuts({
        'ctrl+k': () => setIsSearchOpen(true),
        'ctrl+n': () => {
            setCourseDialogData(null);
            setIsCourseDialogOpen(true);
        },
    });

    const selectedCourse = state.courses.find(c => c.id === selectedCourseId);

    const handleOpenAddCourse = () => {
        setCourseDialogData(null);
        setIsCourseDialogOpen(true);
    };

    const handleOpenEditCourse = (courseId: string) => {
        const course = state.courses.find(c => c.id === courseId);
        if (course) {
            setCourseDialogData(course);
            setIsCourseDialogOpen(true);
        }
    };

    const handleSaveCourse = (name: string, code: string) => {
        if (courseDialogData) {
            dispatch({
                type: 'UPDATE_COURSE',
                payload: {
                    courseId: courseDialogData.id,
                    updates: { name, code }
                }
            });
        } else {
            const newCourse: Course = {
                id: crypto.randomUUID(),
                name,
                code,
                lectures: [],
                exams: [],
                order: state.courses.length,
                createdAt: new Date().toISOString()
            };
            dispatch({ type: 'ADD_COURSE', payload: newCourse });
            trackEvent("course_created");
            setSelectedCourseId(newCourse.id);
        }
    };

    return (
        <Layout
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            onAddCourse={handleOpenAddCourse}
            onEditCourse={handleOpenEditCourse}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
        >
            {selectedCourse ? (
                <CourseDetail course={selectedCourse} />
            ) : (
                <Dashboard
                    onAddCourse={handleOpenAddCourse}
                    onAddExam={() => {
                        setExamDialogData(null);
                        setIsExamDialogOpen(true);
                    }}
                    onEditExam={(exam) => {
                        setExamDialogData(exam);
                        setIsExamDialogOpen(true);
                    }}
                />
            )}

            <CourseDialog
                open={isCourseDialogOpen}
                onOpenChange={setIsCourseDialogOpen}
                onSave={handleSaveCourse}
                initialData={courseDialogData}
            />

            <ExamDialog
                open={isExamDialogOpen}
                onOpenChange={setIsExamDialogOpen}
                onSave={() => trackEvent("exam_created")}
                initialData={examDialogData}
            />

            <SearchCommand
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onSelectCourse={setSelectedCourseId}
            />

            <SettingsDialog
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
            />
            <TelemetryPrompt />
        </Layout>
    );
}
