import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toast-wrap">
      @for (t of _toast.toasts(); track t.id) {
        <div class="toast animate-toast-in" [class.ok]="t.type === 'success'"
             [class.err]="t.type === 'error'"
             [class.info]="t.type === 'info'">
          {{ t.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrap {
      position: fixed;
      top: 78px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 60;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      padding: 11px 16px;
      min-width: 260px;
      max-width: 420px;
      font-size: 13px;
      font-family: var(--font-ar);
      border-radius: var(--r-2);
      border: 1px solid var(--line);
      background: var(--ink-850);
      color: var(--paper);
      text-align: center;
      box-shadow: 0 8px 24px rgba(0,0,0,.4);
    }
    .toast.ok  { background: var(--emerald); color: #08130E; border-color: var(--emerald); font-weight: 600; }
    .toast.err { background: var(--rose); color: #FFF; border-color: var(--rose); font-weight: 600; }
    .toast.info { background: var(--ink-800); color: var(--paper); }
  `]
})
export class ToastContainer {
  _toast = inject(ToastService);
}