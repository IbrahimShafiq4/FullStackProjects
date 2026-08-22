import { Component, inject } from '@angular/core';
import { AuthService, ILogin } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styles: ``,
  templateUrl: './login.html',
})
export class Login {
  private _Auth: AuthService = inject(AuthService);
  private _Toast: Toast = inject(Toast);
  private _Router: Router = inject(Router);

  model = { email: '', password: '' };

  onSubmit() {
    this._Auth.login(this.model.email, this.model.password).subscribe({
      next: (login: ILogin) => {
        this._Auth.currentUser.set({ fullName: login.fullName });
        this._Toast.show(`مرحبا بك ${login.fullName}`, 'success');
        this._Router.navigate(['/events']);
      },
      error: () => this._Toast.show('بيانات الدخول غير صحيحة', 'error'),
    })
  }
}
