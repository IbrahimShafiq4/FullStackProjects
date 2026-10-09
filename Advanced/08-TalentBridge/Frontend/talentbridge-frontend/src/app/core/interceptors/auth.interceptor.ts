import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const cloned = req.clone({ withCredentials: true });

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      const isAuthEndpoint = /\/api\/auth\/(login|register|logout|me)/.test(req.url);
      if (err.status === 401 && !isAuthEndpoint) {
        auth.currentUser() && router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};