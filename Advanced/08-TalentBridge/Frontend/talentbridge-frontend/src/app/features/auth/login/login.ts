import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private _AuthService: AuthService = inject(AuthService);
  private _Router: Router = inject(Router);
  private _ToastsService: ToastService = inject(ToastService);

  loginModel: WritableSignal<{ email: string, password: string }> = signal<{ email: string, password: string }>({ email: '', password: '' });
  loginForm = form(this.loginModel, () => {});

  onSubmit(): void {
    const { email, password } = this.loginModel();

    this._AuthService.login(email, password).subscribe({
      next: (res: any) => {
        this._AuthService.currentUser.set({fullName: res.fullName, role: res.role});
        this._ToastsService.show('تم تسجيل الدخول بنجاح', 'success');
        this._Router.navigate(['/jobs']);
      },
      error: () => this._ToastsService.show('البريد الإلكترونى أو كلمة المرور غير صحيحة', 'error')
    })
  }
}