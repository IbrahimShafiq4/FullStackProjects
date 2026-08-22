import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import { Toast } from '../../../core/Services/toast';

@Component({
  selector: 'app-toast-container',
  imports: [],
  template: `
    <div
      class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2"
    >
      @for (toast of _toast.toasts(); track toast.id) {
        <div
          class="px-5 py-3 rounded-lg shadow-lg text-white text-sm min-w-64 text-center animate-toast-in"
          [class.bg-emerald-600]="toast.type === 'success'"
          [class.bg-rose-600]="toast.type === 'error'"
          [class.bg-violet-600]="toast.type === 'info'"
        >
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainer {

  _toast = inject(Toast);

}