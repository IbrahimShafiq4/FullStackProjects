import { Component, inject } from '@angular/core';
import { Theme } from '../../../core/services/theme';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  template: `
    <button (click)="_Theme.toggle()"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C2226] transition-colors duration-300">
      {{ _Theme.isDark() ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggle {
  _Theme: Theme = inject(Theme);
}
