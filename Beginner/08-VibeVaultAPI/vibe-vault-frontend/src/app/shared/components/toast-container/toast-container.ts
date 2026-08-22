import { Component, inject } from '@angular/core';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-toast-container',
  imports: [],
  template: ` 
    <div class="fixed top-5 left-1/2 -translate-x-1 z-50 flex flex-col gap-2">
      @for (toast of _Toast.toasts(); track toast.id) {
        <div class="px-5 py-3 rounded-lg shadow-lg text-white text-sm min-w-64 text-center animate-toast-in"
          [class.bg-emerald-600.dark:bg-emerald-700]="toast.type==='success'"
          [class.bg-rose-600.dark:bg-rose-700]="toast.type==='error'"
          [class.bg-[#C16E4C].dark:bg-[#A85B3D]]="toast.type==='info'"
        >
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: [`
      @keyframes toastIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-toast-in { animation: toastIn 0.3s ease-out; }
    `],
})
export class ToastContainer { _Toast: Toast = inject(Toast); }
