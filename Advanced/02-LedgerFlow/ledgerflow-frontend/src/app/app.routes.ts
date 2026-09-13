import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { CategoryManager } from './features/categories/category-manager/category-manager';
import { TransactionForm } from './features/transactions/transaction-form/transaction-form';
import { TransactionDetails } from './features/transactions/transaction-details/transaction-details';
import { MonthlyReport } from './features/reports/monthly-report/monthly-report';
import { Landing } from './features/landing/landing';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'categories', component: CategoryManager, canActivate: [authGuard] },
    { path: 'transactions/new', component: TransactionForm, canActivate: [authGuard] },
    { path: 'transactions/:id/details', component: TransactionDetails, canActivate: [authGuard] },
    { path: 'reports', component: MonthlyReport, canActivate: [authGuard] },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];