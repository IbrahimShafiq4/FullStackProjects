// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../Services/auth';

export const authGuard: CanActivateFn = () => {
    const authService = inject(Auth);
    const router = inject(Router);

    if (authService.currentUser()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};