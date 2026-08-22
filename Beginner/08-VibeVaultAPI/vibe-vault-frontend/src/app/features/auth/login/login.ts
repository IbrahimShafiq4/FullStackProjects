import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, ILogin } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  private _Auth   : Auth    = inject(Auth);
  private _Toast  : Toast   = inject(Toast);
  private _Router : Router  = inject(Router);

  model = signal({ email: '', password: '' })

  onSubmit(): void {
    const { email, password } = this.model();
    this._Auth.login(email, password).subscribe({
      next: (res: ILogin) => {
        this._Auth.currentUser.set({ fullName: res.fullName });
        this._Toast.show(`مرحبا بك ${res.fullName}`, 'success');
        this._Router.navigate(['/timeline']);
      },
      error: (error: HttpErrorResponse) => this._Toast.show('بيانات الدخول غير صحيحة', 'error'),
    })
  }
}
