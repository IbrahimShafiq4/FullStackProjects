import { Component, inject } from '@angular/core';
import { Theme } from '../../../core/services/theme';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  template: `
    <button (click)="_Theme.toggle()"
            class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 text-xl">
      {{ _Theme.isDark() ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggle {
  _Theme: Theme = inject(Theme);
}
