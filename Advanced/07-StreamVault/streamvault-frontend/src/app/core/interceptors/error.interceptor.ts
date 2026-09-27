import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const toastService: ToastService = inject(ToastService);
  const router: Router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/me')) {
        authService.clearSession();
        router.navigate(['/login']);
        toastService.show('انتهت الجلسة، سجّل دخولك من جديد', 'error');
      } else if (error.status === 403) {
        toastService.show('مش مسموح لك بالوصول للصفحة دي', 'error');
      } else if (error.status === 0) {
        toastService.show('تعذر الاتصال بالسيرفر', 'error');
      }

      return throwError(() => error);
    })
  );
};