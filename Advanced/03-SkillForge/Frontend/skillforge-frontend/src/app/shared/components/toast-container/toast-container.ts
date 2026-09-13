import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast-container',
    template: `
    <div class="toast-wrap">
      @for (toast of _ToastService.toasts(); track toast.id) {
      <div class="toast" [class]="'toast-' + toast.type">
        <span class="toast-icon">
          {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ⓘ' }}
        </span>
        <span class="toast-msg">{{ toast.message }}</span>
      </div>
      }
    </div>
  `,
    styles: `
    .toast-wrap {
      position: fixed;
      top: 76px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      background: var(--paper);
      border: 2px solid var(--line);
      color: var(--ink);
      font-family: 'IBM Plex Sans Arabic', sans-serif;
      font-size: 14px;
      font-weight: 600;
      min-width: 260px;
      max-width: 420px;
      box-shadow: 4px 4px 0 var(--line);
      pointer-events: auto;
      animation: toast-in 0.25s ease-out;
    }

    .toast-icon {
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 12px;
      color: var(--paper);
      flex-shrink: 0;
    }

    .toast-success .toast-icon { background: var(--green); }
    .toast-error .toast-icon { background: var(--red); }
    .toast-info .toast-icon { background: var(--blue); }

    .toast-msg { line-height: 1.4; }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(-16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .toast-wrap {
        top: 68px;
        left: 12px;
        right: 12px;
        transform: none;
      }
      .toast { min-width: auto; max-width: 100%; }
    }
  `
})
export class ToastContainer {
    public _ToastService: ToastService = inject(ToastService);
}