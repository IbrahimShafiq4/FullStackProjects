import { Component, inject, signal } from '@angular/core';
import { Auth, IRegister } from '../../../core/Services/auth';
import { Toast } from '../../../core/Services/toast';
import { Router, RouterModule } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, FormField],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private _Auth   : Auth    = inject(Auth);
  private _Toast  : Toast   = inject(Toast); 
  private _Router : Router  = inject(Router);

  registerModel = signal({ fullName: '', email: '', password: '' });
  registerForm  = form(this.registerModel, () => {  });

  onSubmit(): void {
    const { fullName, email, password } = this.registerModel();
    this._Auth.register(fullName, email, password).subscribe({
      next: (res: IRegister) => {
        this._Toast.show(`تم إنشاء الحساب، سجل دخولك الآن يا ${fullName}`, 'success')
        this._Router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => { 
        const messages = error.error;
        this._Toast.show(Array.isArray(messages) ? messages[0] : 'حصل خطأ فى التسجيل', 'error');
      }
    })
  }
}
