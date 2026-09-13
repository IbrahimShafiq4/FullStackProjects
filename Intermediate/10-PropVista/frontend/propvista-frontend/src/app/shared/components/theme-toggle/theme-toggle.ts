import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  imports: [],
  selector: 'app-theme-toggle',
  styles: ``,
  template: `
    <button (click)="_ThemeService.toggle()" 
      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
      {{ _ThemeService.isDark() ? '☀️' : '🌙' }}
    </button>`,

})
export class ThemeToggle { public _ThemeService: ThemeService = inject(ThemeService); }
