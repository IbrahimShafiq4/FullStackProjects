import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const organizerGuard: CanActivateFn = (route, state) => {
  const _Auth: AuthService = inject(AuthService);
  const _Router: Router = inject(Router);

  const currentUser = _Auth.currentUser();
  if (currentUser && currentUser.fullName.includes('Admin')) return true;

  _Router.navigate(['/events']);
  return false;
};
