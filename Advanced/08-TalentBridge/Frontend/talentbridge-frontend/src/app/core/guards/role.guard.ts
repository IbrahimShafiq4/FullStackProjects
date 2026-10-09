import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from '../services/auth.service';

export const roleGuard = (allowed: Role[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  if (!allowed.includes(user.role)) {
    router.navigate([auth.homeFor(user.role)]);
    return false;
  }
  return true;
};