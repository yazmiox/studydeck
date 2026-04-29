export const STATUS_COLORS = {
    not_started: 'bg-slate-400 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
    in_progress: 'bg-amber-500 text-amber-950 dark:bg-amber-500 dark:text-white',
    done: 'bg-emerald-500 text-emerald-950 dark:bg-emerald-500 dark:text-white',
    needs_revision: 'bg-rose-500 text-rose-950 dark:bg-rose-500 dark:text-white'
} as const;

export const STATUS_LABELS = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    done: 'Done',
    needs_revision: 'Needs Revision'
} as const;

export const APP_CONFIG = {
    name: "StudyDeck",
    version: "2.0.3",
    author: "Yasin Ahmed",
    sourceCodeUrl: "https://github.com/yazmiox/studydeck",
    repoUrl: "https://github.com/yazmiox/studydeck",
    portfolioUrl: "https://yasinahmed.dev",
    aptabaseKey: "A-EU-0104961980"
} as const;
