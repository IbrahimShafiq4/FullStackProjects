import { Component, inject } from '@angular/core';
import { Theme } from '../../core/Services/theme';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  template: `
    <button (click)="_Theme.toggle()"
      class="p-2 rounded-full hover:bg-black/5 transition-colors duration-300"
    >
      {{ _Theme.isDark() ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggle {
  public readonly _Theme: Theme = inject(Theme);
}
