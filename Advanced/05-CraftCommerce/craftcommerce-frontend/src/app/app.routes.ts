import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./Features/landing/landing').then((m) => m.Landing) },
    { path: 'login', loadComponent: () => import('./Features/auth/login/login').then((m) => m.Login) },
    { path: 'register', loadComponent: () => import('./Features/auth/register/register').then((m) => m.Register) },

    { path: 'products', loadComponent: () => import('./Features/products/product-list/product-list').then((m) => m.ProductList) },
    { path: 'products/:id', loadComponent: () => import('./Features/products/product-details/product-details').then((m) => m.ProductDetails) },

    { path: 'cart', loadComponent: () => import('./Features/cart/cart-page/cart-page').then((m) => m.CartPage), canActivate: [authGuard] },
    { path: 'checkout', loadComponent: () => import('./Features/checkout/checkout-page/checkout-page').then((m) => m.CheckoutPage), canActivate: [authGuard] },

    { path: 'orders', loadComponent: () => import('./Features/orders/order-list/order-list').then((m) => m.OrderList), canActivate: [authGuard] },
    { path: 'orders/:id', loadComponent: () => import('./Features/orders/order-details/order-details').then((m) => m.OrderDetails), canActivate: [authGuard] },

    { path: 'addresses', loadComponent: () => import('./Features/addresses/address-list/address-list').then((m) => m.AddressList), canActivate: [authGuard] },

    { path: 'reviews', loadComponent: () => import('./Features/reviews/my-reviews/my-reviews').then((m) => m.MyReviews), canActivate: [authGuard] },

    { path: 'dashboard', loadComponent: () => import('./Features/dashboard/artisan-dashboard/artisan-dashboard').then((m) => m.ArtisanDashboard), canActivate: [authGuard] },
    { path: 'dashboard/products', loadComponent: () => import('./Features/dashboard/my-products/my-products').then((m) => m.MyProducts), canActivate: [authGuard] },
    { path: 'dashboard/products/new', loadComponent: () => import('./Features/dashboard/product-create/product-create').then((m) => m.ProductCreate), canActivate: [authGuard] },
    { path: 'dashboard/categories', loadComponent: () => import('./Features/dashboard/categories-admin/categories-admin').then((m) => m.CategoriesAdmin), canActivate: [authGuard] },

    { path: '**', redirectTo: '' },
];