import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="_ThemeService.toggle()"
      [attr.aria-label]="_ThemeService.isDark() ? 'الوضع النهاري' : 'الوضع الليلي'"
      [attr.aria-pressed]="_ThemeService.isDark()"
      class="theme-toggle group relative w-11 h-11 rounded-full
             flex items-center justify-center
             border border-gold-500/40
             bg-gradient-to-br from-gold-100/40 to-transparent
             dark:from-gold-500/15 dark:to-transparent
             hover:border-gold-500/80
             transition-all duration-500 overflow-hidden">

      <span
        class="absolute inset-0 rounded-full pointer-events-none
               bg-gradient-to-br from-gold-300/0 via-gold-400/0 to-gold-500/0
               group-hover:from-gold-300/30 group-hover:to-gold-500/20
               transition-all duration-500"></span>

      <svg
        viewBox="0 0 24 24"
        class="absolute w-5 h-5 text-gold-600 transition-all duration-500 ease-out"
        [class]="_ThemeService.isDark()
          ? 'opacity-0 rotate-90 scale-50'
          : 'opacity-100 rotate-0 scale-100'"
        fill="none" stroke="currentColor" stroke-width="1.6"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.25"/>
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
      </svg>

      <svg
        viewBox="0 0 24 24"
        class="absolute w-5 h-5 text-gold-300 transition-all duration-500 ease-out"
        [class]="_ThemeService.isDark()
          ? 'opacity-100 rotate-0 scale-100'
          : 'opacity-0 -rotate-90 scale-50'"
        fill="none" stroke="currentColor" stroke-width="1.6"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
              fill="currentColor" fill-opacity="0.2"/>
      </svg>

      @if (_ThemeService.isDark()) {
        <span class="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-gold-300/80
                     animate-ping"></span>
      }
    </button>
  `,
  styles: [`
    .theme-toggle:hover {
      box-shadow: 0 0 20px rgba(212, 145, 15, 0.4);
    }
  `],
})
export class ThemeToggle {
  public _ThemeService: ThemeService = inject(ThemeService);
}