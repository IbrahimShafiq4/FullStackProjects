import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  imports: [FormField, FormsModule, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);
  loginModel: WritableSignal<{ email: string, password: string }> = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, () => { });

  onSubmit() {
    const { email, password } = this.loginModel();
    this._AuthService.login(email, password).subscribe({
      next: (response) => {
        this._AuthService.currentUser.set({ fullName: response.fullName, email: response.email, id: response.id });
        this._ToastService.show('تم تسجيل الدخول بنجاح', 'success');
        this._Router.navigate(['/boards']);
      },
      error: () => this._ToastService.show('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error')
    });
  }
}