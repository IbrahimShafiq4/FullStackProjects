import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme-service';

@Component({
    selector: 'app-theme-toggle',
    template: `
    <button
      class="theme-switch"
      type="button"
      (click)="theme.toggle()"
      [attr.aria-label]="theme.isDark() ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'"
      [attr.aria-pressed]="theme.isDark()">

      <span class="switch-track">
        <span class="switch-thumb" [class.is-dark]="theme.isDark()">
          @if (theme.isDark()) {
            <span class="switch-icon">☾</span>
          } @else {
            <span class="switch-icon">☀</span>
          }
        </span>
      </span>
    </button>
  `,
    styles: `
    .theme-switch {
      background: transparent;
      border: none;
      padding: 0;
      display: inline-flex;
      cursor: pointer;
    }

    .switch-track {
      position: relative;
      width: 56px;
      height: 30px;
      border-radius: 999px;
      background: var(--surface-3);
      border: 1.5px solid var(--border-strong);
      display: flex;
      align-items: center;
      padding: 0 3px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .switch-thumb {
      position: absolute;
      top: 50%;
      right: 3px;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .switch-thumb.is-dark {
      right: calc(100% - 25px);
      background: var(--primary);
    }

    .switch-icon {
      font-size: 12px;
      line-height: 1;
      color: var(--text);
    }

    .switch-thumb.is-dark .switch-icon {
      color: var(--surface);
    }

    .theme-switch:hover .switch-track {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-soft);
    }
  `
})
export class ThemeToggle {
    public theme = inject(ThemeService);
}