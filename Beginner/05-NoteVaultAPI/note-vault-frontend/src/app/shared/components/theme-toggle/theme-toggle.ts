import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme-service';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  template: `
    <button (click)="theme.toggle()" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ease-in-out duration-300">
      {{ theme.isDark() ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggle {
  theme: ThemeService = inject(ThemeService);
}
