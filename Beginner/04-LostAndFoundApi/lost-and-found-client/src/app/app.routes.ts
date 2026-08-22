import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ItemList } from './components/item-list/item-list';
import { ItemDetail } from './components/item-detail/item-detail';
import { authGuard } from './guards/auth.guard';
import { CreateItem } from './components/create-item/create-item';
export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'items', component: ItemList, canActivate: [authGuard] },
    { path: 'items/:id', component: ItemDetail, canActivate: [authGuard] },
    { path: 'create', component: CreateItem, canActivate: [authGuard] },
    { path: '', redirectTo: '/items', pathMatch: 'full' },
    { path: '**', redirectTo: '/items' }
];