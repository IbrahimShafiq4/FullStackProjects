import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  imports: [RouterLink, FormsModule, FormField],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  public readonly _AuthService: AuthService = inject(AuthService);
  public readonly _ToastService: ToastService = inject(ToastService);
  private readonly _Router: Router = inject(Router);
  private readonly _Route: ActivatedRoute = inject(ActivatedRoute);

  public isLoading: WritableSignal<boolean> = signal<boolean>(false);

  public loginModel: WritableSignal<{ email: string; password: string }> = signal({
    email: '',
    password: ''
  });

  public loginForm = form(this.loginModel, () => { });

  public onSubmit(): void {
    const { email, password } = this.loginModel();
    this.isLoading.set(true);

    this._AuthService.login(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this._ToastService.show('أهلاً بيك تاني', 'success');
        const returnUrl: string | null = this._Route.snapshot.queryParamMap.get('returnUrl');
        const user = this._AuthService.currentUser();

        if (returnUrl) {
          this._Router.navigateByUrl(returnUrl);
        } else if (user?.role === 'Instructor') {
          this._Router.navigate(['/teacher/dashboard']);
        } else {
          this._Router.navigate(['/student/dashboard']);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this._ToastService.show('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
      }
    });
  }
}