import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  imports: [FormsModule, FormField, RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  registerModel = signal({ fullName: '', email: '', password: '' });
  registerForm = form(this.registerModel, () => { });

  onSubmit() {
    const { fullName, email, password } = this.registerModel();
    this.authService.register(fullName, email, password).subscribe({
      next: () => {
        this.toast.show('تم إنشاء الحساب، سجل دخولك الآن', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const messages = err.error;
        this.toast.show(Array.isArray(messages) ? messages[0] : 'حصل خطأ في التسجيل', 'error');
      }
    });
  }
}
