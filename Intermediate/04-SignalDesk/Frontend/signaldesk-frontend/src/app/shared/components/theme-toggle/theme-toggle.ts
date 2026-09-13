import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  imports: [],
  selector: 'app-theme-toggle',
  template: `
    <button (click)="theme.toggle()" class="p-2 rounded-full hover:bg-cyan/10 transition-colors duration-300">
      {{ theme.isDark() ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggle { theme = inject(ThemeService); }
