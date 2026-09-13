import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  imports: [],
  selector: 'app-toast-container',
  template: `
    <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md px-4">
      @for (toast of _ToastService.toasts(); track toast.id) {
        <div class="px-4 py-2.5 rounded-lg shadow-apple-lg text-sm text-center animate-toast-in backdrop-blur-sm"
              [class.bg-emerald-50]="toast.type === 'success'"
              [class.text-emerald-800]="toast.type === 'success'"
              [class.bg-rose-50]="toast.type === 'error'"
              [class.text-rose-800]="toast.type === 'error'"
              [class.bg-brand-50]="toast.type === 'info'"
              [class.text-brand-800]="toast.type === 'info'">
          {{ toast.message }}
        </div>
      }
    </div>
  `
})
export class ToastContainer { public _ToastService: ToastService = inject(ToastService); }