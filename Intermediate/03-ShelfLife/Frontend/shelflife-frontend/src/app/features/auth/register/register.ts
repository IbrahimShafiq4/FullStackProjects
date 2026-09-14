import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
  styles: `
    .auth-stage {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 20px;
      direction: rtl;
      background: var(--bg);
      background-image:
        linear-gradient(45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(-45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--bg-2) 75%),
        linear-gradient(-45deg, transparent 75%, var(--bg-2) 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 8px 8px 0 var(--ink);
      padding: 24px 22px;
      position: relative;
    }

    .auth-card::before {
      content: '';
      position: absolute;
      top: -3px;
      right: -3px;
      width: 14px;
      height: 14px;
      background: var(--orange);
      border: 3px solid var(--ink);
    }

    .auth-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 3px dashed var(--ink);
    }

    .auth-brand-mark {
      width: 40px;
      height: 40px;
      background: var(--olive);
      color: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 26px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .auth-brand-texts { display: flex; flex-direction: column; gap: 2px; }

    .auth-brand-name {
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1;
    }

    .auth-brand-tag {
      font-family: var(--font-pixel-en);
      font-size: 16px;
      color: var(--orange-2);
      line-height: 1;
    }

    .auth-title {
      font-family: var(--font-pixel-ar);
      font-size: 24px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 6px;
      text-align: start;
    }

    .auth-sub {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      color: var(--muted);
      margin: 0 0 18px;
      text-align: start;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 12px;
    }

    .field-label {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--ink-2);
      text-align: start;
    }

    .field-input {
      width: 100%;
      padding: 10px 12px;
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      color: var(--ink);
      background: var(--surface-2);
      border: 2.5px solid var(--ink);
      box-shadow: inset 2px 2px 0 rgba(26, 28, 20, 0.08);
      outline: none;
      transition: all 0.1s steps(2);
      text-align: start;
    }

    .field-input:focus {
      background: var(--surface);
      box-shadow: 3px 3px 0 var(--orange);
      transform: translate(-1px, -1px);
    }

    .btn-submit {
      width: 100%;
      padding: 12px 18px;
      margin-top: 8px;
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      font-weight: 700;
      color: var(--surface);
      background: var(--olive);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
    }

    .btn-submit:hover {
      background: var(--olive-2);
      transform: translate(-1px, -1px);
      box-shadow: 5px 5px 0 var(--ink);
    }

    .auth-foot {
      text-align: center;
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      color: var(--muted);
      margin: 16px 0 0;
    }

    .auth-foot a {
      color: var(--orange-2);
      font-weight: 700;
      text-decoration: none;
      border-bottom: 2px dashed var(--orange-2);
    }

    .auth-foot a:hover { color: var(--olive); border-color: var(--olive); }
  `
})
export class Register {
  private _auth = inject(AuthService);
  private _toast = inject(ToastService);
  private _router = inject(Router);

  model = { fullName: '', email: '', password: '' };

  onSubmit(): void {
    const { fullName, email, password } = this.model;

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      this._toast.show('املا كل الحقول', 'error');
      return;
    }

    this._auth.register(fullName, email, password).subscribe({
      next: () => {
        this._toast.show('تم إنشاء الحساب', 'success');
        this._router.navigate(['/login']);
      },
      error: (err) => {
        const messages = err.error;
        this._toast.show(Array.isArray(messages) ? messages[0] : 'حصل خطأ', 'error');
      }
    });
  }
}