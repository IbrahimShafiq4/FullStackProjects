import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';
import { CaseStrip } from '../../../shared/components/case-strip/case-strip';

@Component({
  imports: [FormsModule, RouterLink, AppShell, CaseStrip],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private _auth = inject(AuthService);
  private _toast = inject(ToastService);
  private _router = inject(Router);

  email = signal('');
  password = signal('');
  loading = signal(false);
  revealed = signal(false);

  onSubmit(): void {
    if (!this.email() || !this.password()) {
      this._toast.show('من فضلك املأ كل الحقول.', 'error');
      return;
    }

    this.loading.set(true);
    this._auth.login(this.email(), this.password()).subscribe({
      next: (res) => {
        this._toast.show(`أهلاً ${res.storeName}.`, 'success');
        this._router.navigate(['/products']);
      },
      error: () => {
        this.loading.set(false);
        this._toast.show('البريد أو كلمة المرور غير صحيحة.', 'error');
      },
    });
  }
}