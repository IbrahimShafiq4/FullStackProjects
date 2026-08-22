import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, IAuth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-register',
  styles: ``,
  templateUrl: './register.html',
})
export class Register {
  private _Auth: AuthService = inject(AuthService);
  private _Toast: Toast = inject(Toast);
  private _Router: Router = inject(Router);

  model:
    {
      fullName: string,
      email: string,
      password: string;
    } = {
      fullName: "",
      email: '',
      password: ''
    }

  onSubmit(): void {
    this._Auth.register(this.model.fullName, this.model.email, this.model.password).subscribe({
      next: (register: IAuth) => {
        this._Toast.show("تم إنشاء الحساب بنجاح، سجل دخولك الآن", 'success');
        this._Router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => this._Toast.show(error.error?.[0] || 'حدث خطأ', 'error')
    })
  }
}
