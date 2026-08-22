import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

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
        path: 'gigs',
        loadComponent: () => import('./features/gigs/gig-list/gig-list').then((m) => m.GigList),
        canActivate: [authGuard]
    },
    {
        path: 'gigs/:id',
        loadComponent: () => import('./features/gigs/gig-details/gig-details').then((m) => m.GigDetails),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'login' }
];