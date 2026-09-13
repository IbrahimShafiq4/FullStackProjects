import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ILogin } from '../../../core/services/auth.service';
import { form, FormField } from '@angular/forms/signals';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, RouterLink, FormsModule],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private _AuthService: AuthService = inject(AuthService);
  private toast: ToastService = inject(ToastService);
  private router: Router = inject(Router);

  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, () => { });

  onSubmit() {
    const { email, password } = this.loginModel();
    this._AuthService.login(email, password).subscribe({
      next: (login: ILogin) => {
        this._AuthService.currentUser.set({ fullName: login.fullName });
        this.toast.show('تم تسجيل الدخول بنجاح', 'success');
        this.router.navigate(['/equipment']);
      },
      error: () => this.toast.show('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error')
    });
  }
}
