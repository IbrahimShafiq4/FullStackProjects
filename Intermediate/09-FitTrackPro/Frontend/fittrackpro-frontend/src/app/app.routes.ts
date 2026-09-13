import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { coachGuard } from './core/guards/coach-guard';
import { traineeGuard } from './core/guards/trainee-guard';
import { LandingPage } from './features/auth/landing-page/landing-page';

export const routes: Routes = [
    { path: '', component: LandingPage, title: 'الرئيسية' },
    { 
        path: 'login', 
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
        title: 'تسجيل الدخول'
    },
    { 
        path: 'register', 
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
        title: 'إنشاء حساب'
    },
    {
        path: 'plans',
        loadComponent: () => import('./features/workouts/plan-list/plan-list').then((m) => m.PlanList),
        canActivate: [authGuard],
        title: 'جميع الخطط'
    },
    { 
        path: 'dashboard', 
        loadComponent: () => import('./features/coach/dashboard/dashboard').then((m) => m.Dashboard),
        canActivate: [authGuard, coachGuard],
        title: 'لوحة التحكم'
    },
    { 
        path: 'my-plans', 
        loadComponent: () => import('./features/trainee/my-plans/my-plans').then((m) => m.MyPlans),
        canActivate: [authGuard, traineeGuard],
        title: 'خططي'
    },
    { path: '**', redirectTo: 'login' }
];