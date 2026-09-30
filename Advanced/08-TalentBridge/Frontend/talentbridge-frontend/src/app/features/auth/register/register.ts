import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);

  formModel: WritableSignal<{ fullName: string, email: string, password: string, role: string }> = signal<{ fullName: string, email: string, password: string, role: string }>({ fullName: '', email: '', password: '', role: 'Candidate' });
  registerForm = form(this.formModel, () => { })

  onSubmit() {
    const { fullName, email, password, role } = this.formModel();
    this._AuthService.register(fullName, email, password, role).subscribe({
      next: () => {
        this._ToastService.show('تم إنشاء الحساب ،، سجل دخولك الآن');
        this._Router.navigate(['/login']);
      },
      error: (err) => {
        const message = err.error;
        this._ToastService.show(Array.isArray(message) ? message[0] : 'حصل خطأ', 'error');
      }
    })
  }
}
