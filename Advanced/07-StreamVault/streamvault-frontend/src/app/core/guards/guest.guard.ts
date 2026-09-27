import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const user = authService.currentUser();

  if (!user) {
    return true;
  }

  if (user.role === 'Instructor') {
    router.navigate(['/teacher/dashboard']);
  } else {
    router.navigate(['/student/dashboard']);
  }

  return false;
};