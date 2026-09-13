import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { AuthService, ILogin } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [FormsModule, FormField, RouterLink],
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);

  loginModel: WritableSignal<{ email: string, password: string }> = signal<{ email: string, password: string }>({ email: '', password: '' })
  loginForm = form(this.loginModel, () => { });

  onSubmit(): void {
    const { email, password } = this.loginModel();

    this._AuthService.login(email, password).subscribe({
      next: (login: ILogin) => {
        this._AuthService.currentUser.set({ fullName: login.fullName });
        this._ToastService.show('تم تسجيل الدخول بنجاح', 'success');
        this._Router.navigate(['/auctions']);
      },
      error: (error: HttpErrorResponse) => this._ToastService.show('بيانات الدخول غير صحيحة', 'error')
    })
  }
}
