import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService, IAuth } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormField, FormsModule, RouterLink],
  selector: 'app-register',
  styles: ``,
  templateUrl: './register.html',
})
export class Register {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);

  registerModel: WritableSignal<{ fullName: string, email: string, password: string }> = signal<{ fullName: string, email: string, password: string }>({ fullName: '', email: '', password: '' });
  registerForm = form(this.registerModel, () => { });

  onSubmit(): void {
    const { fullName, email, password } = this.registerModel();

    this._AuthService.register(fullName, email, password).subscribe({
      next: (register: IAuth) => {
        this._ToastService.show('تم إنشاء الحساب، سجل دخولك الآن', 'error');
        this._Router.navigate(['/login']);
      },
      error: (error) => this._ToastService.show(Array.isArray(error.error) ? error.error[0] : 'حصل خطأ فى التسجيل', 'error'),
    })
  }
}
