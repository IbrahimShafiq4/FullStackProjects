import { Component, inject, signal } from '@angular/core';
import { disabled, form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, FormsModule, RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  registerModel = signal({ fullName: '', email: '', password: '' });
  registerForm = form(this.registerModel, (path) => { 
    disabled(path.email,    () => this.loading()),
    disabled(path.fullName, () => this.loading()),
    disabled(path.password, () => this.loading())
  });
  loading = signal(false);

  onSubmit() {
    if (this.loading()) return;
    const { fullName, email, password } = this.registerModel();

    if (!fullName.trim() || !email || password.length < 8) {
      this.toast.show('راجع البيانات (كلمة المرور 8 أحرف على الأقل)', 'error');
      return;
    }

    this.loading.set(true);
    this.auth.register(fullName.trim(), email, password).subscribe({
      next: () => {
        this.toast.show('تم الإنشاء، سجّل دخولك الآن', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        const list = err?.error?.errors;
        this.toast.show(Array.isArray(list) ? list[0] : 'تعذر إنشاء الحساب', 'error');
      }
    });
  }
}