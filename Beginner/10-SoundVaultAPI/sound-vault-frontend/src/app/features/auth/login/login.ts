import { Component, inject } from '@angular/core';
import { Auth, ILogin } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { Toast } from '../../../core/services/toast';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private _Auth: Auth = inject(Auth);
  private _Router: Router = inject(Router);
  private _Toast: Toast = inject(Toast);
  model = { email: '', password: '' };

  onSubmit(): void {
    this._Auth.login(this.model.email, this.model.password).subscribe({
      next: () => {
        this._Toast.show('مرحباً بك!', 'success');
        this._Router.navigate(['/sounds']);
      },
      error: () => this._Toast.show('بيانات الدخول غير صحيحة', 'error')
    });
  }
}