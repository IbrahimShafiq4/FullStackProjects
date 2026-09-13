import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const traineeGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const _Router = inject(Router);

  if (_AuthService.currentUser()?.role === 'Trainee')
    return true;

  _Router.navigate(['/plans']);
  return false;
};