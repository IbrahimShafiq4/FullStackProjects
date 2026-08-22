import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
    { path: 'timeline', loadComponent: () => import('./features/timeline/timeline/timeline').then(m => m.Timeline), canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
];