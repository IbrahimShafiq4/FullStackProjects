import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly _auth = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _router = inject(Router);

  email = signal('');
  password = signal('');
  busy = signal(false);

  onSubmit(): void {
    if (!this.email() || !this.password()) {
      this._toast.show('أدخل البريد وكلمة المرور', 'error');
      return;
    }

    this.busy.set(true);
    this._auth.login(this.email(), this.password()).subscribe({
      next: (res) => {
        this._toast.show(res.message ?? 'تم تسجيل الدخول', 'success');
        this._router.navigate([res.role === 'Doctor' ? '/dashboard' : '/book']);
      },
      error: () => {
        this._toast.show('بيانات الدخول غير صحيحة', 'error');
        this.busy.set(false);
      },
    });
  }
}