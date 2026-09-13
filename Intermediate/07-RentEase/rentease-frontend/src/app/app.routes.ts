import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then((m) => m.Register) },
    { path: 'equipment', loadComponent: () => import('./features/equipment/equipment-list/equipment-list').then((m) => m.EquipmentList), canActivate: [authGuard] },
    { path: 'equipment/:id', loadComponent: () => import('./features/equipment/equipment-details/equipment-details').then((m) => m.EquipmentDetails), canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
];