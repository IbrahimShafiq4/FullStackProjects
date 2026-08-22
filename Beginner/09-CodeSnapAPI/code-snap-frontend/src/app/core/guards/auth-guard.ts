import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const _Auth: Auth = inject(Auth);
  const _Router: Router = inject(Router);

  if (_Auth.currentUser()) { return true; }

  _Router.navigate(['/login']);
  return false;
};
