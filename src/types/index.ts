export type LectureStatus = 'not_started' | 'in_progress' | 'done' | 'needs_revision';

export interface Attachment {
    id: string;
    name: string;
    path: string;
    size: number;
    addedAt: string;
}

export interface Lecture {
    id: string;
    name: string;
    status: LectureStatus;
    notes: string;
    attachments: Attachment[];
    order: number;
    createdAt: string;
}

export interface Exam {
    id: string;
    name: string;
    date: string;
    time?: string;
    showCountdown?: boolean;
    courseId: string;
}

export interface Course {
    id: string;
    name: string;
    code: string;
    lectures: Lecture[];
    exams: Exam[];
    order: number;
    createdAt: string;
}

export interface AppState {
    courses: Course[];
    isDarkMode: boolean;
    telemetryConsent: boolean | null;
    schemaVersion: number;
}

export type Action =
    | { type: 'LOAD_STATE'; payload: AppState }
    | { type: 'SET_DARK_MODE'; payload: boolean }
    | { type: 'SET_TELEMETRY_CONSENT'; payload: boolean | null }
    | { type: 'ADD_COURSE'; payload: Course }
    | { type: 'UPDATE_COURSE'; payload: { courseId: string; updates: Partial<Course> } }
    | { type: 'DELETE_COURSE'; payload: string }
    | { type: 'REORDER_COURSES'; payload: Course[] }
    | { type: 'ADD_LECTURE'; payload: { courseId: string; lecture: Lecture } }
    | { type: 'UPDATE_LECTURE'; payload: { courseId: string; lectureId: string; updates: Partial<Lecture> } }
    | { type: 'DELETE_LECTURE'; payload: { courseId: string; lectureId: string } }
    | { type: 'REORDER_LECTURES'; payload: { courseId: string; lectures: Lecture[] } }
    | { type: 'ADD_EXAM'; payload: Exam }
    | { type: 'UPDATE_EXAM'; payload: { examId: string; updates: Partial<Exam> } }
    | { type: 'DELETE_EXAM'; payload: string }
    | { type: 'ADD_ATTACHMENT'; payload: { courseId: string; lectureId: string; attachment: Attachment } }
    | { type: 'DELETE_ATTACHMENT'; payload: { courseId: string; lectureId: string; attachmentId: string } };
