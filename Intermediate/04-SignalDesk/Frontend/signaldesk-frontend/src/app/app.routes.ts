// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then((m) => m.Register) },
    {
        path: 'tickets',
        loadComponent: () => import('./features/tickets/ticket-list/ticket-list.component/ticket-list.component').then((m) => m.TicketListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'tickets/:id',
        loadComponent: () => import('./features/tickets/ticket-conversation/ticket-conversation').then((m) => m.TicketConversation),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'login' }
];