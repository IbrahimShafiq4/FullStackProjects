import { Component, inject } from '@angular/core';
import { AuthService, ILogin } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    imports: [FormsModule, RouterLink],
    selector: 'app-login',
    templateUrl: './login.html',
    styles: `
    .login-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: var(--paper);
      position: relative;
    }

    .login-page::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.05) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .panel {
      position: relative;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 1;
    }

    .panel-left {
      background: var(--ink);
      color: var(--paper);
      border-left: 2px solid var(--line);
    }

    .panel-left::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(244,242,236,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244,242,236,0.06) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .panel-right { background: var(--paper); }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: inherit;
      position: relative;
      z-index: 1;
    }

    .brand-mark {
      width: 38px;
      height: 38px;
      background: var(--paper);
      color: var(--ink);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 15px;
    }

    .panel-left .brand-mark {
      background: var(--blue);
      color: var(--paper);
    }

    .brand-name {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-weight: 800;
      font-size: 19px;
      letter-spacing: -0.5px;
    }

    .left-body { position: relative; z-index: 1; }

    .num-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--amber);
      text-transform: uppercase;
      display: block;
      margin-bottom: 16px;
    }

    .left-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: clamp(1.9rem, 3.4vw, 2.8rem);
      line-height: 1.15;
      font-weight: 700;
      letter-spacing: -1px;
      margin: 0 0 16px;
    }

    .left-title em {
      color: var(--blue);
      font-style: normal;
      display: inline-block;
      border-bottom: 3px solid var(--blue);
      padding-bottom: 2px;
    }

    .left-sub {
      font-size: 15px;
      line-height: 1.7;
      color: #a8a8a8;
      max-width: 380px;
      margin: 0 0 28px;
    }

    .left-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border: 1px solid #333;
      margin-top: 28px;
    }

    .left-stat {
      padding: 16px 14px;
      border-left: 1px solid #333;
    }

    .left-stat:last-child { border-left: none; }

    .left-stat-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 22px;
      font-weight: 700;
      color: var(--amber);
      display: block;
      margin-bottom: 3px;
    }

    .left-stat-label {
      font-size: 11px;
      color: #888;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 1px;
    }

    .left-foot {
      position: relative;
      z-index: 1;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #666;
      letter-spacing: 1px;
    }

    .right-body {
      position: relative;
      z-index: 1;
      max-width: 400px;
      width: 100%;
      margin: auto;
    }

    .form-head { margin-bottom: 32px; }

    .form-kicker {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--blue);
      text-transform: uppercase;
      display: block;
      margin-bottom: 12px;
    }

    .form-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -1px;
      margin: 0 0 8px;
    }

    .form-sub { font-size: 14.5px; color: var(--muted); margin: 0; }

    .field { margin-bottom: 16px; }

    .field-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 6px;
    }

    .field-label-num { color: var(--blue); font-weight: 700; }

    .field-input {
      width: 100%;
      padding: 12px 14px;
      background: var(--paper-2);
      border: 2px solid var(--line);
      color: var(--ink);
      font-size: 14.5px;
      font-family: inherit;
      outline: none;
      transition: all 0.15s ease;
    }

    .field-input::placeholder { color: #999; }

    .field-input:focus {
      background: var(--paper);
      box-shadow: 4px 4px 0 var(--blue);
      transform: translate(-2px, -2px);
    }

    .btn-primary {
      width: 100%;
      padding: 14px 20px;
      background: var(--ink);
      color: var(--paper);
      border: 2px solid var(--line);
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      margin-top: 8px;
      transition: all 0.15s ease;
    }

    .btn-primary:hover {
      background: var(--blue);
      border-color: var(--blue);
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    .btn-arrow { font-family: 'JetBrains Mono', monospace; font-size: 18px; }

    .form-foot {
      text-align: center;
      font-size: 14px;
      color: var(--muted);
      margin: 22px 0 0;
    }

    .form-foot a {
      color: var(--ink);
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 2px;
      text-decoration-color: var(--blue);
    }

    @media (max-width: 900px) {
      .login-page { grid-template-columns: 1fr; }
      .panel-left { display: none; }
      .panel { padding: 28px 20px; }
    }
  `
})
export class Login {
    private _Auth: AuthService = inject(AuthService);
    private _Toast: ToastService = inject(ToastService);
    private _Router: Router = inject(Router);

    model = { email: '', password: '' };

    onSubmit() {
        this._Auth.login(this.model.email, this.model.password).subscribe({
            next: (login: ILogin) => {
                this._Toast.show(`مرحباً ${login.fullName}`, 'success');
                if (login.role === 'Employer') {
                    this._Router.navigate(['/quizzes']);
                } else {
                    this._Router.navigate(['/candidate/quizzes']);
                }
            },
            error: (err: HttpErrorResponse) => {
                const message = typeof err.error === 'string' ? err.error : 'بيانات الدخول غير صحيحة';
                this._Toast.show(message, 'error');
            }
        });
    }
}