import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm" role="status" aria-live="polite">
      @for (toast of _ToastService.toasts(); track toast.id) {
        <div class="border bg-paper-raised shadow-lg flex items-stretch animate-slide-in"
          [style.border-color]="
            toast.type === 'success' ? 'var(--color-signal-available)' :
            toast.type === 'error'   ? 'var(--color-signal-unavailable)' :
            'var(--color-line-strong)'
          ">
          <div class="w-1"
            [style.background]="
              toast.type === 'success' ? 'var(--color-signal-available)' :
              toast.type === 'error'   ? 'var(--color-signal-unavailable)' :
              'var(--color-ink)'
            "></div>
          <div class="px-4 py-3 flex-1">
            <div class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              {{ toast.type === 'success' ? 'Confirmed' : toast.type === 'error' ? 'Attention' : 'Notice' }}
            </div>
            <div class="text-sm mt-1">{{ toast.message }}</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(16px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in { animation: slide-in 180ms ease-out; }
  `],
})
export class ToastContainer {
  public _ToastService: ToastService = inject(ToastService);
}