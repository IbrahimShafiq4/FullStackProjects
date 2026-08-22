import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormField, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private _Auth: Auth     = inject(Auth);
  private _Router: Router = inject(Router);

  private registerModel = signal({ fullName: '', email: '', password: '' });
  registerForm = form(this.registerModel, () => {});

  errorMessage = signal<string | null>(null);

  onSumbit() {
    const { fullName, email, password } = this.registerModel();

    this._Auth.register(fullName, email, password).subscribe({
      next: (res: { message: string }) => {
        this._Router.navigate(['/login'])
      },
      error: (error: HttpErrorResponse) => {
        const messages = error.error;
        this.errorMessage.set(Array.isArray(messages) ? messages[0] : 'حصل خطأ فى التسجيل')
      }
    })
  }
}
