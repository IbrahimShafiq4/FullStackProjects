import { Component, inject } from '@angular/core';
import { Theme } from '../../../core/services/theme';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button (click)="_Theme.toggle()" class="p-2 rounded-[var(--radius)] hover:bg-[var(--border-color)] transition-colors duration-200 text-lg">
      {{ _Theme.isDark() ? '☀️' : '🌙' }}
    </button>
  `
})
export class ThemeToggle {
  _Theme: Theme = inject(Theme);
}