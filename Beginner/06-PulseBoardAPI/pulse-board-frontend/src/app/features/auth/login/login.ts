import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, ILogin } from '../../../core/Services/auth';
import { Toast } from '../../../core/Services/toast';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private _Auth:    Auth    = inject(Auth);
  private _Toast:   Toast   = inject(Toast);
  private _Router:  Router  = inject(Router);

  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, () => { });

  onSubmit() {
    const { email, password } = this.loginModel();

    this._Auth.login(email, password).subscribe({
      next: (res: ILogin) => {
        this._Auth.currentUser.set({ fullName: res.fullName });
        this._Toast.show(res.message, 'success');
        this._Router.navigate(['/dashboard']);
      },
      error: () => this._Toast.show("البريد الإلكترونى أو كلمة المرور غير صحيحة", 'error'),
      complete: () => this._Router.navigate(['/dashboard'])
    })
  }
}
