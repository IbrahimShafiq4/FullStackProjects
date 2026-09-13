import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService, ILogin } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);

  loginModel: WritableSignal<{ email: string, password: string }> =
    signal<{ email: string, password: string }>({ email: '', password: '' })

  loginForm = form(this.loginModel, () => { });

  onSubmit(): void {
    const { email, password } = this.loginModel();
    this._AuthService.login(email, password).subscribe({
      next: (login: ILogin) => {
        this._AuthService.currentUser.set({ fullName: login.fullName, role: login.role });
        this._ToastService.show('تم تسجيل الدخول بنجاح', 'success');
        this._Router.navigate(['/plans']);
      },
      error: (error: HttpErrorResponse) => this._ToastService.show('البريد الإلكترونى أو كلمة المرور غير صحيحة', 'error'),
    })
  }
}