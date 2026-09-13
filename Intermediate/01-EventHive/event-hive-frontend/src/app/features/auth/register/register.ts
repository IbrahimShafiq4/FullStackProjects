import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, IAuth } from '../../../core/services/auth';
import { Toast } from '../../../core/services/toast';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-register',
  styles: `
  
  .auth-page {
    position: relative;
    min-height: 100vh;
    background: var(--bg);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .auth-bg {
    position: absolute;
    top: -30%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 900px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 60%);
    pointer-events: none;
    filter: blur(40px);
  }

  .auth-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
    pointer-events: none;
  }

  .auth-home {
    position: absolute;
    top: 24px;
    right: 32px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text);
    text-decoration: none;
    font-family: 'Reem Kufi', sans-serif;
    font-weight: 700;
    font-size: 16px;
  }

  .auth-split {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1100px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 28px;
    overflow: hidden;
    min-height: 620px;
    box-shadow: 0 40px 100px -40px rgba(0, 0, 0, 0.8);
  }

  .auth-aside {
    position: relative;
    padding: 56px 48px;
    background: var(--surface-2);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  .auth-aside::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.13) 0%, transparent 60%);
    filter: blur(30px);
    pointer-events: none;
  }

  .auth-aside-content {
    position: relative;
    z-index: 1;
  }

  .auth-kicker {
    display: inline-block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 16px;
  }

  .auth-aside-title {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 40px;
    line-height: 1.1;
    letter-spacing: -1.2px;
    font-weight: 600;
    margin: 0 0 20px;
  }

  .auth-aside-title em {
    color: var(--accent);
    font-style: italic;
    font-weight: 700;
    display: block;
  }

  .auth-aside-sub {
    color: var(--muted);
    font-size: 15px;
    line-height: 1.8;
    margin: 0 0 40px;
    max-width: 340px;
  }

  .auth-features {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .auth-feature {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .auth-feature-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .auth-feature h4 {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 2px;
  }

  .auth-feature p {
    color: var(--muted);
    font-size: 12px;
    margin: 0;
  }

  .auth-aside-footer {
    position: relative;
    z-index: 1;
    padding-top: 32px;
    border-top: 1px solid var(--border);
  }

  .auth-quote p {
    font-size: 13px;
    line-height: 1.7;
    color: var(--text-dim);
    margin: 0 0 8px;
    font-style: italic;
  }

  .auth-quote span {
    font-size: 12px;
    color: var(--muted);
  }

  .auth-main {
    padding: 56px 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-form {
    width: 100%;
    max-width: 380px;
  }

  .auth-form-head {
    margin-bottom: 32px;
  }

  .auth-form-title {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.8px;
    margin: 4px 0 8px;
  }

  .auth-form-sub {
    color: var(--muted);
    font-size: 14px;
    margin: 0;
  }

  .auth-field {
    margin-bottom: 20px;
  }

  .auth-field label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-dim);
    margin-bottom: 8px;
  }

  .auth-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .auth-input-icon {
    position: absolute;
    right: 16px;
    color: var(--muted);
    font-size: 14px;
    pointer-events: none;
  }

  .auth-input-wrap input {
    width: 100%;
    padding: 14px 44px 14px 16px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-size: 14px;
    transition: all 0.25s ease;
    outline: none;
  }

  .auth-input-wrap input::placeholder {
    color: #5a5a60;
  }

  .auth-input-wrap input:focus {
    border-color: var(--accent);
    background: var(--surface-3);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }

  .auth-btn {
    width: 100%;
    padding: 14px 20px;
    background: var(--accent);
    color: #0a0a0b;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 8px;
    transition: all 0.25s ease;
    font-family: inherit;
  }

  .auth-btn:hover {
    background: var(--accent-2);
    transform: translateY(-1px);
    box-shadow: 0 16px 40px -16px var(--accent);
  }

  .auth-btn-arrow {
    transition: transform 0.25s ease;
  }

  .auth-btn:hover .auth-btn-arrow {
    transform: translateX(-4px);
  }

  .auth-switch {
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    margin: 28px 0 0;
  }

  .auth-switch a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    margin-inline-start: 4px;
    transition: opacity 0.25s ease;
  }

  .auth-switch a:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  @media (max-width: 900px) {
    .auth-split {
        grid-template-columns: 1fr;
        max-width: 480px;
        min-height: auto;
    }

    .auth-aside {
        padding: 40px 32px;
        border-left: none;
        border-bottom: 1px solid var(--border);
    }

    .auth-aside-title {
        font-size: 32px;
    }

    .auth-features,
    .auth-aside-footer {
        display: none;
    }

    .auth-main {
        padding: 40px 32px;
    }

    .auth-home {
        top: 20px;
        right: 20px;
    }
  }

  @media (max-width: 480px) {
    .auth-page {
        padding: 20px 12px;
    }

    .auth-aside,
    .auth-main {
        padding: 32px 24px;
    }
  }

  `,
  templateUrl: './register.html',
})
export class Register {
  private _Auth: AuthService = inject(AuthService);
  private _Toast: Toast = inject(Toast);
  private _Router: Router = inject(Router);

  model:
    {
      fullName: string,
      email: string,
      password: string;
    } = {
      fullName: "",
      email: '',
      password: ''
    }

  onSubmit(): void {
    this._Auth.register(this.model.fullName, this.model.email, this.model.password).subscribe({
      next: (register: IAuth) => {
        this._Toast.show("تم إنشاء الحساب بنجاح، سجل دخولك الآن", 'success');
        this._Router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => this._Toast.show(error.error?.[0] || 'حدث خطأ', 'error')
    })
  }
}
