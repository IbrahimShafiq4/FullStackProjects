import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
<div class="toasts" role="status" aria-live="polite">
  @for (toast of _toast.toasts(); track toast.id) {
    <div class="toast" [attr.data-type]="toast.type">
      <span class="toast__code mono">
        {{ toast.type === 'success' ? 'OK' : toast.type === 'error' ? 'ERR' : 'MSG' }}
      </span>
      <span class="toast__msg">{{ toast.message }}</span>
    </div>
  }
</div>
  `,
  styles: [`
.toasts {
  position: fixed;
  top: 100px;
  inset-inline-start: 24px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  max-width: 380px;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: stretch;
  background: var(--paper);
  border: 1.5px solid var(--ink);
  box-shadow: 4px 4px 0 0 var(--ink);
  animation: toastIn 240ms var(--ease-out);
  font-size: 14px;
}

@keyframes toastIn {
  from { transform: translateY(-8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.toast__code {
  display: grid;
  place-items: center;
  padding: 10px 12px;
  font-size: 10px;
  letter-spacing: 0.14em;
  font-weight: 700;
  color: #fff;
  background: var(--ink);
  border-inline-end: 1.5px solid var(--ink);
  min-width: 48px;
}

.toast[data-type='success'] .toast__code { background: var(--green); border-color: var(--green); }
.toast[data-type='error'] .toast__code { background: var(--red); border-color: var(--red); }
.toast[data-type='info'] .toast__code { background: var(--blue); border-color: var(--blue); }

.toast__msg {
  padding: 10px 14px;
  color: var(--ink);
  line-height: 1.5;
  display: flex;
  align-items: center;
}
  `],
})
export class ToastContainer {
  readonly _toast = inject(ToastService);
}