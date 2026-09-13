import { Component, inject } from '@angular/core';
import { AuthService, IAuth } from '../../../core/services/auth-service';
import { ToastService } from '../../../core/services/toast-service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
  styles: `
    .auth-desktop {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      direction: rtl;
    }

    .aero-window {
      width: 100%;
      max-width: 480px;
      border-radius: 8px 8px 6px 6px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.55) 0%,
          rgba(240, 248, 255, 0.42) 40%,
          rgba(225, 240, 252, 0.5) 100%);
      border: 1px solid var(--frame-border);
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.65),
        inset 0 0 0 1px rgba(255, 255, 255, 0.55),
        0 24px 70px rgba(0, 25, 60, 0.55),
        0 8px 20px rgba(0, 25, 60, 0.35),
        0 0 40px rgba(110, 180, 240, 0.35);
      backdrop-filter: blur(22px) saturate(1.5);
      -webkit-backdrop-filter: blur(22px) saturate(1.5);
      overflow: hidden;
      position: relative;
    }

    .aero-window::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 62%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.18) 35%,
        rgba(255, 255, 255, 0) 100%);
      pointer-events: none;
      border-radius: 8px 8px 0 0;
    }

    .aero-titlebar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px 6px 14px;
      background:
        linear-gradient(180deg,
          var(--title-1) 0%,
          var(--title-2) 44%,
          var(--title-3) 50%,
          var(--title-4) 100%);
      border-bottom: 1px solid rgba(90, 130, 180, 0.65);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.95),
        inset 0 -1px 0 rgba(255, 255, 255, 0.35);
      z-index: 2;
    }

    .aero-titlebar::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 4px;
      right: 4px;
      height: 48%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.75) 0%,
        rgba(255, 255, 255, 0.15) 60%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 12px 12px;
      pointer-events: none;
    }

    .title-left {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
      z-index: 1;
    }

    .title-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .title-text {
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      font-size: 13px;
      color: #0a2949;
      text-shadow:
        0 1px 0 rgba(255, 255, 255, 0.9),
        0 0 8px rgba(255, 255, 255, 0.6);
    }

    .window-controls {
      display: flex;
      gap: 2px;
      position: relative;
      z-index: 1;
    }

    .win-ctrl {
      width: 30px;
      height: 22px;
      border-radius: 3px;
      border: 1px solid rgba(60, 100, 150, 0.55);
      background:
        linear-gradient(180deg,
          #f8fcff 0%,
          #e5eff9 45%,
          #cddef1 50%,
          #b8d0ea 51%,
          #cfe0f3 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(120, 150, 190, 0.4),
        0 1px 2px rgba(0, 30, 70, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.15s ease;
      text-decoration: none;
      padding: 0;
    }

    .win-ctrl::before {
      content: '';
      position: absolute;
      top: 0;
      left: 6%;
      right: 6%;
      height: 50%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 3px 3px 50% 50% / 3px 3px 8px 8px;
      pointer-events: none;
    }

    .win-ctrl-icon {
      font-size: 11px;
      font-weight: 700;
      color: #1a3a5c;
      position: relative;
      z-index: 1;
      line-height: 1;
    }

    .win-ctrl-close {
      background:
        linear-gradient(180deg,
          #ff9080 0%,
          #e86a58 45%,
          #cc4834 50%,
          #b83020 51%,
          #e05a48 100%);
      border-color: #8b2a1e;
    }

    .win-ctrl-close .win-ctrl-icon {
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(80, 0, 0, 0.5);
    }

    .win-ctrl-close:hover {
      background:
        linear-gradient(180deg,
          #ffb0a0 0%,
          #f08070 45%,
          #d85040 50%,
          #c03020 51%,
          #e87060 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 0 10px rgba(255, 100, 80, 0.7);
    }

    .aero-content {
      position: relative;
      padding: 24px 28px 24px;
      background: var(--content-bg);
      z-index: 1;
    }

    .content-head {
      text-align: center;
      margin-bottom: 20px;
    }

    .content-avatar {
      width: 60px;
      height: 60px;
      margin: 0 auto 12px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cairo', sans-serif;
      font-size: 20px;
      font-weight: 900;
      color: #ffffff;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.7) 0%, transparent 45%),
        linear-gradient(180deg, #6cb8ff 0%, #1e6fd9 50%, #0f52a8 100%);
      border: 1px solid rgba(180, 220, 255, 0.8);
      box-shadow:
        inset 0 -4px 8px rgba(0, 30, 70, 0.35),
        inset 0 2px 4px rgba(255, 255, 255, 0.55),
        0 4px 14px rgba(30, 90, 180, 0.4);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .content-title {
      font-family: 'Cairo', sans-serif;
      font-size: 19px;
      font-weight: 800;
      margin: 0 0 4px;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .content-sub {
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      color: #4a6b8f;
      margin: 0;
    }

    .role-picker {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }

    .role-opt {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 5px;
      cursor: pointer;
      font-family: inherit;
      text-align: right;
      background:
        linear-gradient(180deg,
          var(--btn-1) 0%,
          var(--btn-2) 44%,
          var(--btn-3) 50%,
          var(--btn-4) 51%,
          var(--btn-5) 100%);
      border: 1px solid var(--btn-border);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(140, 170, 210, 0.45),
        0 1px 2px rgba(0, 30, 70, 0.12);
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .role-opt::before {
      content: '';
      position: absolute;
      top: 0;
      left: 4%;
      right: 4%;
      height: 48%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.25) 70%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 5px 5px 50% 50% / 5px 5px 12px 12px;
      pointer-events: none;
    }

    .role-opt:hover {
      border-color: var(--btn-border-2);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 0 10px rgba(90, 160, 240, 0.55),
        0 1px 3px rgba(0, 30, 70, 0.15);
    }

    .role-opt.active {
      background:
        linear-gradient(180deg,
          #8dc4f8 0%,
          #4a90dc 44%,
          #2b78ca 50%,
          #1a5ea8 51%,
          #3a82d0 100%);
      border-color: #0e3e73;
      color: #ffffff;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.5),
        inset 0 -2px 4px rgba(0, 30, 70, 0.4),
        0 3px 10px rgba(30, 90, 180, 0.4),
        0 0 12px rgba(90, 160, 240, 0.4);
    }

    .role-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.85) 0%, transparent 45%),
        linear-gradient(180deg, #6cb8ff 0%, #1e6fd9 100%);
      border: 1px solid rgba(180, 220, 255, 0.7);
      box-shadow:
        inset 0 -2px 3px rgba(0, 30, 70, 0.35),
        0 2px 5px rgba(30, 90, 180, 0.3);
    }

    .role-opt.active .role-icon {
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.95) 0%, transparent 45%),
        linear-gradient(180deg, #ffffff 0%, #d6e8f8 100%);
      border-color: rgba(255, 255, 255, 0.9);
    }

    .role-texts {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      position: relative;
      z-index: 1;
      gap: 1px;
    }

    .role-key {
      font-family: 'Cairo', sans-serif;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.8px;
      opacity: 0.7;
      text-transform: uppercase;
    }

    .role-name {
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 800;
    }

    .role-opt.active .role-name {
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .field-group {
      margin-bottom: 12px;
    }

    .field-label {
      display: block;
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      font-weight: 700;
      color: #1e4a7a;
      margin-bottom: 5px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .aero-input {
      width: 100%;
      padding: 10px 13px;
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 600;
      color: #0a2949;
      background:
        linear-gradient(180deg,
          rgba(235, 244, 252, 0.95) 0%,
          rgba(255, 255, 255, 0.98) 50%,
          rgba(255, 255, 255, 1) 100%);
      border: 1px solid rgba(120, 155, 195, 0.7);
      border-radius: 4px;
      outline: none;
      transition: all 0.2s ease;
      box-shadow:
        inset 0 2px 4px rgba(120, 150, 190, 0.15),
        inset 0 -1px 0 rgba(255, 255, 255, 0.7);
    }

    .aero-input::placeholder {
      color: #8ba4c2;
      font-weight: 500;
    }

    .aero-input:focus {
      border-color: var(--blue);
      background: #ffffff;
      box-shadow:
        inset 0 2px 4px rgba(120, 150, 190, 0.15),
        0 0 0 3px rgba(90, 160, 240, 0.35),
        0 0 12px rgba(90, 160, 240, 0.5);
    }

    .aero-submit {
      position: relative;
      width: 100%;
      margin-top: 8px;
      padding: 11px 18px;
      border-radius: 5px;
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      color: #ffffff;
      background:
        linear-gradient(180deg,
          #8dc4f8 0%,
          #4a90dc 44%,
          #2b78ca 50%,
          #1a5ea8 51%,
          #3a82d0 100%);
      border: 1px solid #0e3e73;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -2px 4px rgba(0, 30, 70, 0.35),
        0 3px 10px rgba(30, 90, 180, 0.4);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .aero-submit::before {
      content: '';
      position: absolute;
      top: 0;
      left: 5%;
      right: 5%;
      height: 46%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.55) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 5px 5px 50% 50% / 5px 5px 20px 20px;
      pointer-events: none;
    }

    .aero-submit:hover {
      background:
        linear-gradient(180deg,
          #a8d5ff 0%,
          #5aa0e8 44%,
          #3a88d8 50%,
          #2a6eb8 51%,
          #4a92e0 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        inset 0 -2px 4px rgba(0, 30, 70, 0.4),
        0 5px 14px rgba(30, 90, 180, 0.5),
        0 0 20px rgba(90, 160, 240, 0.5);
      transform: translateY(-1px);
    }

    .content-foot {
      text-align: center;
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      color: #4a6b8f;
      margin: 16px 0 0;
    }

    .content-foot a {
      color: var(--blue);
      font-weight: 800;
      text-decoration: none;
      margin-inline-start: 4px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .content-foot a:hover {
      text-decoration: underline;
      text-shadow: 0 0 8px rgba(90, 160, 240, 0.6);
    }

    @media (max-width: 480px) {
      .aero-content { padding: 20px 20px; }
      .content-title { font-size: 17px; }
      .content-avatar { width: 52px; height: 52px; font-size: 18px; }
      .role-picker { grid-template-columns: 1fr; }
    }
  `
})
export class Register {
  private _AuthService: AuthService = inject(AuthService);
  private _ToastService: ToastService = inject(ToastService);
  private _Router: Router = inject(Router);

  registerModel = { fullName: '', email: '', password: '', role: 'Client' as 'Client' | 'Freelancer' };

  pickRole(role: 'Client' | 'Freelancer'): void {
    this.registerModel.role = role;
  }

  onSubmit() {
    const { fullName, email, password, role } = this.registerModel;

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      this._ToastService.show('لازم تملى كل الحقول', 'error');
      return;
    }

    this._AuthService.register(fullName, email, password, role).subscribe({
      next: (register: IAuth) => {
        this._ToastService.show('تم إنشاء الحساب، سجل دخولك الآن', 'success');
        this._Router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        const messages = error.error;
        this._ToastService.show(Array.isArray(messages) ? messages[0] : 'حصل خطأ فى التسجيل', 'error');
      }
    });
  }
}