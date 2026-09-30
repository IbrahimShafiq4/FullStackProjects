import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField, RouterLink, FormsModule, IconComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  readonly theme = inject(ThemeService);

  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, () => { });

  onSubmit(): void {
    const { email, password } = this.loginModel();
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => this.toast.show('Wrong email or password', 'error'),
    });
  }
}