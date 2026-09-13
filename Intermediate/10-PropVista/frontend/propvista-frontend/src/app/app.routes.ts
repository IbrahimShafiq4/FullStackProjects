import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { PropertyList } from './features/properties/property-list/property-list';
import { authGuard } from './core/guards/auth-guard';
import { ownerGuard } from './core/guards/owner-guard';
import { AddProperty } from './features/add-property/add-property';
import { VideoCall } from './features/viewings/video-call/video-call';
import { LandingPage } from './features/landing-page/landing-page';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'properties', component: PropertyList },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'add-property', component: AddProperty, canActivate: [authGuard, ownerGuard] },
    { path: 'video-call/:id', component: VideoCall, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];