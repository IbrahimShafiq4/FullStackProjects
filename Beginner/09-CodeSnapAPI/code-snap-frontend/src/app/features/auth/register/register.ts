import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, FormField],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
    private authService = inject(Auth);
  private toast = inject(Toast);
  private router = inject(Router);

  registerModel = signal({ fullName: '', email: '', password: '' });
  registerForm = form(this.registerModel, () => {});

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
