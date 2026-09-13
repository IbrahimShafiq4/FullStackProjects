import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth';
import { organizerGuard } from './core/guards/organizer-guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing/landing').then(m => m.Landing) },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
    { path: 'events', loadComponent: () => import('./features/events/event-list/event-list').then(m => m.EventList), canActivate: [authGuard] },
    { path: 'events/new', loadComponent: () => import('./features/events/event-form/event-form').then(m => m.EventForm), canActivate: [authGuard, organizerGuard] },
    { path: 'events/:id/edit', loadComponent: () => import('./features/events/event-form/event-form').then(m => m.EventForm), canActivate: [authGuard, organizerGuard] },
    { path: 'events/:id', loadComponent: () => import('./features/events/event-detail/event-detail').then(m => m.EventDetail), canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];