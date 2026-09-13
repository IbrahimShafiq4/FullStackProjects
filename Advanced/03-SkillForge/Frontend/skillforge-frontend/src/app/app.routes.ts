import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { employerGuard } from './employer-guard';


export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing-page/landing-page').then((m) => m.LandingPage) },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then((m) => m.Register) },

    {
        path: 'company-setup',
        loadComponent: () => import('./features/employer/company-setup/company-setup').then((m) => m.CompanySetup),
        canActivate: [authGuard, employerGuard]
    },
    {
        path: 'quizzes',
        loadComponent: () => import('./features/employer/quiz-dashboard/quiz-dashboard').then((m) => m.QuizDashboard),
        canActivate: [authGuard]
    },
    {
        path: 'quizzes/:id/questions',
        loadComponent: () => import('./features/employer/quiz-questions/quiz-questions').then((m) => m.QuizQuestions),
        canActivate: [authGuard, employerGuard]
    },
    {
        path: 'quizzes/:id/analytics',
        loadComponent: () => import('./features/employer/quiz-analytics/quiz-analytics').then((m) => m.QuizAnalytics),
        canActivate: [authGuard]
    },
    {
        path: 'testimonials',
        loadComponent: () => import('./features/employer/testimonials/testimonials').then((m) => m.Testimonials),
        canActivate: [authGuard, employerGuard]
    },

    {
        path: 'candidate/quizzes',
        loadComponent: () => import('./features/candidate/quiz-browser/quiz-browser').then((m) => m.QuizBrowser),
        canActivate: [authGuard]
    },
    {
        path: 'exam/:id',
        loadComponent: () => import('./features/candidate/exam-taking/exam-taking').then((m) => m.ExamTaking),
        canActivate: [authGuard]
    },
    {
        path: 'exam-result',
        loadComponent: () => import('./features/candidate/exam-result/exam-result').then((m) => m.ExamResult),
        canActivate: [authGuard]
    },

    { path: '**', redirectTo: '' }
];