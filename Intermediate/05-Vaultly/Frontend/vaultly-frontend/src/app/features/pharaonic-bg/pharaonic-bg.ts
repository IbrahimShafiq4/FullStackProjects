import { Component } from '@angular/core';

@Component({
  selector: 'app-pharaonic-bg',
  standalone: true,
  template: `
    <div class="pharaonic-bg" aria-hidden="true">

      <svg class="aten" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f4dd8a" stop-opacity="0.9"/>
            <stop offset="60%" stop-color="#d4910f" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#a86d0a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="url(#sunGrad)"/>
        <circle cx="100" cy="100" r="30" fill="none" stroke="#d4910f" stroke-width="1.5" opacity="0.7"/>
        <circle cx="100" cy="100" r="18" fill="none" stroke="#d4910f" stroke-width="1" opacity="0.5"/>
        <g stroke="#d4910f" stroke-width="1.2" opacity="0.5">
          <line x1="100" y1="20" x2="100" y2="40"/>
          <line x1="100" y1="160" x2="100" y2="180"/>
          <line x1="20" y1="100" x2="40" y2="100"/>
          <line x1="160" y1="100" x2="180" y2="100"/>
          <line x1="43" y1="43" x2="57" y2="57"/>
          <line x1="143" y1="143" x2="157" y2="157"/>
          <line x1="43" y1="157" x2="57" y2="143"/>
          <line x1="143" y1="57" x2="157" y2="43"/>
        </g>
      </svg>

      <svg class="pyramids" viewBox="0 0 400 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="60,160 140,40 220,160" fill="rgba(120,80,40,0.15)"/>
        <polygon points="140,40 220,160 140,160" fill="rgba(80,55,25,0.10)"/>
        <polygon points="180,160 240,80 300,160" fill="rgba(120,80,40,0.12)"/>
        <polygon points="240,80 300,160 240,160" fill="rgba(80,55,25,0.08)"/>
        <polygon points="260,160 320,100 380,160" fill="rgba(120,80,40,0.10)"/>
      </svg>

      <svg class="pillar pillar-left" viewBox="0 0 80 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="80" height="20" fill="rgba(166,130,31,0.25)"/>
        <rect x="10" y="20" width="60" height="360" fill="rgba(166,130,31,0.08)"/>
        <rect x="0" y="380" width="80" height="20" fill="rgba(166,130,31,0.25)"/>
        <line x1="20" y1="20" x2="20" y2="380" stroke="rgba(166,130,31,0.2)" stroke-width="1"/>
        <line x1="40" y1="20" x2="40" y2="380" stroke="rgba(166,130,31,0.15)" stroke-width="1"/>
        <line x1="60" y1="20" x2="60" y2="380" stroke="rgba(166,130,31,0.2)" stroke-width="1"/>
      </svg>
      <svg class="pillar pillar-right" viewBox="0 0 80 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="80" height="20" fill="rgba(166,130,31,0.25)"/>
        <rect x="10" y="20" width="60" height="360" fill="rgba(166,130,31,0.08)"/>
        <rect x="0" y="380" width="80" height="20" fill="rgba(166,130,31,0.25)"/>
        <line x1="20" y1="20" x2="20" y2="380" stroke="rgba(166,130,31,0.2)" stroke-width="1"/>
        <line x1="40" y1="20" x2="40" y2="380" stroke="rgba(166,130,31,0.15)" stroke-width="1"/>
        <line x1="60" y1="20" x2="60" y2="380" stroke="rgba(166,130,31,0.2)" stroke-width="1"/>
      </svg>

      <div class="sand-layer sand-1"></div>
      <div class="sand-layer sand-2"></div>
      <div class="sand-layer sand-3"></div>
    </div>
  `,
  styles: [`
    .pharaonic-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .aten {
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      width: 420px;
      height: 420px;
      opacity: 0.55;
      animation: sunPulse 6s ease-in-out infinite;
    }
    .dark .aten { opacity: 0.35; }

    .pyramids {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 220px;
      opacity: 0.7;
    }
    .dark .pyramids { opacity: 0.4; }

    .pillar {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 80px;
      height: 100%;
      opacity: 0.5;
    }
    .pillar-left  { left: 0; }
    .pillar-right { right: 0; }
    .dark .pillar { opacity: 0.25; }

    .sand-layer {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle, rgba(212,145,15,0.35) 0.5px, transparent 1.2px),
        radial-gradient(circle, rgba(212,145,15,0.25) 0.5px, transparent 1.2px);
      background-size: 60px 60px, 90px 90px;
      background-position: 0 0, 30px 30px;
      animation: sandDrift 14s ease-in-out infinite;
    }
    .sand-2 { animation-duration: 20s; animation-delay: -4s; opacity: 0.6; }
    .sand-3 { animation-duration: 26s; animation-delay: -8s; opacity: 0.4; }

    @media (max-width: 768px) {
      .pillar { width: 40px; }
      .aten { width: 260px; height: 260px; top: -40px; }
    }
  `],
})
export class PharaonicBg { }