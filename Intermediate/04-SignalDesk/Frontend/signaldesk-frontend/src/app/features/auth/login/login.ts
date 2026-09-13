import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { form, FormField } from "@angular/forms/signals";
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  imports: [CommonModule, RouterLink, FormsModule, FormField],
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
        this.authService.currentUser.set({ fullName: response.fullName, role: response.role });
        this.toast.show('تم تسجيل الدخول بنجاح', 'success');
        this.router.navigate(['/tickets']);
      },
      error: () => this.toast.show('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error')
    });
  }
}
