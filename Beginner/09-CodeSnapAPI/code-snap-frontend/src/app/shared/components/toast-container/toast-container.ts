import { Component, inject } from '@angular/core';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-toast-container',
  imports: [],
  template: ` 
      <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
        @for(toast of _Toast.toasts(); track toast.id) {
          <div class="px-5 py-3 rounded-lg shadow-lg text-white text-sm animate-slide-in
                      flex items-center justify-between gap-4"
                [class.bg-primary]="toast.type == 'success'"
                [class.bg-red-500]="toast.type == 'error'"
                [class.bg-blue-500]="toast.type == 'info'">
            <span>{{ toast.message }}</span>
            <button (click)="_Toast.dismiss(toast.id)" class="text-white/70 hover:text-white">✕</button>
          </div>
        }
      </div>
    `,
  styles: ``,
})
export class ToastContainer { protected _Toast: Toast = inject(Toast); }
