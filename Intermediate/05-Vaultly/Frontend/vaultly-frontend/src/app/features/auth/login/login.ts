import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService, ILogin } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField, RouterLink],
  selector: 'app-login',
  styles: ``,
  templateUrl: './login.html',
})
export class Login {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);

  loginModel: WritableSignal<{ email: string, password: string }> = signal<{ email: string, password: string }>({ email: '', password: '' });
  loginForm = form(this.loginModel, () => { })

  onSubmit() {
    const { email, password } = this.loginModel();
    this._AuthService.login(email, password).subscribe({
      next: (login: ILogin) => {
        this._AuthService.setCurrentUser({ fullName: login.fullName });
        this._ToastService.show('أهلًا بيك تاني 👋', 'success');
        this._Router.navigate(['/quotes']);
      },
      error: () => this._ToastService.show('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error')
    })
  }
}