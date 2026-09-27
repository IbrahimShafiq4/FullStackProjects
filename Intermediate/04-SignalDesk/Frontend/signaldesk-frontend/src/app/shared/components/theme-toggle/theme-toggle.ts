import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  template: `
    <button
      type="button"
      class="lamp"
      (click)="toggle()"
      [attr.aria-label]="isNight() ? 'النهار' : 'الليل'"
    >
      <span class="lamp-mark">{{ isNight() ? '☀' : '☾' }}</span>
      <span class="lamp-label">{{ isNight() ? 'نهار' : 'ليل' }}</span>
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
    .lamp {
      display: inline-flex;
      align-items: center;
      gap: var(--s-2);
      font-family: var(--font-mono);
      font-size: var(--t-xs);
      color: var(--ink-blue);
      border: 1px solid var(--line-blue);
      padding: var(--s-1) var(--s-3);
      background: var(--paper);
      transition: background-color var(--duration-fast) var(--ease-out),
                  color var(--duration-fast) var(--ease-out),
                  border-color var(--duration-fast) var(--ease-out);
      line-height: 1.4 !important;
    }
    .lamp:hover {
      background: var(--paper-aged);
      border-color: var(--ink-blue);
    }
    .lamp-mark { font-size: var(--t-sm); line-height: 1 !important; }
    .lamp-label { font-size: var(--t-xs); line-height: 1.4 !important; }
  `],
})
export class ThemeToggle {
  private themeService = inject(ThemeService);
  readonly isNight = computed(() => this.themeService.theme() === 'night');

  toggle() {
    this.themeService.set(this.isNight() ? 'classic' : 'night');
  }
}