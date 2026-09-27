import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { HandwrittenUnderline } from '../../../shared/handwritten-underline/handwritten-underline';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, HandwrittenUnderline],
  templateUrl: './login.html',
  styles: `
  :host { display: block; }

.auth {
  display: flex;
  flex-direction: column;
  gap: var(--s-5);
  max-width: 520px;
}

.form {
  border: 1px solid var(--line-blue);
  background: var(--paper-aged);
  padding: var(--s-5);
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
}

.form-foot { padding-top: var(--s-2); }

.btn-primary { width: 100%; }

.btn-primary:disabled { opacity: 0.6; cursor: wait; }

.form-alt {
  text-align: center;
  font-size: var(--t-sm);
  color: var(--ink-soft);
  padding-top: var(--s-3);
  border-top: 1px dashed var(--line-blue-soft);
  line-height: 1.7 !important;
}

.form-link {
  color: var(--ink-blue);
  font-weight: 600;
  margin-inline-start: var(--s-1);
  border-bottom: 1px solid var(--ink-blue);
  padding-bottom: 1px;
}

.form-link:hover { color: var(--ink-red); border-color: var(--ink-red); }
  `,
})
export class Login {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  busy = signal(false);

  submit() {
    const email = this.email().trim();
    const password = this.password();
    if (!email || !password) {
      this.toast.show('املا الإيميل وكلمة المرور', 'error');
      return;
    }

    this.busy.set(true);
    this.auth.login(email, password).subscribe({
      next: (r) => {
        this.auth.currentUser.set({ fullName: r.fullName, role: r.role });
        this.toast.show('الكشكول اتفتح', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.busy.set(false);
        this.toast.show('الإيميل أو كلمة المرور غلط', 'error');
      },
    });
  }
}