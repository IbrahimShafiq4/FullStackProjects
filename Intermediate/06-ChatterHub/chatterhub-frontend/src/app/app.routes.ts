import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register/register').then((m) => m.Register),
    },
    {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
    },
    {
        path: 'rooms/new',
        canActivate: [authGuard],
        loadComponent: () => import('./features/room-create/room-create').then((m) => m.RoomCreate),
    },
    {
        path: 'rooms/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/chat/chat').then((m) => m.Chat),
    },
    { path: '**', redirectTo: 'home' },
];