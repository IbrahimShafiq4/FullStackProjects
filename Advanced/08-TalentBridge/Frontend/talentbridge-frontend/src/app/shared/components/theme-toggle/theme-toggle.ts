import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      (click)="theme.toggle()"
      [attr.aria-label]="theme.isDark() ? 'الوضع الفاتح' : 'الوضع الداكن'"
      class="tb-label hover:text-signal transition-colors press-feedback
              w-8 h-8 flex items-center justify-center
              border border-line dark:border-dk-line rounded-sharp">
      @if (theme.isDark()) {
        <span aria-hidden="true">☀</span>
      } @else {
        <span aria-hidden="true">☾</span>
      }
    </button>
  `,
})
export class ThemeToggle {
  public theme = inject(ThemeService);
}