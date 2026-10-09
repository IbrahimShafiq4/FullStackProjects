import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, Role } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  fullName = signal('');
  email = signal('');
  password = signal('');
  role = signal<Role>('Candidate');
  submitting = signal(false);
  error = signal<string | null>(null);

  setRole(r: Role): void {
    this.role.set(r);
  }

  async onSubmit(): Promise<void> {
    console.log('[Register] onSubmit called', {
      fullName: this.fullName(),
      email: this.email(),
      password: '***',
      role: this.role(),
    });

    const fullName = this.fullName().trim();
    const email = this.email().trim();
    const password = this.password();
    const role = this.role();

    if (!fullName || !email || !password) {
      this.error.set('أكمل جميع الحقول.');
      return;
    }
    if (password.length < 6) {
      this.error.set('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    try {
      console.log('[Register] calling auth.register…');
      await new Promise<void>((resolve, reject) => {
        this.auth.register(fullName, email, password, role).subscribe({
          next: () => resolve(),
          error: (err) => reject(err),
        });
      });
      console.log('[Register] success');
      this.toast.show('تم إنشاء الحساب. سجّل دخولك الآن.', 'success');
      this.router.navigate(['/login']);
    } catch (err: any) {
      console.error('[Register] error', err);
      const raw = err?.error;
      let msg = 'تعذّر إنشاء الحساب.';
      if (Array.isArray(raw)) msg = raw[0];
      else if (typeof raw === 'string') msg = raw;
      else if (raw?.message) msg = raw.message;
      this.error.set(msg);
    } finally {
      this.submitting.set(false);
    }
  }
}