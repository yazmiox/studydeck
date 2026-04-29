import { createContext, useContext, useEffect, useReducer, useState } from "react";
import type { AppState, Action, Course } from "../types";

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
}

const defaultState: AppState = {
    courses: [],
    isDarkMode: false,
    telemetryConsent: null,
    schemaVersion: 2
};

const AppContext = createContext<AppContextType | null>(null);

function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'LOAD_STATE':
            return { ...defaultState, ...action.payload };

        case 'SET_DARK_MODE':
            return { ...state, isDarkMode: action.payload };

        case 'SET_TELEMETRY_CONSENT':
            return { ...state, telemetryConsent: action.payload };

        case 'ADD_COURSE':
            return { ...state, courses: [...state.courses, action.payload] };

        case 'UPDATE_COURSE':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? { ...course, ...action.payload.updates }
                        : course
                )
            };

        case 'DELETE_COURSE':
            return {
                ...state,
                courses: state.courses.filter(course => course.id !== action.payload)
            };

        case 'REORDER_COURSES':
            return { ...state, courses: action.payload };

        case 'ADD_LECTURE':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? { ...course, lectures: [...course.lectures, action.payload.lecture] }
                        : course
                )
            };

        case 'UPDATE_LECTURE':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? {
                            ...course,
                            lectures: course.lectures.map(lecture =>
                                lecture.id === action.payload.lectureId
                                    ? { ...lecture, ...action.payload.updates }
                                    : lecture
                            )
                        }
                        : course
                )
            };

        case 'DELETE_LECTURE':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? {
                            ...course,
                            lectures: course.lectures.filter(l => l.id !== action.payload.lectureId)
                        }
                        : course
                )
            };

        case 'REORDER_LECTURES':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? { ...course, lectures: action.payload.lectures }
                        : course
                )
            };

        case 'ADD_EXAM':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? { ...course, exams: [...course.exams, action.payload] }
                        : course
                )
            };

        case 'UPDATE_EXAM':
            return {
                ...state,
                courses: state.courses.map(course => ({
                    ...course,
                    exams: course.exams.map(exam =>
                        exam.id === action.payload.examId
                            ? { ...exam, ...action.payload.updates }
                            : exam
                    )
                }))
            };

        case 'DELETE_EXAM':
            return {
                ...state,
                courses: state.courses.map(course => ({
                    ...course,
                    exams: course.exams.filter(exam => {
                        if (typeof action.payload === 'string') {
                            return exam.id !== action.payload;
                        }
                        return exam.id !== (action.payload as any).examId;
                    })
                }))
            };

        case 'ADD_ATTACHMENT':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? {
                            ...course,
                            lectures: course.lectures.map(lecture =>
                                lecture.id === action.payload.lectureId
                                    ? { ...lecture, attachments: [...lecture.attachments, action.payload.attachment] }
                                    : lecture
                            )
                        }
                        : course
                )
            };

        case 'DELETE_ATTACHMENT':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? {
                            ...course,
                            lectures: course.lectures.map(lecture =>
                                lecture.id === action.payload.lectureId
                                    ? {
                                        ...lecture,
                                        attachments: lecture.attachments.filter(a => a.id !== action.payload.attachmentId)
                                    }
                                    : lecture
                            )
                        }
                        : course
                )
            };

        case 'ADD_LINK':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? {
                            ...course,
                            lectures: course.lectures.map(lecture =>
                                lecture.id === action.payload.lectureId
                                    ? { ...lecture, links: [...(lecture.links || []), action.payload.link] }
                                    : lecture
                            )
                        }
                        : course
                )
            };

        case 'DELETE_LINK':
            return {
                ...state,
                courses: state.courses.map(course =>
                    course.id === action.payload.courseId
                        ? {
                            ...course,
                            lectures: course.lectures.map(lecture =>
                                lecture.id === action.payload.lectureId
                                    ? {
                                        ...lecture,
                                        links: (lecture.links || []).filter(l => l.id !== action.payload.linkId)
                                    }
                                    : lecture
                            )
                        }
                        : course
                )
            };

        default:
            return state;
    }
}

export function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, defaultState);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load & Migration
    useEffect(() => {
        (async () => {
            try {
                const rawState = await window.electronAPI.getApplicationState();
                const loadedState = (rawState && rawState.schemaVersion === 2) ? rawState : defaultState;

                dispatch({ type: 'LOAD_STATE', payload: loadedState });

                // Set initial dark mode DOM
                const html = document.querySelector('html');
                if (html) {
                    html.classList.toggle('dark', loadedState.isDarkMode);
                }
            } catch (error) {
                console.error("Failed to load state", error);
            } finally {
                setIsLoaded(true);
            }
        })();
    }, []);

    // Toggle Dark Mode globally
    useEffect(() => {
        if (!isLoaded) return;
        const html = document.querySelector('html');
        if (html) {
            html.classList.toggle('dark', state.isDarkMode);
        }
    }, [state.isDarkMode, isLoaded]);

    // Debounced Persistence
    useEffect(() => {
        if (!isLoaded) return;

        const timeoutId = setTimeout(() => {
            window.electronAPI.saveApplicationState(state);
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [state, isLoaded]);

    if (!isLoaded) {
        // Simple loading placeholder
        return <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">Loading...</div>;
    }

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};