import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-time-travel-bg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tt-bg" aria-hidden="true">

      <svg class="celestial sun" viewBox="0 0 300 300">
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stop-color="rgba(244,221,138,0.95)"/>
            <stop offset="45%" stop-color="rgba(212,145,15,0.55)"/>
            <stop offset="100%" stop-color="rgba(212,145,15,0)"/>
          </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="140" fill="url(#sunGrad)"/>
        <g stroke="#a86d0a" stroke-width="1" fill="none" opacity="0.55">
          @for (r of rays; track r) {
            <line x1="150" y1="150"
                  [attr.x2]="150 + 130 * cos(r)"
                  [attr.y2]="150 + 130 * sin(r)"/>
          }
        </g>
        <circle cx="150" cy="150" r="32" fill="none" stroke="#a86d0a" stroke-width="1.6"/>
        <circle cx="150" cy="150" r="18" fill="none" stroke="#a86d0a" stroke-width="1"/>
      </svg>

      <svg class="celestial moon" viewBox="0 0 300 300">
        <defs>
          <radialGradient id="moonGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stop-color="rgba(244,221,138,0.85)"/>
            <stop offset="50%" stop-color="rgba(237,196,82,0.35)"/>
            <stop offset="100%" stop-color="rgba(237,196,82,0)"/>
          </radialGradient>
          <radialGradient id="moonBody" cx="40%" cy="40%" r="60%">
            <stop offset="0%"  stop-color="#faf0c4"/>
            <stop offset="100%" stop-color="#edc452"/>
          </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="140" fill="url(#moonGrad)"/>
        <path d="M 190 80 A 80 80 0 1 0 190 220 A 65 65 0 1 1 190 80 Z"
              fill="url(#moonBody)" opacity="0.85"/>
        <circle cx="180" cy="120" r="6" fill="rgba(120,80,40,0.15)"/>
        <circle cx="195" cy="150" r="4" fill="rgba(120,80,40,0.12)"/>
        <circle cx="178" cy="175" r="5" fill="rgba(120,80,40,0.14)"/>
      </svg>

      <svg class="pyramids-far" viewBox="0 0 1200 300" preserveAspectRatio="none">
        <polygon points="200,300 340,80 480,300" fill="rgba(120,80,40,0.18)"/>
        <polygon points="340,80 480,300 340,300" fill="rgba(80,55,25,0.15)"/>
        <polygon points="500,300 620,140 740,300" fill="rgba(120,80,40,0.15)"/>
        <polygon points="780,300 900,120 1020,300" fill="rgba(120,80,40,0.18)"/>
      </svg>

      <div class="columns-mid">
        @for (i of [1,2,3,4,5,6,7,8]; track i) {
          <div class="col"></div>
        }
      </div>

      <div class="flying-hiero">
        @for (g of flyingGlyphs; track $index) {
          <span class="fg"
                [style.animation-delay]="($index * -3) + 's'"
                [style.left]="(($index * 13) % 100) + '%'">{{ g }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: contents; }

    .tt-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .celestial {
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      transition: opacity 0.9s ease, transform 0.9s ease;
      will-change: opacity, transform;
    }

    .sun  { opacity: 0.75; color: #a86d0a; }
    .moon { opacity: 0; transform: translateX(-50%) translateY(-60px) scale(0.7); color: #edc452; }

    .dark .sun  {
      opacity: 0;
      transform: translateX(-50%) translateY(60px) scale(0.7);
    }
    .dark .moon {
      opacity: 0.85;
      transform: translateX(-50%) translateY(0) scale(1);
      animation: moonPulse 6s ease-in-out infinite;
    }

    @keyframes moonPulse {
      0%, 100% { filter: drop-shadow(0 0 15px rgba(237,196,82,0.4)); }
      50%      { filter: drop-shadow(0 0 40px rgba(237,196,82,0.8)); }
    }

    .pyramids-far {
      position: absolute;
      bottom: 0;
      left: -5%;
      width: 110%;
      height: 40%;
      opacity: 0.9;
      animation: pyramidDrift 60s ease-in-out infinite alternate;
    }
    @keyframes pyramidDrift {
      0%   { transform: translateX(-3%) scale(1); }
      100% { transform: translateX(3%) scale(1.03); }
    }

    .columns-mid {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 35%;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      opacity: 0.5;
      pointer-events: none;
      animation: columnsPan 40s linear infinite alternate;
    }
    @keyframes columnsPan {
      0%   { transform: translateX(-2%); }
      100% { transform: translateX(2%); }
    }

    .col {
      width: 40px;
      height: 100%;
      background: linear-gradient(to bottom,
        transparent 0%,
        rgba(120,80,40,0.30) 30%,
        rgba(80,55,25,0.45) 100%);
      border-top: 3px solid rgba(166,130,31,0.4);
    }
    .dark .col {
      background: linear-gradient(to bottom,
        transparent 0%,
        rgba(212,145,15,0.10) 30%,
        rgba(212,145,15,0.22) 100%);
      border-top-color: rgba(237,196,82,0.35);
    }

    .flying-hiero { position: absolute; inset: 0; }
    .fg {
      position: absolute;
      top: 100%;
      font-family: 'Hieroglyph', serif;
      font-size: 1.4rem;
      color: var(--hiero-color);
      animation: floatUp 25s linear infinite;
      opacity: 0;
    }
    @keyframes floatUp {
      0%   { top: 100%; opacity: 0; transform: translateX(0) rotate(0deg); }
      10%  { opacity: 0.7; }
      90%  { opacity: 0.7; }
      100% { top: -10%; opacity: 0; transform: translateX(40px) rotate(15deg); }
    }

    @media (max-width: 768px) {
      .celestial { width: 300px; height: 300px; top: -40px; }
      .col { width: 24px; }
    }
  `],
})
export class TimeTravelBg {
  protected readonly rays = [0, 45, 90, 135, 180, 225, 270, 315];
  protected readonly flyingGlyphs = ['𓂀', '𓆣', '𓋹', '𓇳', '𓊹', '𓆼', '𓃀', '𓅓', '𓆑'];

  protected cos(deg: number): number { return Math.cos((deg * Math.PI) / 180); }
  protected sin(deg: number): number { return Math.sin((deg * Math.PI) / 180); }
}