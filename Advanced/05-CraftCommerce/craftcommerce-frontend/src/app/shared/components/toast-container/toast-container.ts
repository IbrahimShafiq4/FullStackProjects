import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toast-wrap" dir="rtl">
      @for (toast of _toast.toasts(); track toast.id) {
        <div class="toast"
             [class.toast--success]="toast.type === 'success'"
             [class.toast--error]="toast.type === 'error'">
          <span class="hw-led"
                [class.hw-led--on]="toast.type === 'success'"
                [class.hw-led--err]="toast.type === 'error'"
                [class.hw-led--warm]="toast.type === 'info'"></span>
          <span class="toast__msg">{{ toast.message }}</span>
          <span class="toast__code hw-serial">
            @switch (toast.type) {
              @case ('success') { OK }
              @case ('error') { ERR }
              @default { INFO }
            }
          </span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrap {
      position: fixed;
      bottom: 20px;
      inset-inline-start: 20px;
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
      min-width: 260px;
      max-width: 400px;
      padding: 12px 14px;
      background: var(--bg-panel);
      border: 1px solid var(--border-hair);
      border-inline-start-width: 3px;
      border-inline-start-color: var(--accent);
      color: var(--fg-base);
      font-family: 'IBM Plex Sans Arabic', sans-serif;
      font-size: 13px;
      box-shadow: var(--shadow-soft);
      animation: toast-in 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    }
    .toast--success { border-inline-start-color: var(--ok); }
    .toast--error   { border-inline-start-color: var(--err); }
    .toast__msg { flex: 1; text-align: right; }
    .toast__code { color: var(--fg-muted); }
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class ToastContainer {
  public _toast = inject(ToastService);
}