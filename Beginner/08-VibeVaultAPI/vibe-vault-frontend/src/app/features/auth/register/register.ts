import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Auth, IRegister } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styles: ``,
})
export class Register {
  private _Auth: Auth = inject(Auth);
  private _Toast: Toast = inject(Toast);
  private _Router: Router = inject(Router);

  model: WritableSignal<{ fullName: string, email: string, password: string }> = signal({ fullName: '', email: '', password: '' })

  onSubmit() {
    const { fullName, email, password } = this.model();

    this._Auth.register(fullName, email, password).subscribe({
      next: (res: IRegister) => {
        this._Toast.show("تم إنشاء الحساب، سجل دخولك", 'success');
        this._Router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => this._Toast.show(Array.isArray(error.error) ? error.error[0] : 'خطأ فى التسجيل', 'error')
    })
  }
}
