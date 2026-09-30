import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { IconComponent } from '../../../../shared/components/icon/icon/icon';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, FormField, RouterLink, IconComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  readonly theme = inject(ThemeService);

  registerModel = signal({ fullName: '', email: '', password: '' });
  registerForm = form(this.registerModel, () => { });

  onSubmit(): void {
    const { fullName, email, password } = this.registerModel();
    this.authService.register(fullName, email, password).subscribe({
      next: () => {
        this.toast.show('Account created', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const body = err.error;
        const message = Array.isArray(body) ? body[0] : 'Registration failed';
        this.toast.show(message, 'error');
      },
    });
  }
}