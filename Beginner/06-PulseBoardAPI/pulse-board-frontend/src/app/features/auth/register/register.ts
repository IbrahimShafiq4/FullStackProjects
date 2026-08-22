import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, IAuthResponse } from '../../../core/Services/auth';
import { Toast } from '../../../core/Services/toast';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, FormField],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private _Auth   : Auth    = inject(Auth);
  private _Toast  : Toast   = inject(Toast);
  private _Router : Router  = inject(Router);

  registerModel = signal({ fullName: '', email: '', password: '' });
  registerForm  = form(this.registerModel, () => {  });

  onSubmit() {
    const { fullName, email, password } = this.registerModel();

    this._Auth.register(fullName, email, password).subscribe({
      next: (res: IAuthResponse) => {
        this._Toast.show(res.message, 'success');
        this._Router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        const message = err.error;
        this._Toast.show(Array.isArray(message) ? message[0] : 'حصل خطأ فى التسجيل', 'error');
      }
    })
  }
}
