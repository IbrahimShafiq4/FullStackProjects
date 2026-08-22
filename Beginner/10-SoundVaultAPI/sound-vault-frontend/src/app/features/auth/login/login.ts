import { Component, inject } from '@angular/core';
import { Auth, ILogin } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { Toast } from '../../../core/services/toast';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private _Auth:    Auth    = inject(Auth);
  private _Router:  Router  = inject(Router);
  private _Toast:   Toast   = inject(Toast);

  model = { email: '', password: '' };

  onSubmit(): void {
    const { email, password } = this.model;

    this._Auth.login(email, password).subscribe({
      next: (res: ILogin) => {
        this._Auth.currentUser.set({ fullName: res.fullName });
        this._Toast.show('مرحبا بك!', 'success');
        this._Router.navigate(['/sounds']);
      },
      error: () => this._Toast.show("بيانات الدخول غير صحيحة", 'error')
    })
  }
}
