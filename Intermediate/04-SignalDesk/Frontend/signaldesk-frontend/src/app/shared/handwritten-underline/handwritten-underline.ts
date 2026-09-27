import { AfterViewInit, Component, ElementRef, Input, signal, inject } from '@angular/core';

@Component({
  selector: 'app-handwritten-underline',
  standalone: true,
  template: `
    <svg
      class="underline"
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      [style.color]="color()"
    >
      <path
        d="M2 4 Q 30 1.5, 60 3.5 T 118 4 T 198 3.5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-dasharray="220"
        stroke-dashoffset="220"
      />
    </svg>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .underline { display: block; width: 100%; height: 8px; overflow: visible; }
    path {
      transition: stroke-dashoffset 780ms var(--ease-out);
    }
    :host(.is-drawn) path { stroke-dashoffset: 0; }
  `],
})
export class HandwrittenUnderline implements AfterViewInit {
  @Input() color = signal('var(--ink-blue)');
  private el = inject(ElementRef<HTMLElement>);

  ngAfterViewInit() {
    requestAnimationFrame(() => this.el.nativeElement.classList.add('is-drawn'));
  }
}