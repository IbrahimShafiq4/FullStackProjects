import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing/landing').then((m) => m.Landing) },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register/register').then((m) => m.Register) },
    { path: 'q/:token', loadComponent: () => import('./features/quotes/public-quote/public-quote').then((m) => m.PublicQuote) },
    {
        path: 'quotes',
        loadComponent: () => import('./features/quotes/quote-list/quote-list').then((m) => m.QuoteList),
        canActivate: [authGuard]
    },
    {
        path: 'create-quote',
        loadComponent: () => import('./features/quotes/quote-form/quote-form').then((m) => m.QuoteForm),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: '' }
];