import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../../core/services/company.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    imports: [FormsModule],
    selector: 'app-company-setup',
    templateUrl: './company-setup.html',
    styles: `
    .setup {
      min-height: 100vh;
      background: var(--paper);
      position: relative;
      padding: 48px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .setup::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .setup-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 540px;
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 40px 32px;
      box-shadow: 12px 12px 0 var(--line);
    }

    .setup-card::before {
      content: 'STEP 01 / 01';
      position: absolute;
      top: -12px;
      right: 22px;
      background: var(--paper);
      padding: 0 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--blue);
      font-weight: 700;
    }

    .setup-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 56px;
      font-weight: 800;
      line-height: 0.85;
      color: var(--amber);
      letter-spacing: -3px;
      display: block;
      margin-bottom: 14px;
    }

    .setup-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -1px;
      margin: 0 0 10px;
      line-height: 1.15;
    }

    .setup-title em { color: var(--blue); font-style: normal; }

    .setup-sub {
      font-size: 15px;
      line-height: 1.65;
      color: var(--muted);
      margin: 0 0 24px;
    }

    .field { margin-bottom: 16px; }

    .field-label {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 6px;
    }

    .field-input {
      width: 100%;
      padding: 13px 15px;
      border: 2px solid var(--line);
      background: var(--paper-2);
      color: var(--ink);
      font-size: 15px;
      font-family: inherit;
      outline: none;
      transition: all 0.15s ease;
    }

    .field-input:focus {
      background: var(--paper);
      box-shadow: 4px 4px 0 var(--blue);
      transform: translate(-2px, -2px);
    }

    .field-hint {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--muted);
      margin-top: 6px;
      display: block;
      letter-spacing: 0.5px;
    }

    .btn-primary {
      width: 100%;
      padding: 15px 22px;
      background: var(--ink);
      color: var(--paper);
      border: 2px solid var(--line);
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      transition: all 0.15s ease;
    }

    .btn-primary:hover {
      background: var(--blue);
      border-color: var(--blue);
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-arrow { font-family: 'JetBrains Mono', monospace; font-size: 20px; }

    .info-block {
      padding: 14px 16px;
      border: 2px dashed var(--line);
      margin-bottom: 20px;
      background: var(--paper-2);
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      padding: 5px 0;
    }

    .info-key { color: var(--muted); }
    .info-val { font-weight: 600; }

    @media (max-width: 640px) {
      .setup { padding: 28px 14px; }
      .setup-card { padding: 28px 20px; box-shadow: 8px 8px 0 var(--line); }
      .setup-num { font-size: 42px; }
      .setup-title { font-size: 22px; }
    }
  `
})
export class CompanySetup {
    private _CompanyService: CompanyService = inject(CompanyService);
    private _Toast: ToastService = inject(ToastService);
    private _Router: Router = inject(Router);

    companyName = '';
    submitting: WritableSignal<boolean> = signal(false);

    onSubmit(): void {
        if (!this.companyName.trim() || this.companyName.trim().length < 2) {
            this._Toast.show('أدخل اسم شركة صحيح (حرفين على الأقل)', 'error');
            return;
        }

        this.submitting.set(true);

        this._CompanyService.create(this.companyName.trim()).subscribe({
            next: () => {
                this._Toast.show('تم إنشاء الشركة بنجاح 🎉', 'success');
                this.submitting.set(false);
                this._Router.navigate(['/quizzes']);
            },
            error: (err) => {
                const message = typeof err.error === 'string' ? err.error : 'فشل إنشاء الشركة';
                this._Toast.show(message, 'error');
                this.submitting.set(false);
            }
        });
    }
}