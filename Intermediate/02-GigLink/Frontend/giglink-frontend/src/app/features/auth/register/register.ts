import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService, IAuth } from '../../../core/services/auth-service';
import { ToastService } from '../../../core/services/toast-service';
import { Router, RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField, RouterLink],
  selector: 'app-register',
  styles: ``,
  templateUrl: './register.html',
})
export class Register {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);

  registerModel: WritableSignal<{ fullName: string, email: string, password: string, role: string }> = signal({fullName: '', email: '', password: '', role: 'Client'})
  registerForm = form(this.registerModel, () => {});

  onSubmit() {
    const { fullName, email, password, role } = this.registerModel();

    this._AuthService.register(fullName, email, password, role).subscribe({
      next: (register: IAuth) => {
        this._ToastService.show('تم إنشاء الحساب، سجل دخولك الآن', 'success');
        this._Router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        const messages = error.error;
        this._ToastService.show(Array.isArray(messages) ? messages[0] : 'حصل خطأ فى التسجيل', 'error')
      }
    })
  }
}
