import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, IAuth, TRole } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    imports: [RouterLink, FormsModule],
    selector: 'app-register',
    templateUrl: './register.html',
    styles: `
    .reg-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: var(--paper);
      position: relative;
    }

    .reg-page::before {
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

    .panel-right { background: var(--paper); }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: inherit;
    }

    .brand-mark {
      width: 38px;
      height: 38px;
      background: var(--blue);
      color: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 15px;
    }

    .brand-name {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-weight: 800;
      font-size: 19px;
      letter-spacing: -0.5px;
    }

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
      color: var(--amber);
      font-style: normal;
      display: inline-block;
      border-bottom: 3px solid var(--amber);
      padding-bottom: 2px;
    }

    .left-sub {
      font-size: 15px;
      line-height: 1.7;
      color: #a8a8a8;
      max-width: 400px;
      margin: 0 0 24px;
    }

    .perks {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 24px;
    }

    .perk {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border: 1px solid #333;
      background: rgba(255,255,255,0.02);
    }

    .perk-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--amber);
      font-weight: 700;
    }

    .perk-text { font-size: 13.5px; color: #ccc; }

    .form-head { margin-bottom: 24px; }

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

    .role-picker {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 2px solid var(--line);
      margin-bottom: 20px;
    }

    .role-opt {
      padding: 14px;
      background: var(--paper-2);
      border: none;
      cursor: pointer;
      text-align: right;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .role-opt:first-child { border-left: 2px solid var(--line); }

    .role-opt.active {
      background: var(--ink);
      color: var(--paper);
    }

    .role-opt-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.6;
      display: block;
      margin-bottom: 4px;
    }

    .role-opt-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 15px;
      font-weight: 700;
    }

    .field { margin-bottom: 14px; }

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
      margin: 20px 0 0;
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
      .reg-page { grid-template-columns: 1fr; }
      .panel-left { display: none; }
      .panel { padding: 28px 20px; }
    }
  `
})
export class Register {
    private _Auth: AuthService = inject(AuthService);
    private _Toast: ToastService = inject(ToastService);
    private _Router: Router = inject(Router);

    selectedRole: WritableSignal<TRole> = signal<TRole>('Candidate');
    model = { fullName: '', email: '', password: '' };

    pickRole(role: TRole): void {
        this.selectedRole.set(role);
    }

    onSubmit(): void {
        this._Auth.register(this.model.fullName, this.model.email, this.model.password, this.selectedRole()).subscribe({
            next: (res: IAuth) => {
                this._Toast.show(res.message, 'success');
                this._Router.navigate(['/login']);
            },
            error: (err: HttpErrorResponse) => {
                const message = Array.isArray(err.error) ? err.error[0] : (err.error || 'حدث خطأ');
                this._Toast.show(message, 'error');
            }
        });
    }
}