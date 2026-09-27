import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  styles: `
    .toast-wrap {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 260;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 240px;
      max-width: 380px;
      padding: 10px 14px;
      background: var(--surface);
      border: 2px solid var(--rule);
      border-inline-start-width: 4px;
      font-family: 'IBM Plex Sans Arabic', sans-serif;
      font-size: 13px;
      color: var(--ink);
      box-shadow: -3px 3px 0 var(--rule);
      animation: toast-in 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    }

    .toast-success { border-inline-start-color: var(--ink); }
    .toast-error   { border-inline-start-color: var(--accent); }
    .toast-info    { border-inline-start-color: var(--ink-3); }

    .toast-mark {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      flex-shrink: 0;
      font-weight: 700;
    }
    .toast-success .toast-mark { color: var(--ink); }
    .toast-error .toast-mark   { color: var(--accent); }
    .toast-info .toast-mark    { color: var(--ink-3); }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `,
  template: `
    <div class="toast-wrap" dir="rtl">
      @for (toast of _ToastService.toasts(); track toast.id) {
        <div class="toast"
             [class.toast-success]="toast.type === 'success'"
             [class.toast-error]="toast.type === 'error'"
             [class.toast-info]="toast.type === 'info'">
          <span class="toast-mark">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error')   { ✕ }
              @default          { ⓘ }
            }
          </span>
          <span>{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  public _ToastService: ToastService = inject(ToastService);
}