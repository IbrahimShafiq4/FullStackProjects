export interface NotebookPage {
    id: string;
    number: string;
    title: string;
    subject: string;
    path: string;
    requiresAuth: boolean;
}

export interface Project {
    no: string;
    title: string;
    brief: string;
    answer: string;
    stack: string[];
    score: string;
    teacherNote: string;
}

export interface ExperienceEntry {
    period: string;
    title: string;
    place: string;
    lesson: string;
}

export interface ContactChannel {
    label: string;
    value: string;
    href: string;
}

export const NOTEBOOK_PAGES: NotebookPage[] = [
    { id: 'cover', number: '١', title: 'الغلاف', subject: 'الكشكول', path: '/', requiresAuth: false },
    { id: 'login', number: '٢', title: 'الدخول', subject: 'الفتح', path: '/login', requiresAuth: false },
    { id: 'register', number: '٣', title: 'التسجيل', subject: 'حساب جديد', path: '/register', requiresAuth: false },
    { id: 'dashboard', number: '١', title: 'الرئيسية', subject: 'اللوحة', path: '/dashboard', requiresAuth: true },
    { id: 'tickets', number: '٢', title: 'التذاكر', subject: 'السجل', path: '/tickets', requiresAuth: true },
    { id: 'profile', number: '٣', title: 'حسابي', subject: 'الملف', path: '/profile', requiresAuth: true },
];

export const OWNER = {
    name: 'إبراهيم شفيق',
    email: 'ibrahim.shafiq440@gmail.com',
    phone: '01128467654',
    role: 'مطوّر Full-Stack',
    year: '٢٠٢٦',
};