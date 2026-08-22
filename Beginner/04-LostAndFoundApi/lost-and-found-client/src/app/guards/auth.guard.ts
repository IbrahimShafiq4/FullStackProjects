import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const http = inject(HttpClient);
    const router = inject(Router);

    return http.get('https://localhost:7072/api/users/me', { withCredentials: true }).pipe(
        map(() => true),
        catchError(() => {
            router.navigate(['/login']);
            return of(false);
        })
    );
};