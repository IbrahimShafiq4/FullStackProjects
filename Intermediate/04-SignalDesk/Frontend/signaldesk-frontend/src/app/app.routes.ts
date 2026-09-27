import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/cover/cover').then(m => m.Cover) },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard],
    },
    {
        path: 'tickets',
        loadComponent: () => import('./features/tickets/ticket-list/ticket-list.component/ticket-list.component').then(m => m.TicketListComponent),
        canActivate: [authGuard],
    },
    {
        path: 'tickets/:id',
        loadComponent: () => import('./features/tickets/ticket-conversation/ticket-conversation').then(m => m.TicketConversation),
        canActivate: [authGuard],
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
        canActivate: [authGuard],
    },
    { path: '**', redirectTo: '' },
];