import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ILogin } from '../../../core/services/auth-service';
import { ToastService } from '../../../core/services/toast-service';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [RouterLink, FormsModule, FormField],
  selector: 'app-login',
  styles: ``,
  templateUrl: './login.html',
})
export class Login {
  private _AuthService: AuthService = inject(AuthService);
  private _Router: Router = inject(Router);
  private _Toast: ToastService = inject(ToastService);

  loginModel: WritableSignal<{ email: string, password: string }> = signal<{ email: string, password: string }>({ email: '', password: '' });
  loginForm = form(this.loginModel, () => { });

  onSubmit(): void {
    const { email, password } = this.loginModel();

    this._AuthService.login(email, password).subscribe({
      next: (login: ILogin) => {
        this._AuthService.currentUser.set(login);
        this._Router.navigate(['/gigs'])
      },
      error: (error: HttpErrorResponse) => this._Toast.show('البريد الإلكترونى أو كلمة المرور غير صحيحة', 'error')
    })
  }
}
