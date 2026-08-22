import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/Services/theme';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    template: `
    <button (click)="theme.toggle()"
            class="p-2 rounded-full hover:bg-white/10 transition-colors duration-300">
        {{ theme.isDark() ? '☀️' : '🌙' }}
    </button>
    `,
})
export class ThemeToggleComponent {
    theme = inject(ThemeService);
}