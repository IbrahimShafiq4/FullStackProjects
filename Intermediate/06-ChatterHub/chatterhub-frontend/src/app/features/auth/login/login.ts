import { Component, inject, signal } from '@angular/core';
import { form, FormField } from "@angular/forms/signals";
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, RouterLink, FormsModule],
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
      next: (login) => {
        this.authService.currentUser.set({ email });
        this.toast.show('تم تسجيل الدخول بنجاح', 'success');
        this.router.navigate(['/rooms']);
        localStorage.setItem(
          'userId',
          login.userId
        );

        localStorage.setItem(
          'fullName',
          login.fullName
        );
      },
      error: () => this.toast.show('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error')
    });
  }
}
