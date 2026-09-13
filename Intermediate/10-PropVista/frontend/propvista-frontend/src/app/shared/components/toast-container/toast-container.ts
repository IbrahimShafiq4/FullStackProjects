import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  styles: ``,
  template: ` 
  <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      @for (toast of _ToastsService.toasts(); track toast.id) {
        <div class="px-5 py-3 rounded-lg shadow-lg text-white text-sm min-w-64 text-center animate-toast-in"
              [class.bg-emerald-600]="toast.type === 'success'" 
              [class.bg-rose-600]="toast.type === 'error'" 
              [class.bg-gold]="toast.type === 'info'">
          <div class="flex items-center justify-between gap-4">
            <span>{{ toast.message }}</span>
            @if (toast.action) {
              <button (click)="toast.action!.handler(); _ToastsService.dimiss(toast.id)"
                      class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-semibold transition">
                {{ toast.action.label }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  _ToastsService = inject(ToastService);
}