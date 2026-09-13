import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ItemList } from './components/item-list/item-list';
import { ItemDetail } from './components/item-detail/item-detail';
import { CreateItem } from './components/create-item/create-item';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
        data: { title: 'تسجيل الدخول' }
    },
    {
        path: 'register',
        component: Register,
        data: { title: 'إنشاء حساب' }
    },
    {
        path: 'items',
        component: ItemList,
        canActivate: [authGuard],
        data: { title: 'الرئيسية' }
    },
    {
        path: 'items/:id',
        component: ItemDetail,
        canActivate: [authGuard],
        data: { title: 'تفاصيل العنصر' }
    },
    {
        path: 'create',
        component: CreateItem,
        canActivate: [authGuard],
        data: { title: 'إضافة بلاغ جديد' }
    },
    {
        path: '',
        redirectTo: '/items',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/items'
    }
];