import { Component, input } from '@angular/core';

@Component({
  selector: 'app-temple-pillar',
  standalone: true,
  template: `
    <svg class="pillar-svg" [attr.height]="height()" viewBox="0 0 100 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="30" fill="currentColor" opacity="0.35"/>
      <rect x="8" y="30" width="84" height="10" fill="currentColor" opacity="0.25"/>
      <path d="M 10 40 Q 10 60 20 70 L 80 70 Q 90 60 90 40 Z"
            fill="currentColor" opacity="0.15"/>
      <rect x="20" y="70" width="60" height="300" fill="currentColor" opacity="0.10"/>
      <g stroke="currentColor" stroke-width="0.8" opacity="0.5">
        <line x1="25" y1="80"  x2="75" y2="80"/>
        <line x1="25" y1="120" x2="75" y2="120"/>
        <line x1="25" y1="160" x2="75" y2="160"/>
        <line x1="25" y1="200" x2="75" y2="200"/>
        <line x1="25" y1="240" x2="75" y2="240"/>
        <line x1="25" y1="280" x2="75" y2="280"/>
        <line x1="25" y1="320" x2="75" y2="320"/>
      </g>
      <g fill="currentColor" opacity="0.45" font-family="Hieroglyph, serif" font-size="14">
        <text x="50" y="108" text-anchor="middle">𓂀</text>
        <text x="50" y="148" text-anchor="middle">𓆣</text>
        <text x="50" y="188" text-anchor="middle">𓋹</text>
        <text x="50" y="228" text-anchor="middle">𓇳</text>
        <text x="50" y="268" text-anchor="middle">𓊹</text>
        <text x="50" y="308" text-anchor="middle">𓆼</text>
      </g>
      <rect x="8" y="370" width="84" height="15" fill="currentColor" opacity="0.30"/>
      <rect x="0" y="385" width="100" height="15" fill="currentColor" opacity="0.40"/>
    </svg>
  `,
  styles: [`
    .pillar-svg {
      display: block;
      color: rgba(166, 130, 31, 0.7);
      filter: drop-shadow(0 0 12px rgba(212, 145, 15, 0.15));
      transition: filter 0.5s ease;
    }
    .pillar-svg:hover {
      filter: drop-shadow(0 0 20px rgba(212, 145, 15, 0.35));
    }
    .dark .pillar-svg {
      color: rgba(212, 145, 15, 0.6);
      filter: drop-shadow(0 0 16px rgba(212, 145, 15, 0.25));
    }
  `],
})
export class TemplePillar {
  height = input<string>('100%');
}