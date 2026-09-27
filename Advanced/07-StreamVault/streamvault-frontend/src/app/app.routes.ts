import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/landing').then(m => m.Landing),
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
        canActivate: [guestGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register),
        canActivate: [guestGuard]
    },
    {
        path: 'school',
        canActivate: [authGuard],
        loadComponent: () => import('./features/school/school').then(m => m.School)
    },
    {
        path: 'school/floors/:floorId',
        canActivate: [authGuard],
        loadComponent: () => import('./features/school/floor/floor').then(m => m.Floor)
    },
    {
        path: 'school/classrooms/:classroomId',
        canActivate: [authGuard],
        loadComponent: () => import('./features/school/classroom/classroom').then(m => m.Classroom)
    },
    {
        path: 'courses',
        canActivate: [authGuard],
        loadComponent: () => import('./features/courses/course-list/course-list').then(m => m.CourseList)
    },
    {
        path: 'courses/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/courses/course-detail/course-detail').then(m => m.CourseDetail)
    },
    {
        path: 'checkout/:paymentId',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout)
    },
    {
        path: 'checkout/success/:paymentId',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/checkout-success/checkout-success').then(m => m.CheckoutSuccess)
    },
    {
        path: 'live/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/live-class/live-room/live-room').then(m => m.LiveRoom)
    },
    {
        path: 'student',
        canActivate: [authGuard, roleGuard(['Student'])],
        loadComponent: () => import('./features/student/student-shell/student-shell').then(m => m.StudentShell),
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/student/dashboard/dashboard').then(m => m.StudentDashboard)
            },
            {
                path: 'payments',
                loadComponent: () => import('./features/student/my-payments/my-payments').then(m => m.MyPayments)
            },
            {
                path: 'subscription',
                loadComponent: () => import('./features/student/subscription/subscription').then(m => m.Subscription)
            }
        ]
    },
    {
        path: 'teacher',
        canActivate: [authGuard, roleGuard(['Instructor'])],
        loadComponent: () => import('./features/teacher/teacher-shell/teacher-shell').then(m => m.TeacherShell),
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/teacher/dashboard/dashboard').then(m => m.TeacherDashboard)
            },
            {
                path: 'earnings',
                loadComponent: () => import('./features/teacher/earnings/earnings').then(m => m.Earnings)
            },
            {
                path: 'study-files',
                loadComponent: () => import('./features/teacher/study-files/study-files').then(m => m.TeacherStudyFiles)
            },
            {
                path: 'courses',
                loadComponent: () => import('./features/teacher/courses/teacher-courses/teacher-courses').then(m => m.TeacherCourses)
            },
            {
                path: 'wallet',
                loadComponent: () => import('./features/teacher/wallet/wallet').then(m => m.TeacherWallet)
            }
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
    }
];