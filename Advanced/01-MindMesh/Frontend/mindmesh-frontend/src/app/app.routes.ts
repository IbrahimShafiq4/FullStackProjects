import { Routes } from '@angular/router';
import { LandingPage } from './features/landing/landing';
import { Me } from './features/auth/me/me';
import { authGuard } from './core/guards/auth-guard';
import { BoardList } from './features/boards/board-list/board-list';
import { BoardDetails } from './features/boards/board-details/board-details';
import { BoardAnalytics } from './features/boards/board-analytics/board-analytics';
import { BoardCanvas } from './features/boards/board-canvas/board-canvas';
import { BoardDelete } from './features/boards/board-delete/board-delete';

export const routes: Routes = [
    { path: '',                     component    : LandingPage, pathMatch: 'full' },
    { path: 'login',                loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
    { path: 'register',             loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
    { path: 'boards',               component    : BoardList,       canActivate: [authGuard] },
    { path: 'boards/:id/details',   component    : BoardDetails,    canActivate: [authGuard] },
    { path: 'boards/:id/analytics', component    : BoardAnalytics,  canActivate: [authGuard] },
    { path: 'boards/:id/canvas',    component    : BoardCanvas,     canActivate: [authGuard] },
    { path: 'boards/:id/delete',    component    : BoardDelete,     canActivate: [authGuard] },
    { path: 'me',                   component    : Me,              canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];