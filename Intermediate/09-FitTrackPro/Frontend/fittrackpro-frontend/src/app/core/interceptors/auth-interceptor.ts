import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _Router: Router = inject(Router);
  const clonedReq = req.clone({ withCredentials: true });
  const _ToastService: ToastService = inject(ToastService);

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        _Router.navigate(['/login']);
      } else if (error.status === 429) {
        _ToastService.show('لقد سجلت الكثير من التمارين بسرعة، انتظر قليلاً وحاول مجدداً', 'error');
      }
      return throwError(() => error);
    })
  );
};
