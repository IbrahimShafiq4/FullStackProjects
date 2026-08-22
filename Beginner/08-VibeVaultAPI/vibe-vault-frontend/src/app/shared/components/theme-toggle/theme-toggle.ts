import { Component, inject } from '@angular/core';
import { Theme } from '../../../core/services/theme';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  template: ` 
    <button (click)="_Theme.toggle()"
      classs="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300 text-xl"
    >
      {{ _Theme.isDark() ? '☀️' : '🌙' }}
    </button>
  `,
  styles: ``,
})
export class ThemeToggle {
  _Theme: Theme = inject(Theme);
}
