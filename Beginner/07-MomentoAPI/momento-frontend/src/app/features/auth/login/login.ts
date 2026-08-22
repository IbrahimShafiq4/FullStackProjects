import { Component, inject, signal } from '@angular/core';
import { form, Field, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { Auth, ILoginResponse } from '../../../core/Services/auth';
import { Toast } from '../../../core/Services/toast';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private _Auth: Auth = inject(Auth);
  private _Toast: Toast = inject(Toast);
  private _Router: Router = inject(Router);

  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, () => { });

  onSubmit() {
    const { email, password } = this.loginModel();

    this._Auth.login(email, password).subscribe({
      next: (res: ILoginResponse) => {
        this._Auth.currentUser.set(res);
        this._Toast.show(`مرحبا بك يا ${res.fullName}`, 'success');
        this._Router.navigate(['/timeline']);
      },
      error: (error: HttpErrorResponse) => this._Toast.show("البريد الالكترونى او كلمة المرور غير صحيحة", 'error'),
    })
  }
}
