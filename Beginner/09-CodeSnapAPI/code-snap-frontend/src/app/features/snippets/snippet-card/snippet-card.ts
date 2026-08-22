import { Component, inject, Input, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Clipboard } from '../../../shared/services/clipboard';
import { ISnippet } from '../../../core/services/snippets';
import { HighlightCode } from '../../../shared/directives/highligh-code';
import { RevealOnScroll } from '../../../shared/directives/reveal-on-scroll';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-snippet-card',
  imports: [RevealOnScroll, RouterLink, HighlightCode],
  templateUrl: './snippet-card.html',
  styleUrl: './snippet-card.scss',
})
export class SnippetCard {
  private Clipboard: Clipboard = inject(Clipboard);

  snippet:        InputSignal<ISnippet>       = input.required<ISnippet>();
  screenshotUrl:  InputSignal<string | null>  = input<string | null>(null);
  onDelete:       OutputEmitterRef<number>    = output<number>();

  copyCode() {
    this.Clipboard.copy(this.snippet().code);
  }
}
