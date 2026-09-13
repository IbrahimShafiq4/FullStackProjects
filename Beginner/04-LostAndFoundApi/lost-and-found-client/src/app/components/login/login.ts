import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCurrentUser } from '../../store/auth/auth.action';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  private store = inject(Store);
  constructor(private authService: AuthService, private router: Router) { }
  submit(): void {
    if (!this.email || !this.password) { this.errorMessage.set('املأ الحقول'); return; }
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => { this.isSubmitting.set(false); this.store.dispatch(loadCurrentUser()); this.router.navigate(['/items']); },
      error: () => { this.isSubmitting.set(false); this.errorMessage.set('بيانات الدخول غير صحيحة'); }
    });
  }
}