import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { disabled, form, FormField } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [FormsModule, FormField, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, (path) => { 
    disabled(path.email, () => this.loading()),
    disabled(path.password, () => this.loading())
  });
  loading = signal(false);

  onSubmit(): void {
    if (this.loading()) return;
    const { email, password } = this.loginModel();

    if (!email || !password) {
      this.toast.show('أدخل البريد وكلمة المرور', 'error');
      return;
    }

    this.loading.set(true);
    this.auth.login(email, password).subscribe({
      next: () => {
        this.toast.show('تم تسجيل الدخول', 'success');
        this.router.navigate(['/auctions']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const msg = err.status === 429
          ? 'محاولات كثيرة، حاول بعد دقيقة'
          : 'بيانات الدخول غير صحيحة';
        this.toast.show(msg, 'error');
      }
    });
  }
}