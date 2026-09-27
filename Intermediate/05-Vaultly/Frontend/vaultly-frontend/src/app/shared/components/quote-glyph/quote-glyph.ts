import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-quote-glyph',
  template: `
    <span class="quote-glyph">
      @switch (glyph()) {
        @case ('ankh') {
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <ellipse cx="12" cy="8" rx="4" ry="5"/>
            <path d="M12 13v8M8 17h8"/>
          </svg>
        }
        @case ('eye') {
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6Z"/>
            <circle cx="12" cy="12" r="2.5"/>
            <path d="M12 14.5V19M9 18h6"/>
          </svg>
        }
        @case ('scarab') {
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <ellipse cx="12" cy="13" rx="4.5" ry="6"/>
            <path d="M7.5 8 4 6M16.5 8 20 6M7.5 13H3M16.5 13H21M8.5 18 6 20M15.5 18 18 20"/>
            <circle cx="12" cy="6" r="2"/>
          </svg>
        }
        @case ('lotus') {
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M12 20c-4-3-6-6-6-9a6 6 0 0 1 12 0c0 3-2 6-6 9Z"/>
            <path d="M12 5v15"/>
          </svg>
        }
        @case ('feather') {
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M19 4c-4 0-9 3-12 6-2 2-3 5-3 7M19 4c1 6-3 12-9 14"/>
            <path d="M9 12h5M8 16h4"/>
          </svg>
        }
        @case ('sun') {
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>
          </svg>
        }
        @case ('wave') {
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M3 8c2 0 3 2 5 2s3-2 5-2 3 2 5 2 3-2 3-2"/>
            <path d="M3 14c2 0 3 2 5 2s3-2 5-2 3 2 5 2 3-2 3-2"/>
          </svg>
        }
        @case ('reed') {
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M12 3v18"/>
            <path d="M12 6c2-1 3-2 3-3M12 9c2-1 3-2 3-3M12 12c2-1 3-2 3-3"/>
          </svg>
        }
      }
    </span>
  `,
})
export class QuoteGlyph {
  glyph = input.required<string>();
}