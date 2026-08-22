import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const _Auth   = inject(Auth);
  const _Router = inject(Router);

  if (_Auth.currentUser()) { return true; }

  _Router.navigate(['/login'])
  return true;
};
