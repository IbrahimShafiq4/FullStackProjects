import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  imports: [],
  selector: 'app-toast-container',
  styles: ``,
  template: ` 
    <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      @for (toast of _ToastService.toasts(); track toast.id) {
        <div class="px-5 py-3 rounded-lg shadow-lg text-white tex-sm min-w-64 text-center animate-toast-in"
          [class.bg-green-800]="toast.type === 'success'"
          [class.bg-rose-600]=" toast.type === 'error'"
          [class.bg-spotlight]="toast.type === 'info'"
        >
          {{ toast.message }}
        </div>
      }
    </div>
  `,
})
export class ToastContainer { public _ToastService: ToastService = inject(ToastService); }
