import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, IRegister } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  private _Auth:    Auth    = inject(Auth);
  private _Toast:   Toast   = inject(Toast);
  private _Router:  Router  = inject(Router);

  model = { fullName: '', email: '', password: '' };

  onSubmit() {
    const { fullName, email, password } = this.model;

    this._Auth.register(fullName, email, password).subscribe({
      next: (res: IRegister) => {
        this._Toast.show("تم إنشاء الحساب، سجل دخولك", 'success');
        this._Router.navigate(['/login'])
      },
      error: (err: HttpErrorResponse) => {
        const msg = Array.isArray(err.error) ? err.error[0] : 'حدث خطأ'
        this._Toast.show(msg, 'error');
      }
    })
  }
}
