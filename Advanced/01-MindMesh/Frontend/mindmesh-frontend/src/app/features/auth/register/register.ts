import { Component, inject, signal, WritableSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  imports: [FormField, FormsModule, RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);
  registerModel: WritableSignal<{ fullName: string, email: string, password: string }> = signal({ fullName: '', email: '', password: '' });
  registerForm = form(this.registerModel, () => { });

  onSubmit() {
    const { fullName, email, password } = this.registerModel();
    this._AuthService.register(fullName, email, password).subscribe({
      next: () => {
        this._ToastService.show('تم إنشاء الحساب، سجل دخولك الآن', 'success');
        this._Router.navigate(['/login']);
      },
      error: (err) => {
        const m = err.error;
        this._ToastService.show(Array.isArray(m) ? m[0] : 'حصل خطأ في التسجيل', 'error');
      }
    });
  }
}