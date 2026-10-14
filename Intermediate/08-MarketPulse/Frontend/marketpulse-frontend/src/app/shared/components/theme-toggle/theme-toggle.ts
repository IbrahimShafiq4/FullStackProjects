import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button type="button" class="theme-btn" (click)="_theme.toggle()"
      [attr.aria-label]="_theme.isDark() ? 'الوضع الفاتح' : 'الوضع الداكن'">
      @if (_theme.isDark()) {
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
        </svg>
      } @else {
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>
        </svg>
      }
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
    .theme-btn {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      background: transparent;
      border: 1px solid var(--line);
      border-radius: var(--r-2);
      color: var(--mist);
      cursor: pointer;
      transition: color .16s ease, border-color .16s ease, background .16s ease;
    }
    .theme-btn:hover { color: var(--paper); background: var(--ink-800); border-color: var(--line-2); }
    :host-context(html:not(.dark)) .theme-btn:hover { background: #F5F5F4; color: #17171C; }
  `]
})
export class ThemeToggle {
  _theme = inject(ThemeService);
}