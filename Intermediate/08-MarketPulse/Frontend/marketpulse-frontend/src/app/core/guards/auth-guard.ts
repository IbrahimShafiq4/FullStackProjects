import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const _AuthService: AuthService = inject(AuthService);
  const _Router: Router = inject(Router);

  if(_AuthService.currentUser()) return true;
  _Router.navigate(['/login']);
  return false;
};
