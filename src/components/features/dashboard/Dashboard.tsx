import { useMemo, useState, useEffect } from "react";
import { BookOpen, Calendar, GraduationCap, Clock, Sparkles, Edit, Trash, Plus } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import { useTotalProgress } from "../../../hooks/useCourseProgress";
import { DashboardCard } from "./DashboardCard";
import { Progress } from "../../ui/progress";
import { Badge } from "../../ui/badge";
import { CircularProgress } from "../../ui/circular-progress";
import { Button } from "../../ui/button";
import { format, differenceInDays, differenceInSeconds, isFuture, parseISO } from "date-fns";
import { Exam } from "../../../types";
import { useConfirm } from "../../../hooks/useConfirm";

interface DashboardProps {
    onAddCourse: () => void;
    onAddExam: () => void;
    onEditExam: (exam: Exam & { courseId: string }) => void;
}

export function Dashboard({ onAddCourse, onAddExam, onEditExam }: DashboardProps) {
    const { state, dispatch } = useAppContext();
    const { courses } = state;
    const overallProgress = useTotalProgress(courses);
    const { confirm, ConfirmDialog } = useConfirm();

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const stats = useMemo(() => {
        const totalLectures = courses.reduce((acc, c) => acc + c.lectures.length, 0);
        const completedLectures = courses.reduce((acc, c) =>
            acc + c.lectures.filter(l => l.status === 'done').length, 0
        );

        const allExams = courses.flatMap(c =>
            c.exams.map(e => ({ ...e, courseName: c.name, courseCode: c.code }))
        );

        // Ensure exams have a proper datetime string
        const examsWithDate = allExams.map(e => {
            const timeStr = e.time ? `${e.time}:00` : "23:59:59";
            return { ...e, fullDate: parseISO(`${e.date}T${timeStr}`) };
        });

        const upcomingExams = examsWithDate
            .filter(e => isFuture(e.fullDate))
            .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

        const nextExamWithCountdown = upcomingExams.find(e => e.showCountdown);

        return {
            totalLectures,
            completedLectures,
            upcomingExams,
            nextExamWithCountdown
        };
    }, [courses]);

    // Empty state
    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground animate-in fade-in duration-700">
                <div className="bg-primary/5 p-6 rounded-full mb-6">
                    <Sparkles className="w-16 h-16 text-primary/60" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Let's map out your semester</h2>
                <p className="max-w-md mb-8 text-base">
                    You haven't added any courses yet. Start by adding your first course to track lectures, assignments, and exams.
                </p>
                <div className="flex gap-4">
                    <Button size="lg" onClick={onAddCourse}>Add Your First Course</Button>
                </div>
            </div>
        );
    }

    // Timer calculation
    let timerDisplay = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    let timerMessage = "";
    if (stats.nextExamWithCountdown) {
        const diffSeconds = Math.max(0, differenceInSeconds(stats.nextExamWithCountdown.fullDate, currentTime));
        timerDisplay = {
            days: Math.floor(diffSeconds / (3600 * 24)),
            hours: Math.floor((diffSeconds % (3600 * 24)) / 3600),
            minutes: Math.floor((diffSeconds % 3600) / 60),
            seconds: diffSeconds % 60,
        };

        if (timerDisplay.days > 7) {
            timerMessage = "Pace yourself, you have plenty of time.";
        } else if (timerDisplay.days >= 3) {
            timerMessage = "Crunch time is approaching! Keep revising.";
        } else {
            timerMessage = "You've got this! Final stretch.";
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 space-y-10 animate-in fade-in duration-500">
            <header className="space-y-1 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                    <p className="text-muted-foreground">Track your academic progress and upcoming milestones.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={onAddCourse}>Add Course</Button>
                    <Button variant="secondary" size="sm" onClick={onAddExam}>Add Exam</Button>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Circular Progress inside the first card */}
                <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow col-span-1 md:col-span-2 lg:col-span-1 min-w-0 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Progress</span>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <CircularProgress value={overallProgress} size={85} strokeWidth={8} showValue={true} className="shrink-0" />
                        <span className="text-sm text-muted-foreground font-medium">
                            {stats.completedLectures} of {stats.totalLectures} lectures done
                        </span>
                    </div>
                </div>

                <DashboardCard
                    title="Active Courses"
                    value={courses.length}
                    icon={<BookOpen className="w-5 h-5" />}
                    subtitle="Currently enrolled"
                />

                {/* Countdown Timer Widget (takes 2 columns) */}
                <div className="bg-card border rounded-xl p-6 shadow-sm col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Next Major Exam</span>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    {stats.nextExamWithCountdown ? (
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="text-xl font-bold">{stats.nextExamWithCountdown.name}</h4>
                                    <div className="flex items-center gap-2.5 mt-1.5">
                                        <Badge variant="outline" className="text-xs py-0.5 bg-primary/5 border-primary/20 text-primary">{stats.nextExamWithCountdown.courseCode}</Badge>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md border border-border/50">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{format(stats.nextExamWithCountdown.fullDate, 'EEEE, MMM d')}</span>
                                        </div>
                                        {stats.nextExamWithCountdown.time && (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md border border-border/50">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{format(stats.nextExamWithCountdown.fullDate, 'hh:mm a')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 text-center">
                                    <div className="bg-muted px-3 py-2 rounded-md min-w-[60px]">
                                        <div className="text-2xl font-bold font-mono">{timerDisplay.days.toString().padStart(2, '0')}</div>
                                        <div className="text-[10px] uppercase text-muted-foreground font-semibold">Days</div>
                                    </div>
                                    <div className="text-2xl font-bold py-2">:</div>
                                    <div className="bg-muted px-3 py-2 rounded-md min-w-[60px]">
                                        <div className="text-2xl font-bold font-mono">{timerDisplay.hours.toString().padStart(2, '0')}</div>
                                        <div className="text-[10px] uppercase text-muted-foreground font-semibold">Hours</div>
                                    </div>
                                    <div className="text-2xl font-bold py-2 text-muted-foreground/50">:</div>
                                    <div className="bg-muted px-3 py-2 rounded-md min-w-[60px]">
                                        <div className="text-2xl font-bold font-mono">{timerDisplay.minutes.toString().padStart(2, '0')}</div>
                                        <div className="text-[10px] uppercase text-muted-foreground font-semibold">Mins</div>
                                    </div>
                                    <div className="text-2xl font-bold py-2 text-muted-foreground/50">:</div>
                                    <div className="bg-muted px-3 py-2 rounded-md min-w-[60px] opacity-70">
                                        <div className="text-2xl font-bold font-mono">{timerDisplay.seconds.toString().padStart(2, '0')}</div>
                                        <div className="text-[10px] uppercase text-muted-foreground font-semibold">Secs</div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm italic text-muted-foreground text-center">
                                {timerMessage}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center h-[100px]">
                            <span className="text-lg font-medium text-muted-foreground">No countdowns active.</span>
                            <span className="text-sm text-muted-foreground mt-1">Enable "Show countdown" when adding an exam.</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Course Progress Section */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        Course Progress
                    </h3>
                    <div className="space-y-6">
                        {courses.map(course => {
                            const completed = course.lectures.filter(l => l.status === 'done').length;
                            const total = course.lectures.length;
                            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                            return (
                                <div key={course.id} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-medium">{course.name}</p>
                                            <p className="text-xs text-muted-foreground">{course.code}</p>
                                        </div>
                                        <span className="text-xs font-semibold">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" dynamicColor={true} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Exams Section */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            All Upcoming Exams
                        </h3>
                        <Button variant="ghost" size="sm" onClick={onAddExam} className="h-8 px-2 text-primary hover:bg-primary/10">
                            <Plus className="w-4 h-4 mr-1" /> Add Exam
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {stats.upcomingExams.length > 0 ? (
                            stats.upcomingExams.map(exam => (
                                <div key={exam.id} className="group flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:border-primary/30 transition-colors">
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold truncate">{exam.name}</p>
                                            {exam.showCountdown && (
                                                <Badge variant="secondary" className="text-[9px] h-4 px-1 py-0 bg-primary/20 text-primary border-none shrink-0">
                                                    Timer
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                            <Badge variant="outline" className="text-[11px] py-0 shrink-0">{exam.courseCode}</Badge>
                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded-full border border-border/50">
                                                <Calendar className="w-3 h-3" />
                                                <span>{format(exam.fullDate, 'MMM d, yyyy')}</span>
                                            </div>
                                            {exam.time && (
                                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded-full border border-border/50">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{format(exam.fullDate, 'hh:mm a')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right shrink-0">
                                            <p className="text-[12px] font-bold text-primary">
                                                {differenceInDays(exam.fullDate, new Date())}d left
                                            </p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => onEditExam(exam)}
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                onClick={async () => {
                                                    if (await confirm(`Delete exam "${exam.name}"?`, "Delete Exam")) {
                                                        dispatch({ type: 'DELETE_EXAM', payload: { courseId: exam.courseId, examId: exam.id } });
                                                    }
                                                }}
                                            >
                                                <Trash className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No upcoming exams scheduled.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {ConfirmDialog}
        </div>
    );
}
