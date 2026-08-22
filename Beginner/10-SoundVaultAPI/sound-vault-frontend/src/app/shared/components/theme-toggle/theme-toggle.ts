import { Component, inject } from '@angular/core';
import { Theme } from '../../../core/services/theme';

@Component({
  imports: [],
  selector: 'app-theme-toggle',
  styles: ``,
  template: ` 
    <button (click)="_Theme.toggle()"
      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C2226] transitions-colors duration-300 text-xl"
    >
      {{ _Theme.isDark() ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggle {
  _Theme: Theme = inject(Theme);
}
