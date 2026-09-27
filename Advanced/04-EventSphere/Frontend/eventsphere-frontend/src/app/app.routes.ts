import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { organizerGuard } from './core/guards/organizer-guard';
import { LandingPage } from './features/landing/landing';

export const routes: Routes = [
    { path: '', component: LandingPage, title: 'EventSphere' },

    { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login), title: 'تسجيل الدخول' },
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then((m) => m.Register), title: 'إنشاء حساب' },

    { path: 'events', loadComponent: () => import('./features/events/event-list/event-list').then((m) => m.EventList), canActivate: [authGuard], title: 'الفعاليات' },
    { path: 'events/create', loadComponent: () => import('./features/events/event-create/event-create').then((m) => m.EventCreate), canActivate: [organizerGuard], title: 'فعالية جديدة' },
    { path: 'events/:id/seats', loadComponent: () => import('./features/events/seat-map/seat-map').then((m) => m.SeatMap), canActivate: [authGuard], title: 'اختر مقعدك' },
    { path: 'events/:id/analytics', loadComponent: () => import('./features/events/event-analytics/event-analytics').then((m) => m.EventAnalytics), canActivate: [authGuard], title: 'التحليلات' },

    { path: 'my-bookings', loadComponent: () => import('./features/bookings/my-bookings/my-bookings').then((m) => m.MyBookings), canActivate: [authGuard], title: 'حجوزاتي' },

    { path: 'admin', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard), canActivate: [adminGuard], title: 'لوحة الإدارة' },
    { path: 'admin/testimonials', loadComponent: () => import('./features/admin/testimonials-manager/testimonials-manager').then((m) => m.TestimonialsManager), canActivate: [adminGuard], title: 'إدارة آراء العملاء' },
    { path: 'admin/venues', loadComponent: () => import('./features/admin/venues-manager/venues-manager').then((m) => m.VenuesManager), canActivate: [adminGuard], title: 'إدارة الأماكن' },

    { path: '**', redirectTo: 'login' },
];