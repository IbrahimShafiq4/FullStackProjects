import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private _auth = inject(AuthService);
  private _toast = inject(ToastService);
  private _router = inject(Router);

  public theme = inject(ThemeService);

  readonly year = new Date().getFullYear();

  email = signal('');
  password = signal('');
  loading = signal(false);

  onEmailInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }

  onPasswordInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }

  onSubmit(): void {
    if (!this.email() || !this.password()) {
      this._toast.show('من فضلك املأ كل الحقول.', 'error');
      return;
    }

    this.loading.set(true);

    this._auth.login(this.email(), this.password()).subscribe({
      next: (res) => {
        this._toast.show(`أهلاً ${res.fullName}.`, 'success');
        this._router.navigate(['/events']);
      },
      error: () => {
        this.loading.set(false);
        this._toast.show('البريد أو كلمة المرور غير صحيحة.', 'error');
      },
    });
  }
}