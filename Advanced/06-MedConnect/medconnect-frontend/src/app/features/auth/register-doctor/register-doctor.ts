import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-register-doctor',
  imports: [FormsModule, RouterLink],
  templateUrl: './register-doctor.html',
  styleUrl: './register-doctor.css',
})
export class RegisterDoctor {
  private readonly _auth = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _router = inject(Router);

  fullName = signal('');
  specialty = signal('');
  email = signal('');
  password = signal('');
  busy = signal(false);

  readonly specialties = [
    'قلب وأوعية دموية',
    'عصبية دماغية',
    'باطنة عامة',
    'عظام ومفاصل',
    'أطفال وحديثي الولادة',
    'جلدية',
    'عيون',
    'أنف وأذن وحنجرة',
    'نساء وتوليد',
    'نفسي',
  ];

  onSubmit(): void {
    if (!this.fullName() || !this.specialty() || !this.email() || !this.password()) {
      this._toast.show('أكمل جميع الحقول', 'error');
      return;
    }
    if (this.password().length < 6) {
      this._toast.show('كلمة المرور 6 أحرف على الأقل', 'error');
      return;
    }

    this.busy.set(true);
    this._auth
      .registerDoctor(this.fullName(), this.specialty(), this.email(), this.password())
      .subscribe({
        next: () => {
          this._toast.show('تم إنشاء الحساب، سجل دخولك الآن', 'success');
          this._router.navigate(['/login']);
        },
        error: (err) => {
          const m = err.error;
          this._toast.show(Array.isArray(m) ? m[0] : 'تعذر إنشاء الحساب', 'error');
          this.busy.set(false);
        },
      });
  }
}