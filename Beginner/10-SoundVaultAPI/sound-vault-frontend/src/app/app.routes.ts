import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing-page/landing-page').then(m => m.LandingPage) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
  {
    path: 'sounds',
    loadComponent: () => import('./features/sounds/sound-list/sound-list').then(m => m.SoundList),
    canActivate: [authGuard]
  },
  {
    path: 'sounds/new',
    loadComponent: () => import('./features/sounds/sound-form/sound-form').then(m => m.SoundForm),
    canActivate: [authGuard]
  },
  {
    path: 'sounds/:id',
    loadComponent: () => import('./features/sounds/sound-details/sound-details').then(m => m.SoundDetail),
    canActivate: [authGuard]
  },
  {
    path: 'sounds/:id/edit',
    loadComponent: () => import('./features/sounds/sound-form/sound-form').then(m => m.SoundForm),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];