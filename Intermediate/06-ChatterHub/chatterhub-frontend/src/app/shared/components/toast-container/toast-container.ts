import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-stack" role="status" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }
    .toast {
      min-width: 260px;
      max-width: 400px;
      padding: 14px 22px;
      background: var(--surface);
      color: var(--ink);
      font-family: var(--font);
      font-size: 14px;
      font-weight: 600;
      border-radius: var(--r-pill);
      box-shadow: var(--shadow-lg);
      text-align: center;
      animation: pop 320ms cubic-bezier(.22,1,.36,1) both;
    }
    .toast--success { border-left: 3px solid var(--teal); }
    .toast--error   { border-left: 3px solid var(--red); }
    .toast--info    { border-left: 3px solid var(--blue); }
    @keyframes pop {
      0%   { opacity: 0; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
  `],
})
export class ToastContainer {
  toastService = inject(ToastService);
}