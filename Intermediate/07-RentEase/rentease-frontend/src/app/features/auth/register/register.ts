import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField, RouterLink],
  selector: 'app-register',
  styles: ``,
  templateUrl: './register.html',
})
export class Register {
  private _AuthService: AuthService   = inject(AuthService);
  private toast       : ToastService  = inject(ToastService);
  private router      : Router        = inject(Router);

  registerModel = signal({ fullName: '', email: '', password: '' });
  registerForm  = form(this.registerModel, () => { });

  onSubmit() {
    const { fullName, email, password } = this.registerModel();
    this._AuthService.register(fullName, email, password).subscribe({
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
