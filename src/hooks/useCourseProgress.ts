import { useMemo } from 'react';
import type { Course, Lecture } from '../types';

export function calculateCourseProgress(lectures: Lecture[]): number {
    if (!lectures || lectures.length === 0) return 0;

    // We consider 'done' as 100% completion for that lecture.
    // 'in_progress' and 'needs_revision' do not count towards the progress bar for simplicity,
    // or they could count as partial, but usually completed = 100%.
    const completed = lectures.filter(l => l.status === 'done').length;
    return Math.round((completed / lectures.length) * 100);
}

export function calculateTotalProgress(courses: Course[]): number {
    if (!courses || courses.length === 0) return 0;

    let totalLectures = 0;
    let completedLectures = 0;

    courses.forEach(course => {
        totalLectures += course.lectures.length;
        completedLectures += course.lectures.filter(l => l.status === 'done').length;
    });

    if (totalLectures === 0) return 0;
    return Math.round((completedLectures / totalLectures) * 100);
}

export function useCourseProgress(lectures: Lecture[]) {
    return useMemo(() => calculateCourseProgress(lectures), [lectures]);
}

export function useTotalProgress(courses: Course[]) {
    return useMemo(() => calculateTotalProgress(courses), [courses]);
}
