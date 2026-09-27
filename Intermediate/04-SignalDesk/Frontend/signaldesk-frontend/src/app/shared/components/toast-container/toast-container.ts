import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [],
  template: `
    <div class="toasts" role="status" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type">
          <span class="toast-mark"></span>
          <span class="toast-text">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toasts {
      position: fixed;
      top: var(--s-5);
      left: var(--s-5);
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: var(--s-2);
      max-width: 380px;
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: var(--s-3);
      padding: var(--s-3) var(--s-4);
      background: var(--paper);
      border: 1px solid var(--line-blue);
      border-inline-start: 3px solid var(--ink-blue);
      font-family: var(--font-body);
      font-size: var(--t-sm);
      color: var(--ink);
      animation: toast-in 220ms var(--ease-out);
      box-shadow: 4px 4px 0 var(--paper-shadow);
      pointer-events: auto;
    }
    .toast-success { border-inline-start-color: var(--ink-amber); }
    .toast-error { border-inline-start-color: var(--ink-red); }
    .toast-mark {
      width: 6px;
      height: 6px;
      background: currentColor;
      color: var(--ink-blue);
      flex-shrink: 0;
    }
    .toast-success .toast-mark { color: var(--ink-amber); }
    .toast-error .toast-mark { color: var(--ink-red); }
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class ToastContainer {
  toastService = inject(ToastService);
}