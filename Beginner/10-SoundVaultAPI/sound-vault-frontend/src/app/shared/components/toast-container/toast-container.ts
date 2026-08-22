import { Component, inject } from '@angular/core';
import { Toast } from '../../../core/services/toast';

@Component({
  imports: [],
  selector: 'app-toast-container',
  template: ` 
    <div class="fixed top-5 left-1/2 -translate-x-1/2 flex flex-col gap-2">
      @for (toast of _Toast.toasts(); track toast.id) {
        <div class="px-5 py-3 rounded-lg shadow-lg text-white text-sm min-w-64 text-center animate-toast-in"
          [class.bg-emerald-600.dark:bg-emerald-700]="toast.type == 'success'"
          [class.bg-rose-600.dark:bg-rose-700]="toast.type == 'error'"
          [class.bg-indigo-600.dark:bg-indigo-700]="toast.type == 'info'"
        >
          {{ toast.message }}
        </div>
      }
    </div>
    `,
  styles: [`
      @keyframes toastIn { 
        from  { opacity: 0; transform: translateY(-20px); }
        to    { opacity: 1; transform: translateY( 0   ); }
      }
      .animate-toast-in { animation: toastIn 0.3s linear; }
    `]
})
export class ToastContainer {
  public _Toast: Toast = inject(Toast);
}
