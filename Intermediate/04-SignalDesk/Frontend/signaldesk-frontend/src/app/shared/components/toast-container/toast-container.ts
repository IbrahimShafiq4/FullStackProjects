import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  imports: [],
  selector: 'app-toast-container',
    template: `
    <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="px-5 py-3 rounded-lg shadow-lg text-base text-sm min-w-64 text-center animate-toast-in font-medium"
              [class.bg-emerald-400]="toast.type === 'success'"
              [class.bg-rose-400]="toast.type === 'error'"
              [class.bg-cyan]="toast.type === 'info'">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
})
export class ToastContainer { toastService = inject(ToastService); }
