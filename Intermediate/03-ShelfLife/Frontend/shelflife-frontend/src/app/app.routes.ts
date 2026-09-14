import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing-page/landing-page').then((m) => m.LandingPage) },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then((m) => m.Register) },

    {
        path: 'products',
        loadComponent: () => import('./features/products/product-list/product-list').then((m) => m.ProductList),
        canActivate: [authGuard]
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-details/product-details').then((m) => m.ProductDetails),
        canActivate: [authGuard]
    },

    {
        path: 'challenge/:id',
        loadComponent: () => import('./features/challenges/challenge-join/challenge-join').then((m) => m.ChallengeJoin),
        canActivate: [authGuard]
    },

    {
        path: 'testimonial',
        loadComponent: () => import('./features/testimonials/testimonial-submit/testimonial-submit').then((m) => m.TestimonialSubmit),
        canActivate: [authGuard]
    },

    {
        path: 'admin/challenges',
        loadComponent: () => import('./features/admin/challenges/challenges').then((m) => m.Challenges),
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'admin/promote',
        loadComponent: () => import('./features/admin/promote/promote').then((m) => m.Promote),
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'admin/challenge/:id/submissions',
        loadComponent: () => import('./features/admin/challenge-submissions/challenge-submissions').then((m) => m.ChallengeSubmissions),
        canActivate: [authGuard, adminGuard]
    },
    {
        path: 'admin/testimonials',
        loadComponent: () => import('./features/admin/testimonials/testimonials').then((m) => m.AdminTestimonials),
        canActivate: [authGuard, adminGuard]
    },

    { path: '**', redirectTo: '' }
];