import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register)
    },
    {
        path: 'snippets',
        loadComponent: () => import('./features/snippets/snippet-list/snippet-list').then((m) => m.SnippetList),
        canActivate: [authGuard]
    },
    {
        path: 'snippets/new',
        loadComponent: () => import('./features/snippets/snippet-form/snippet-form').then((m) => m.SnippetForm),
        canActivate: [authGuard]
    },
    {
        path: 'snippets/:id/edit',
        loadComponent: () => import('./features/snippets/snippet-form/snippet-form').then((m) => m.SnippetForm),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'login' }
];