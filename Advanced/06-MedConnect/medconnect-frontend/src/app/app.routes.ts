import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing/landing').then((m) => m.Landing), title: 'MedConnect' },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then((m) => m.Login), title: 'تسجيل الدخول' },
    { path: 'register-patient', loadComponent: () => import('./features/auth/register-patient/register-patient').then((m) => m.RegisterPatient), title: 'حساب مريض' },
    { path: 'register-doctor', loadComponent: () => import('./features/auth/register-doctor/register-doctor').then((m) => m.RegisterDoctor), title: 'حساب طبيب' },
    { path: 'book', canActivate: [authGuard, roleGuard(['Patient'])], loadComponent: () => import('./features/appointments/book-appointment/book-appointment').then((m) => m.BookAppointment), title: 'حجز موعد' },
    { path: 'my-appointments', canActivate: [authGuard], loadComponent: () => import('./features/appointments/my-appointments/my-appointments').then((m) => m.MyAppointments), title: 'مواعيدي' },
    { path: 'dashboard', canActivate: [authGuard, roleGuard(['Doctor'])], loadComponent: () => import('./features/dashboard/doctor-dashboard/doctor-dashboard').then((m) => m.DoctorDashboard), title: 'لوحة الطبيب' },
    { path: 'doctor/:id', loadComponent: () => import('./features/doctor-profile/doctor-profile').then((m) => m.DoctorProfilePage), title: 'ملف الطبيب' },
    { path: 'doctor-profile/edit', canActivate: [authGuard, roleGuard(['Doctor'])], loadComponent: () => import('./features/doctor-profile/doctor-profile-edit/doctor-profile-edit').then((m) => m.DoctorProfileEdit), title: 'تعديل ملفي' },
    { path: 'patient-profile/edit', canActivate: [authGuard, roleGuard(['Patient'])], loadComponent: () => import('./features/patient-profile/patient-profile-edit/patient-profile-edit').then((m) => m.PatientProfileEdit), title: 'ملفي الطبي' },
    { path: 'patient-dashboard', canActivate: [authGuard, roleGuard(['Patient'])], loadComponent: () => import('./features/patient-dashboard/patient-dashboard').then((m) => m.PatientDashboard), title: 'لوحتي الطبية' },
    { path: 'patient-uploads', canActivate: [authGuard, roleGuard(['Patient'])], loadComponent: () => import('./features/patient-uploads/patient-uploads').then((m) => m.PatientUploads), title: 'ملفاتي' },
    { path: 'doctor/patient/:patientId', canActivate: [authGuard, roleGuard(['Doctor'])], loadComponent: () => import('./features/patient-view/patient-view').then((m) => m.PatientView), title: 'ملف المريض' },
    { path: 'invoices', canActivate: [authGuard], loadComponent: () => import('./features/billing/invoices-list/invoices-list').then((m) => m.InvoicesList), title: 'فواتيري' },
    { path: 'invoices/:id', canActivate: [authGuard], loadComponent: () => import('./features/billing/invoice-detail/invoice-detail').then((m) => m.InvoiceDetail), title: 'تفاصيل الفاتورة' },
    { path: 'reviews/new', canActivate: [authGuard, roleGuard(['Patient'])], loadComponent: () => import('./features/reviews/review-form/review-form').then((m) => m.ReviewForm), title: 'تقييم طبيب' },
    { path: 'radiology', canActivate: [authGuard], loadComponent: () => import('./features/radiology/radiology-list/radiology-list').then((m) => m.RadiologyList), title: 'الأشعة' },
    { path: 'radiology/upload/:requestId', canActivate: [authGuard, roleGuard(['Patient'])], loadComponent: () => import('./features/radiology/radiology-upload/radiology-upload').then((m) => m.RadiologyUploadPage), title: 'رفع أشعة' },
    { path: 'queue/:doctorId', canActivate: [authGuard], loadComponent: () => import('./features/queue/queue').then((m) => m.QueuePage), title: 'قائمة الانتظار' },
    { path: 'call/:id', canActivate: [authGuard], loadComponent: () => import('./features/appointments/video-call/video-call').then((m) => m.VideoCall), title: 'مكالمة مباشرة' },
    {
        path: 'payment/:invoiceId',
        canActivate: [authGuard, roleGuard(['Patient'])],
        loadComponent: () => import('./features/payment/payment').then((m) => m.PaymentPage),
        title: 'إتمام الدفع',
    },
    { path: '**', redirectTo: '' },
];