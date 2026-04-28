import { Course } from "../../../types";
import { CourseProgress } from "./CourseProgress";
import { LectureList } from "../lectures/LectureList";

interface CourseDetailProps {
    course: Course;
}

export function CourseDetail({ course }: CourseDetailProps) {
    return (
        <div className="max-w-4xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold tracking-wider">
                        {course.code || 'COURSE'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        Added {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-6">{course.name}</h1>
                
                <div className="bg-card border rounded-lg p-5 shadow-sm">
                    <CourseProgress lectures={course.lectures} />
                </div>
            </div>

            <LectureList course={course} />
        </div>
    );
}
