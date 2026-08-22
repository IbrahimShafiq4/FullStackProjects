import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register  {
  displayName = '';
  email = '';
  password = '';

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    if (!this.displayName || !this.email || !this.password) {
      this.errorMessage.set('لازم تملأ كل الحقول');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('الباسورد لازم يكون 6 أحرف على الأقل');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.register({
      displayName: this.displayName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.[0]?.description ?? 'حصل خطأ في التسجيل');
      }
    });
  }
}
