import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-check-mark',
  standalone: true,
  template: `
    <svg class="check" viewBox="0 0 32 32" fill="none" aria-hidden="true" [style.color]="color()">
      <path
        d="M6 17 L13 24 L26 8"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="32"
        stroke-dashoffset="32"
      />
    </svg>
  `,
  styles: [`
    :host { display: inline-block; line-height: 0; }
    .check { width: 24px; height: 24px; display: block; }
    path { animation: draw-check 620ms var(--ease-out) 120ms forwards; }
    @keyframes draw-check { to { stroke-dashoffset: 0; } }
  `],
})
export class CheckMark {
  @Input() color = signal('var(--ink-red)');
}