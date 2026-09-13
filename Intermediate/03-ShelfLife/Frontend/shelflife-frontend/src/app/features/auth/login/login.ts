import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { ToastService } from '../../../core/services/toast-service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, RouterModule, FormsModule],
  selector: 'app-login',
  styles: ``,
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, () => { });

  onSubmit() {
    const { email, password } = this.loginModel();
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authService.currentUser.set({ fullName: response.fullName });
        this.toast.show('تم تسجيل الدخول بنجاح', 'success');
        this.router.navigate(['/products']);
      },
      error: () => this.toast.show('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error')
    });
  }
}
