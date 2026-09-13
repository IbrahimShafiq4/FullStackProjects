import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, FormsModule],
  selector: 'app-register',
  styles: ``,
  templateUrl: './register.html',
})
export class Register {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  registerModel = signal({ fullName: '', email: '', password: '', role: 'Customer' });
  registerForm = form(this.registerModel, () => { });

  onSubmit() {
    const { fullName, email, password, role } = this.registerModel();
    this.authService.register(fullName, email, password, role).subscribe({
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
