import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    {
        path: 'login',
        loadComponent: () =>
            import('./Features/auth/login/login').then((m) => m.Login)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./Features/auth/register/register').then((m) => m.Register)
    },
    {
        path: 'notes',
        loadComponent: () =>
            import('./Features/notes/note-list/note-list').then((m) => m.NoteList),
        // canActivate: [authGuard]
    },

    { path: '**', redirectTo: 'login' }
];