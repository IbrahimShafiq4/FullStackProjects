import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, FormsModule, RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);

  registerModel = signal({ fullName: '', email: '', password: '' });
  registerForm = form(this.registerModel, () => { });

  onSubmit() {
    const { fullName, email, password } = this.registerModel();
    this._AuthService.register(fullName, email, password).subscribe({
      next: () => {
        this._ToastService.show('تم إنشاء الحساب، سجل دخولك الآن', 'success');
        this._Router.navigate(['/login']);
      },
      error: (err) => {
        const messages = err.error;
        this._ToastService.show(Array.isArray(messages) ? messages[0] : 'حصل خطأ في التسجيل', 'error');
      }
    });
  }
}
