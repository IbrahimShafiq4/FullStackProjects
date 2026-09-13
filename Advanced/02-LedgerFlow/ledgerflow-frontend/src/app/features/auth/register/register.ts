import { Component, inject, signal, WritableSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService, IAuth } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, FormsModule, FormField],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private _AuthService  : AuthService = inject(AuthService);
  private _Router       : Router = inject(Router);
  private _ToastService : ToastService = inject(ToastService);

  registerModel         : WritableSignal<{fullName: string, companyName: string, email: string, password: string}>
  = signal<{fullName: string, companyName: string, email: string, password: string}>({fullName: '', companyName: '', email: '', password: ''});
  
  registerForm = form(this.registerModel, () => {  });

  onSubmit(): void {
    const { fullName, companyName, email, password } = this.registerModel();

    this._AuthService.register(fullName, companyName, email, password).subscribe({
      next: (register: IAuth) => {
        this._ToastService.show('تم إنشاء الحساب', 'success');
        this._Router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error;
        this._ToastService.show(Array.isArray(errorMessage) ? errorMessage[0] : 'حصل خطأ', 'error')
      } 
    })
  }
}