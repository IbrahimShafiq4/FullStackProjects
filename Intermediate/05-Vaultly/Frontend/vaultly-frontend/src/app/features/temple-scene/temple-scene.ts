import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-temple-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="temple" viewBox="0 0 800 500" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sandBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="rgba(212,145,15,0.15)"/>
          <stop offset="100%" stop-color="rgba(120,80,40,0.30)"/>
        </linearGradient>
        <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="rgba(166,130,31,0.55)"/>
          <stop offset="100%" stop-color="rgba(120,80,40,0.30)"/>
        </linearGradient>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="rgba(166,130,31,0.35)"/>
          <stop offset="100%" stop-color="rgba(120,80,40,0.20)"/>
        </linearGradient>
        <radialGradient id="sunDisc" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stop-color="rgba(244,221,138,0.9)"/>
          <stop offset="100%" stop-color="rgba(212,145,15,0)"/>
        </radialGradient>
      </defs>

      <circle cx="400" cy="120" r="80" fill="url(#sunDisc)"/>
      <circle cx="400" cy="120" r="28" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
      <circle cx="400" cy="120" r="16" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>

      <path d="M0 380 L120 280 L220 320 L320 260 L420 300 L520 270 L620 320 L720 280 L800 340 L800 500 L0 500 Z"
            fill="rgba(120,80,40,0.15)"/>

      <rect x="80" y="420" width="640" height="40" fill="url(#sandBase)"
            stroke="currentColor" stroke-width="1" opacity="0.8"/>

      <polygon points="100,420 100,180 180,140 180,420" fill="url(#wallGrad)"
               stroke="currentColor" stroke-width="1.2" opacity="0.85"/>
      <rect x="110" y="200" width="60" height="180" fill="none"
            stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
      <g font-family="Hieroglyph, serif" font-size="18" fill="currentColor" opacity="0.7"
         text-anchor="middle">
        <text x="140" y="235">𓂀</text>
        <text x="140" y="265">𓆣</text>
        <text x="140" y="295">𓋹</text>
        <text x="140" y="325">𓇳</text>
        <text x="140" y="355">𓊹</text>
      </g>

      <polygon points="620,420 620,140 700,180 700,420" fill="url(#wallGrad)"
               stroke="currentColor" stroke-width="1.2" opacity="0.85"/>
      <rect x="630" y="200" width="60" height="180" fill="none"
            stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
      <g font-family="Hieroglyph, serif" font-size="18" fill="currentColor" opacity="0.7"
         text-anchor="middle">
        <text x="660" y="235">𓆼</text>
        <text x="660" y="265">𓃀</text>
        <text x="660" y="295">𓅓</text>
        <text x="660" y="325">𓆑</text>
        <text x="660" y="355">𓈖</text>
      </g>

      <rect x="100" y="160" width="600" height="30" fill="url(#wallGrad)"
            stroke="currentColor" stroke-width="1.2" opacity="0.9"/>
      <g transform="translate(400, 175)" opacity="0.9">
        <circle r="10" fill="none" stroke="currentColor" stroke-width="1.2"/>
        <circle r="5"  fill="currentColor" opacity="0.5"/>
        <path d="M -20 0 Q -60 -8 -120 0" fill="none" stroke="currentColor" stroke-width="1"/>
        <path d="M -25 4 Q -60 8 -120 4" fill="none" stroke="currentColor" stroke-width="1"/>
        <path d="M 20 0 Q 60 -8 120 0" fill="none" stroke="currentColor" stroke-width="1"/>
        <path d="M 25 4 Q 60 8 120 4" fill="none" stroke="currentColor" stroke-width="1"/>
      </g>

      @for (i of [0,1,2,3]; track i) {
        <g [attr.transform]="'translate(' + (240 + i * 100) + ', 190)'">
          <path d="M 0 0 Q 0 -25 20 -25 Q 40 -25 40 0 Z"
                fill="url(#colGrad)" stroke="currentColor" stroke-width="0.8" opacity="0.8"/>
          <rect x="6" y="0" width="28" height="200"
                fill="url(#colGrad)" stroke="currentColor" stroke-width="0.8" opacity="0.75"/>
          <line x1="10" y1="30"  x2="30" y2="30"  stroke="currentColor" stroke-width="0.5" opacity="0.5"/>
          <line x1="10" y1="70"  x2="30" y2="70"  stroke="currentColor" stroke-width="0.5" opacity="0.5"/>
          <line x1="10" y1="110" x2="30" y2="110" stroke="currentColor" stroke-width="0.5" opacity="0.5"/>
          <line x1="10" y1="150" x2="30" y2="150" stroke="currentColor" stroke-width="0.5" opacity="0.5"/>
          <line x1="10" y1="190" x2="30" y2="190" stroke="currentColor" stroke-width="0.5" opacity="0.5"/>
          <rect x="0" y="200" width="40" height="10"
                fill="url(#colGrad)" stroke="currentColor" stroke-width="0.6" opacity="0.85"/>
        </g>
      }

      <rect x="200" y="190" width="400" height="210" fill="url(#wallGrad)"
            stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
      <g font-family="Hieroglyph, serif" font-size="14" fill="currentColor" opacity="0.55">
        <text x="220" y="215">𓂀</text><text x="250" y="215">𓆣</text>
        <text x="280" y="215">𓋹</text><text x="310" y="215">𓇳</text>
        <text x="340" y="215">𓊹</text><text x="370" y="215">𓆼</text>
        <text x="400" y="215">𓃀</text><text x="430" y="215">𓅓</text>
        <text x="460" y="215">𓆑</text><text x="490" y="215">𓈖</text>
        <text x="520" y="215">𓉔</text><text x="550" y="215">𓊪</text>
      </g>

      <g transform="translate(200, 340)">
        <path d="M -8 -40 L -12 -60 L -4 -52 L 4 -52 L 12 -60 L 8 -40 Z"
              fill="currentColor" opacity="0.65"/>
        <circle cx="0" cy="-34" r="10" fill="currentColor" opacity="0.55"/>
        <rect x="-10" y="-24" width="20" height="60" fill="currentColor" opacity="0.45"/>
        <rect x="-15" y="36" width="30" height="8" fill="currentColor" opacity="0.65"/>
      </g>

      <g transform="translate(600, 340)">
        <path d="M -8 -40 L -12 -60 L -4 -52 L 4 -52 L 12 -60 L 8 -40 Z"
              fill="currentColor" opacity="0.65"/>
        <circle cx="0" cy="-34" r="10" fill="currentColor" opacity="0.55"/>
        <rect x="-10" y="-24" width="20" height="60" fill="currentColor" opacity="0.45"/>
        <rect x="-15" y="36" width="30" height="8" fill="currentColor" opacity="0.65"/>
      </g>

      <g transform="translate(400, 445)">
        <rect x="-50" y="-8" width="100" height="10" fill="currentColor" opacity="0.5"/>
        <rect x="-40" y="-30" width="80" height="24" fill="currentColor" opacity="0.4"/>
        <rect x="-30" y="-48" width="60" height="20" fill="currentColor" opacity="0.5"/>
        <path d="M -30 -48 L -34 -58 L -22 -54 L 22 -54 L 34 -58 L 30 -48 Z"
              fill="currentColor" opacity="0.65"/>
      </g>

      <g transform="translate(730, 260)">
        <polygon points="0,0 12,-20 24,0 24,160 0,160" fill="url(#colGrad)"
                  stroke="currentColor" stroke-width="0.8" opacity="0.8"/>
        <line x1="12" y1="-18" x2="12" y2="160" stroke="currentColor" stroke-width="0.4" opacity="0.4"/>
      </g>

      <g transform="translate(70, 400)" opacity="0.7">
        <rect x="-2" y="-40" width="4" height="60" fill="currentColor"/>
        <path d="M 0 -40 Q -25 -50 -30 -65 Q -15 -55 -5 -45 Z" fill="currentColor"/>
        <path d="M 0 -40 Q 25 -50 30 -65 Q 15 -55 5 -45 Z"  fill="currentColor"/>
        <path d="M 0 -40 Q -15 -55 -10 -70 Q -5 -55 0 -45 Z" fill="currentColor"/>
        <path d="M 0 -40 Q 15 -55 10 -70 Q 5 -55 0 -45 Z"  fill="currentColor"/>
      </g>
      <g transform="translate(760, 410)" opacity="0.7">
        <rect x="-2" y="-35" width="4" height="50" fill="currentColor"/>
        <path d="M 0 -35 Q -22 -45 -27 -58 Q -13 -48 -5 -40 Z" fill="currentColor"/>
        <path d="M 0 -35 Q 22 -45 27 -58 Q 13 -48 5 -40 Z"  fill="currentColor"/>
        <path d="M 0 -35 Q -13 -48 -8 -62 Q -4 -48 0 -40 Z" fill="currentColor"/>
        <path d="M 0 -35 Q 13 -48 8 -62 Q 4 -48 0 -40 Z"  fill="currentColor"/>
      </g>

      <rect x="0" y="470" width="800" height="30" fill="rgba(0,0,0,0.08)"/>
    </svg>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .temple {
      width: 100%;
      height: auto;
      color: rgba(166, 130, 31, 0.85);
      filter: drop-shadow(0 4px 20px rgba(212, 145, 15, 0.15));
      animation: templeFloat 8s ease-in-out infinite;
    }
    .dark .temple {
      color: rgba(237, 196, 82, 0.85);
      filter: drop-shadow(0 4px 25px rgba(237, 196, 82, 0.25));
    }
    @keyframes templeFloat {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-6px); }
    }
  `],
})
export class TempleScene { }