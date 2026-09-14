import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';

@Component({
    selector: 'app-toast-container',
    template: `
    <div class="toast-stack">
      @for (toast of _ToastService.toasts(); track toast.id) {
      <div class="pixel-toast" [class]="'pixel-toast-' + toast.type">
        <span class="pixel-toast-icon">
          {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'i' }}
        </span>
        <span class="pixel-toast-msg">{{ toast.message }}</span>
      </div>
      }
    </div>
  `,
    styles: `
    .toast-stack {
      position: fixed;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
      direction: rtl;
    }

    .pixel-toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      background: var(--surface);
      color: var(--ink);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      min-width: 240px;
      max-width: 400px;
      pointer-events: auto;
      animation: toast-in 0.2s steps(4);
    }

    .pixel-toast-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 16px;
      font-weight: 700;
      color: var(--surface);
      flex-shrink: 0;
      border: 2px solid var(--ink);
    }

    .pixel-toast-success .pixel-toast-icon { background: var(--olive); }
    .pixel-toast-error .pixel-toast-icon { background: var(--danger); }
    .pixel-toast-info .pixel-toast-icon { background: var(--orange); }

    .pixel-toast-msg { line-height: 1.4; }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(-16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .toast-stack {
        top: 64px;
        left: 12px;
        right: 12px;
        transform: none;
      }
      .pixel-toast { min-width: auto; max-width: 100%; }
    }
  `
})
export class ToastContainer {
    public _ToastService: ToastService = inject(ToastService);
}