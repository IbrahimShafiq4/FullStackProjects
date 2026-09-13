import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const _Router: Router = inject(Router);

    const clonedReq = req.clone({ withCredentials: true });
    return next(clonedReq).pipe(
        catchError((error) => {
            const skip =
                req.url.includes('/auth/me') ||
                req.url.includes('/auth/login') ||
                req.url.includes('/auth/register') ||
                req.url.includes('/testimonials');

            if (error.status === 401 && !skip) {
                _Router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};