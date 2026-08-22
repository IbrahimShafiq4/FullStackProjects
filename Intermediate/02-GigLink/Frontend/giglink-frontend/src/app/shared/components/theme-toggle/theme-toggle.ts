import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme-service';

@Component({
  imports: [],
  selector: 'app-theme-toggle',
  styles: ``,
  template: ` 
    <button (click)="_ThemeService.toggle()" class="p-2 rounded-full transition-colors hover:bg-gray-100 daqrk:bg-gray-700 duration-300 ease-linear">
      {{ _ThemeService.isDark() ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggle { public _ThemeService: ThemeService = inject(ThemeService); }
