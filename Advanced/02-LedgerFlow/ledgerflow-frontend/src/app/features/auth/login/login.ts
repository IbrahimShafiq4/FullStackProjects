import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService, ILogin } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private _AuthService  : AuthService = inject(AuthService);
  private _Router       : Router = inject(Router);
  private _ToastService : ToastService = inject(ToastService);

  loginModel            : WritableSignal<{email: string, password: string}>
  = signal<{email: string, password: string}>({email: '', password: ''});
  
  loginForm = form(this.loginModel, () => {  });

  onSubmit(): void {
    const { email, password } = this.loginModel();

    this._AuthService.login(email, password).subscribe({
      next: (login: ILogin) => {
        this._AuthService.currentUser.set({ fullName: login.fullName, companyName: login.companyName });
        this._ToastService.show('تم تسجيل الدخول', 'success');
        this._Router.navigate(['/dashboard'])
      },
      error: () => this._ToastService.show('بيانات غير صحيحة', 'error'),
    })
  }
}
