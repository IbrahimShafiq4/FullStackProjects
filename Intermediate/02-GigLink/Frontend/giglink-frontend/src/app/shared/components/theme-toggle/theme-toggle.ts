import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme-service';

@Component({
  imports: [],
  selector: 'app-theme-toggle',
  styles: `
    .tt {
      width: 36px;
      height: 36px;
      border: 2px solid var(--line);
      background: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .tt:hover { background: var(--paper-2); }
  `,
  template: `
    <button class="tt" (click)="_ThemeService.toggle()" type="button" aria-label="toggle theme">
      {{ _ThemeService.isDark() ? '☀' : '☾' }}
    </button>
  `
})
export class ThemeToggle {
  public _ThemeService: ThemeService = inject(ThemeService);
}