import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register/register').then((m) => m.Register) },
    { path: 'rooms', loadComponent: () => import('./features/rooms/room-list/room-list/room-list').then((m) => m.RoomList), canActivate: [authGuard] },
    { path: 'rooms/new', loadComponent: () => import('./features/rooms/room-create/room-create/room-create').then((m) => m.RoomCreate), canActivate: [authGuard] },
    { path: 'rooms/:id/details', loadComponent: () => import('./features/rooms/room-details/room-details').then((m) => m.RoomDetails), canActivate: [authGuard] },
    { path: 'rooms/:id/chat', loadComponent: () => import('./features/rooms/room-chat/room-chat/room-chat').then((m) => m.RoomChat), canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
];