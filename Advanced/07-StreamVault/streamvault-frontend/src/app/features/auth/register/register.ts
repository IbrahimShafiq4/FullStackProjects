import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  imports: [RouterLink, FormsModule, FormField],
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  public readonly _AuthService: AuthService = inject(AuthService);
  public readonly _ToastService: ToastService = inject(ToastService);
  private readonly _Router: Router = inject(Router);

  public isLoading: WritableSignal<boolean> = signal<boolean>(false);
  public showInviteCode: WritableSignal<boolean> = signal<boolean>(false);

  public registerModel: WritableSignal<{
    fullName: string;
    email: string;
    password: string;
    inviteCode: string;
  }> = signal({
    fullName: '',
    email: '',
    password: '',
    inviteCode: ''
  });

  public registerForm = form(this.registerModel, () => { });

  public toggleTeacherMode(): void {
    this.showInviteCode.update((v: boolean) => !v);
  }

  public onSubmit(): void {
    const { fullName, email, password, inviteCode } = this.registerModel();
    this.isLoading.set(true);

    const request$ = this.showInviteCode()
      ? this._AuthService.registerTeacher(fullName, email, password, inviteCode)
      : this._AuthService.register(fullName, email, password);

    request$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this._ToastService.show('تم إنشاء الحساب، سجّل دخولك الآن', 'success');
        this._Router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error.error?.message ?? 'حصل خطأ أثناء التسجيل';
        this._ToastService.show(Array.isArray(message) ? message[0] : message, 'error');
      }
    });
  }
}