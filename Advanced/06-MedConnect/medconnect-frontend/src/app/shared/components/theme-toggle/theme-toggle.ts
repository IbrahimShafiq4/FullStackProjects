import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  styles: `
.toggle {
  height: 30px;
  padding: 0 10px;
  border: 1.5px solid var(--ink);
  background: var(--paper);
  font-size: 10px;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: var(--ink);
  transition: background 160ms var(--ease), color 160ms var(--ease);
}

.toggle:hover {
  background: var(--ink);
  color: var(--paper);
}
  `,
  template: `
<button type="button" class="toggle" (click)="_theme.toggle()" aria-label="تبديل النمط">
  <span class="mono">{{ _theme.isDark() ? 'LGT' : 'DRK' }}</span>
</button>
  `,
})
export class ThemeToggle {
  readonly _theme = inject(ThemeService);
}