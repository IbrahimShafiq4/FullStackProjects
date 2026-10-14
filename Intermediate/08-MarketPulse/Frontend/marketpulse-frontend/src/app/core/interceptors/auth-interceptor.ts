import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const cloned = req.clone({ withCredentials: true });

  return next(cloned).pipe(
    catchError((error) => {
      if (error.status === 401) {
        auth.currentUser.set(null);
        auth.ready.set(true);

        const path = router.url.split('?')[0];
        const isAuthPage = path === '/login' || path === '/register';

        if (!isAuthPage && path !== '/' && !path.startsWith('/profile')) {
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};