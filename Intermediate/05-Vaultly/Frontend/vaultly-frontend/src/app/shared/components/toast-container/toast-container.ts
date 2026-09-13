import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  imports: [],
  selector: 'app-toast-container',
  styles: ``,
  template: `  
    <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      @for (toast of _ToastServive.toasts(); track toast.id) {
        <div class="px-5 py-3 rounded-lg shadow-lg text-white text-sm min-w-64 text-center animate-toast-in"
          [class.bg-emerald-600]="toast.type === 'success'"
          [class.bg-rose-600]="toast.type === 'error'"
          [class.bg-amber-200]="toast.type === 'info'"
        >
          {{ toast.message }}
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  public _ToastServive = inject(ToastService);
}
