import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-mummy-sarcophagus',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="sarcophagus" viewBox="0 0 140 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sarcGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stop-color="rgba(212,145,15,0.55)"/>
          <stop offset="50%" stop-color="rgba(166,130,31,0.35)"/>
          <stop offset="100%" stop-color="rgba(120,80,40,0.30)"/>
        </linearGradient>
        <linearGradient id="goldBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="rgba(237,196,82,0.9)"/>
          <stop offset="100%" stop-color="rgba(166,130,31,0.6)"/>
        </linearGradient>
      </defs>

      <path d="M 20 20
               Q 70 -5 120 20
               L 128 280
               Q 120 310 100 315
               L 40 315
               Q 20 310 12 280
               Z"
            fill="url(#sarcGrad)" stroke="currentColor" stroke-width="1.5" opacity="0.95"/>

      <ellipse cx="70" cy="60" rx="38" ry="42"
               fill="url(#goldBand)" stroke="currentColor" stroke-width="1.2" opacity="0.9"/>

      <path d="M 30 40 L 20 80 L 40 90 L 40 60 Z" fill="url(#goldBand)" opacity="0.85"/>
      <path d="M 110 40 L 120 80 L 100 90 L 100 60 Z" fill="url(#goldBand)" opacity="0.85"/>

      <g fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.9">
        <path d="M 50 60 Q 55 55 60 60 Q 55 65 50 60 Z" fill="currentColor" opacity="0.5"/>
        <path d="M 80 60 Q 85 55 90 60 Q 85 65 80 60 Z" fill="currentColor" opacity="0.5"/>
      </g>

      <path d="M 70 70 L 67 78 L 73 78 Z" fill="currentColor" opacity="0.5"/>

      <path d="M 60 88 Q 70 92 80 88" fill="none" stroke="currentColor" stroke-width="1"/>

      <rect x="65" y="90" width="10" height="30" fill="url(#goldBand)" opacity="0.85"/>

      <path d="M 40 140 Q 70 130 100 140" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M 40 160 Q 70 170 100 160" fill="none" stroke="currentColor" stroke-width="2"/>

      <path d="M 45 135 Q 40 120 48 118 Q 55 120 50 130"
            fill="none" stroke="url(#goldBand)" stroke-width="2.5"/>

      <g stroke="url(#goldBand)" stroke-width="1.5">
        <line x1="90" y1="135" x2="90" y2="155"/>
        <line x1="88" y1="140" x2="94" y2="142"/>
        <line x1="88" y1="145" x2="94" y2="147"/>
        <line x1="88" y1="150" x2="94" y2="152"/>
      </g>

      <g font-family="Hieroglyph, serif" font-size="12" fill="currentColor" opacity="0.7"
         text-anchor="middle">
        <text x="70" y="200">𓂀 𓆣 𓋹 𓇳</text>
        <text x="70" y="220">𓊹 𓆼 𓃀 𓅓</text>
        <text x="70" y="240">𓆑 𓈖 𓉔 𓊪</text>
        <text x="70" y="260">𓎼 𓏏 𓐍 𓂧</text>
        <text x="70" y="280">𓂀 𓁹 𓆣 𓆼</text>
      </g>

      <rect x="15" y="295" width="110" height="8"
            fill="url(#goldBand)" opacity="0.9"/>
    </svg>
  `,
  styles: [`
    :host { display: inline-block; }
    .sarcophagus {
      width: 100%;
      height: auto;
      color: rgba(60, 40, 15, 0.85);
      filter: drop-shadow(0 6px 20px rgba(120, 80, 40, 0.35));
    }
    .dark .sarcophagus {
      color: rgba(237, 196, 82, 0.8);
      filter: drop-shadow(0 6px 24px rgba(237, 196, 82, 0.35));
    }
  `],
})
export class MummySarcophagus { }