import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import {
  email,
  form,
  minLength,
  required,
  FormField
} from '@angular/forms/signals';

import { Auth } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private _Auth = inject(Auth);
  private _Router = inject(Router);

  loginModel = signal({
    email: '',
    password: ''
  });

  loginForm = form(this.loginModel, (path) => {

    required(path.email);
    email(path.email);

    required(path.password);
    minLength(path.password, 6);

  });

  errorMessage = signal<string | null>(null);

  onSubmit() {

    const { email, password } = this.loginModel();

    this._Auth.login(email, password).subscribe({

      next: (res: { message: string; fullName: string }) => {

        this._Auth.currentUser.set({
          fullName: res.fullName
        });

        this._Router.navigate(['/notes']);
      },

      error: (error: HttpErrorResponse) => {

        this.errorMessage.set(
          'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        );

      }

    });
  }
}