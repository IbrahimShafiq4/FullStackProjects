import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-hieroglyph-strip',
  standalone: true,
  template: `
    <div class="hiero-wrap" [class.reverse]="reverse()">
      <div class="hiero-track">{{ repeatedGlyphs() }}</div>
      <div class="hiero-track" aria-hidden="true">{{ repeatedGlyphs() }}</div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .hiero-wrap {
      overflow: hidden;
      display: flex;
      gap: 2rem;
      opacity: 0.45;
      mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent);
    }

    .hiero-track {
      font-family: 'Hieroglyph', 'Shafrah', serif;
      font-size: 1.5rem;
      letter-spacing: 0.5em;
      white-space: nowrap;
      color: rgba(212, 145, 15, 0.7);
      animation: hiero-scroll 60s linear infinite;
      will-change: transform;
      user-select: none;
    }

    .hiero-wrap.reverse .hiero-track {
      animation-direction: reverse;
    }

    .dark .hiero-track {
      color: rgba(212, 145, 15, 0.55);
    }

    @keyframes hiero-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-100%); }
    }

    @media (prefers-reduced-motion: reduce) {
      .hiero-track { animation: none; }
    }
  `],
})
export class HieroglyphStrip {
  readonly glyphs = input<string>(
    '𓂀 𓁹 𓆣 𓆼 𓇳 𓊹 𓋹 𓌀 𓃀 𓅓 𓆑 𓈖 𓉔 𓊪 𓎼 𓏏 𓐍 𓂧'
  );
  readonly repeat = input<number>(3);
  readonly reverse = input<boolean>(false);

  protected readonly repeatedGlyphs = computed(() =>
    this.glyphs().repeat(this.repeat())
  );
}