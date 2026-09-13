import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormField, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(Auth);
  private toast = inject(Toast);
  private router = inject(Router);

  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, () => { });

  onSubmit() {
    const { email, password } = this.loginModel();

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authService.currentUser.set({ fullName: response.fullName });
        this.toast.show('تم تسجيل الدخول بنجاح', 'success');
        this.router.navigate(['/snippets']);
      },
      error: () => this.toast.show('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error')
    });
  }
}
