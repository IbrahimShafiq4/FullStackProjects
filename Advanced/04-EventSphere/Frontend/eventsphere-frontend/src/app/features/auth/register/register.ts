import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private _auth = inject(AuthService);
  private _toast = inject(ToastService);
  private _router = inject(Router);

  public theme = inject(ThemeService);

  readonly year = new Date().getFullYear();

  fullName = signal('');
  email = signal('');
  password = signal('');
  loading = signal(false);

  onSubmit(): void {
    if (!this.fullName() || !this.email() || !this.password()) {
      this._toast.show('من فضلك املأ كل الحقول.', 'error');
      return;
    }

    if (this.password().length < 6) {
      this._toast.show('كلمة المرور 6 أحرف على الأقل.', 'error');
      return;
    }

    this.loading.set(true);

    this._auth.register(this.fullName(), this.email(), this.password()).subscribe({
      next: () => {
        this._toast.show('تم إنشاء الحساب — سجّل دخولك الآن.', 'success');
        this._router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        const messages = err.error;
        this._toast.show(Array.isArray(messages) ? messages[0] : 'تعذّر إنشاء الحساب.', 'error');
      },
    });
  }
}