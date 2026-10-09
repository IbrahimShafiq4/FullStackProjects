import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
        title: 'TalentBridge — شبكة الفرص المهنية',
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
        title: 'تسجيل الدخول — TalentBridge',
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
        title: 'إنشاء حساب — TalentBridge',
    },

    {
        path: 'notifications',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/notifications/notifications-page/notifications-page').then(
                (m) => m.NotificationsPage
            ),
        title: 'الإشعارات — TalentBridge',
    },

    // ── Candidate ─────────────────────────────────────────
    {
        path: 'candidate',
        canActivate: [authGuard, roleGuard(['Candidate'])],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/candidate/dashboard/dashboard').then((m) => m.CandidateDashboard),
                title: 'لوحة الرحلة — TalentBridge',
            },
            {
                path: 'jobs',
                loadComponent: () =>
                    import('./features/jobs/job-list/job-list').then((m) => m.JobList),
                title: 'الوجهات — TalentBridge',
            },
            {
                path: 'applications',
                loadComponent: () =>
                    import('./features/candidate/applications/applications').then((m) => m.Applications),
                title: 'رحلاتي — TalentBridge',
            },
            {
                path: 'profile',
                loadComponent: () =>
                    import('./features/candidate/profile/profile').then((m) => m.Profile),
                title: 'جواز السفر المهني — TalentBridge',
            },
        ],
    },

    // ── Employer ──────────────────────────────────────────
    {
        path: 'employer',
        canActivate: [authGuard, roleGuard(['Employer'])],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/employer/dashboard/dashboard').then((m) => m.EmployerDashboard),
                title: 'محطة الشركة — TalentBridge',
            },
            {
                path: 'jobs',
                loadComponent: () =>
                    import('./features/employer/jobs/jobs').then((m) => m.EmployerJobs),
                title: 'الوجهات النشطة — TalentBridge',
            },
            {
                path: 'jobs/create',
                loadComponent: () =>
                    import('./features/jobs/job-form/job-form').then((m) => m.JobForm),
                title: 'وجهة جديدة — TalentBridge',
            },
            {
                path: 'jobs/:id/applications',
                loadComponent: () =>
                    import('./features/jobs/job-applicants/job-applicants').then((m) => m.JobApplicants),
                title: 'المتقدمون — TalentBridge',
            },
        ],
    },

    // ── Job details (shared) ──────────────────────────────
    {
        path: 'jobs/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/jobs/job-details/job-details').then((m) => m.JobDetails),
        title: 'تفاصيل الوجهة — TalentBridge',
    },

    { path: '**', redirectTo: '' },
];