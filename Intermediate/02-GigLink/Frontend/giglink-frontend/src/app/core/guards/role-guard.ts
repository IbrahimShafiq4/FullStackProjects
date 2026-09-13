import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export function roleGuard(requiredRole: 'Client' | 'Freelancer'): CanActivateFn {
  return () => {
    const _AuthService: AuthService = inject(AuthService);
    const _Router: Router = inject(Router);

    if (_AuthService.currentUser()?.role === requiredRole) return true;

    _Router.navigate(['/gigs']);
    return false;
  };
}