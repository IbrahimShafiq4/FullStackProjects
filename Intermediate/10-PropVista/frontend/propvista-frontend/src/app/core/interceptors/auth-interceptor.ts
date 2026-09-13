import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({ withCredentials: true });
  const _Router: Router = inject(Router);

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status == 401) _Router.navigate(['/login']);
      return throwError(() => error);
    })
  )
};
