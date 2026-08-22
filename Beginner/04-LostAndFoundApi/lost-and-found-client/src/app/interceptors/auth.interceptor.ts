import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const http = inject(HttpClient);
    const router = inject(Router);

    const authReq = req.clone({ withCredentials: true });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401) {
                return throwError(() => error);
            }

            if (isRefreshing) {
                return throwError(() => error);
            }

            isRefreshing = true;

            return http.post('https://localhost:7072/api/auth/refresh', {}, { withCredentials: true }).pipe(
                switchMap(() => {
                    isRefreshing = false;
                    return next(req.clone({ withCredentials: true }));
                }),
                catchError((refreshError) => {
                    isRefreshing = false;
                    router.navigate(['/login']);
                    return throwError(() => refreshError);
                })
            );
        })
    );
};