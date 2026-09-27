import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  imports: [],
  selector: 'app-toast-container',
  styles: ``,
  template: `
    <div class="fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
      @for (toast of _ToastService.toasts(); track toast.id) {
        <div class="px-5 py-3 rounded-md text-sm min-w-72 text-center animate-toast-in
                    border backdrop-blur-md shadow-lg pointer-events-auto"
              [class.bg-emerald-600/95]="toast.type === 'success'"
              [class.text-white]="toast.type === 'success'"
              [class.border-emerald-400/40]="toast.type === 'success'"
              [class.bg-terracotta-600/95]="toast.type === 'error'"
              [class.text-white]="toast.type === 'error'"
              [class.border-terracotta-400/40]="toast.type === 'error'"
              [class.bg-bronze-500/95]="toast.type === 'info'"
              [class.text-basalt-900]="toast.type === 'info'"
              [class.border-bronze-300/40]="toast.type === 'info'">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  public _ToastService = inject(ToastService);
}