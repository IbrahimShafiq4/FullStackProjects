import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, Role } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  email = signal('');
  password = signal('');
  submitting = signal(false);
  error = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    const email = this.email().trim();
    const password = this.password();

    if (!email || !password) {
      this.error.set('أدخل البريد وكلمة المرور.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    try {
      const user = await this.auth.login(email, password);
      this.toast.show(`مرحبًا، ${user.fullName}`, 'success');
      this.router.navigate([this.auth.homeFor(user.role as Role)]);
    } catch (err: any) {
      const msg =
        err?.error?.message ??
        err?.error?.Message ??
        'البريد أو كلمة المرور غير صحيحة.';
      this.error.set(msg);
    } finally {
      this.submitting.set(false);
    }
  }
}