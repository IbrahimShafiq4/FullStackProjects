import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { AuctionList } from './features/auctions/auction-list/auction-list';
import { AuctionDetail } from './features/auctions/auction-detail/auction-detail';
import { UserProfileComponent } from './features/auctions/user-profile/user-profile';
import { DashboardComponent } from './features/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: '/auctions', pathMatch: 'full' },
    { path: 'auctions', component: AuctionList, canActivate: [authGuard] },
    { path: 'auctions/:id', component: AuctionDetail, canActivate: [authGuard] },
    { path: 'profile/:id', component: UserProfileComponent, canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: '**', redirectTo: '/auctions' }
];