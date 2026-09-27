import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-register-patient',
  imports: [FormsModule, RouterLink],
  templateUrl: './register-patient.html',
  styleUrl: './register-patient.css',
})
export class RegisterPatient {
  private readonly _auth = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _router = inject(Router);

  fullName = signal('');
  email = signal('');
  password = signal('');
  busy = signal(false);

  onSubmit(): void {
    if (!this.fullName() || !this.email() || !this.password()) {
      this._toast.show('أكمل جميع الحقول', 'error');
      return;
    }
    if (this.password().length < 6) {
      this._toast.show('كلمة المرور 6 أحرف على الأقل', 'error');
      return;
    }

    this.busy.set(true);
    this._auth.registerPatient(this.fullName(), this.email(), this.password()).subscribe({
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