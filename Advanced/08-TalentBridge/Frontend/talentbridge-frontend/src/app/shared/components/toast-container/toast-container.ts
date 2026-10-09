import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      aria-live="polite"
      aria-atomic="true"
      class="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[min(92vw,420px)]">
      @for (t of toasts.toasts(); track t.id) {
        <div
          class="animate-toast-in flex items-start gap-3 bg-ink dark:bg-dk-ink
                  text-paper dark:text-dk-paper px-4 py-3 rounded-sharp
                  border border-ink dark:border-dk-ink shadow-none">
          <span class="tb-mono-num text-[10px] pt-[3px] opacity-70"
                [style.color]="t.type === 'error' ? '#FF8B6B' : t.type === 'success' ? '#9BE0B6' : 'inherit'">
            ●
          </span>
          <p class="text-[13.5px] leading-snug flex-1">{{ t.message }}</p>
          <button
            type="button"
            (click)="toasts.dismiss(t.id)"
            class="tb-label opacity-60 hover:opacity-100 press-feedback"
            aria-label="إغلاق">
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  public toasts = inject(ToastService);
}