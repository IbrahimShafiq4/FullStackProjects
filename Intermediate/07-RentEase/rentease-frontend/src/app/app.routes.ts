import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing/landing').then((m) => m.Landing) },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then((m) => m.Register) },

    { path: 'equipment', loadComponent: () => import('./features/equipment/equipment-list/equipment-list').then((m) => m.EquipmentList), canActivate: [authGuard] },
    { path: 'equipment/new', loadComponent: () => import('./features/equipment/equipment-form/equipment-form').then((m) => m.EquipmentForm), canActivate: [authGuard] },
    { path: 'equipment/:id', loadComponent: () => import('./features/equipment/equipment-details/equipment-details').then((m) => m.EquipmentDetails), canActivate: [authGuard] },

    { path: 'my-equipment', loadComponent: () => import('./features/my-equipment/my-equipment').then((m) => m.MyEquipment), canActivate: [authGuard] },
    { path: 'my-equipment/:id/edit', loadComponent: () => import('./features/my-equipment/equipment-edit/equipment-edit').then((m) => m.EquipmentEdit), canActivate: [authGuard] },

    { path: 'my-rentals', loadComponent: () => import('./features/my-rentals/my-rentals').then((m) => m.MyRentals), canActivate: [authGuard] },
    { path: 'requests', loadComponent: () => import('./features/requests/requests').then((m) => m.Requests), canActivate: [authGuard] },
    { path: 'profile', loadComponent: () => import('./features/profile/profile').then((m) => m.Profile), canActivate: [authGuard] },

    { path: '**', redirectTo: '' },
];