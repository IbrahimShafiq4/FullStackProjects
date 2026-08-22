import { Directive, ElementRef, inject, input, effect } from '@angular/core';
import h1js from 'highlight.js/lib/core';
import csharp from 'highlight.js/lib/languages/csharp';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import sql from 'highlight.js/lib/languages/sql';

h1js.registerLanguage('csharp', csharp);
h1js.registerLanguage('javascript', javascript);
h1js.registerLanguage('typescript', typescript);
h1js.registerLanguage('python', python);
h1js.registerLanguage('xml', xml);
h1js.registerLanguage('css', css);
h1js.registerLanguage('sql', sql);

@Directive({
  selector: '[appHighlightCode]',
  standalone: true,
})
export class HighlightCode {

  private el = inject(ElementRef<HTMLElement>);

  code = input.required<string>();

  language = input<string>('csharp');

  constructor() {
    effect(() => {

      const code = this.code();
      const language = this.language().toLowerCase();

      const validLanguage = h1js.getLanguage(language)
        ? language
        : 'plaintext';

      const result = h1js.highlight(code, {
        language: validLanguage
      });

      this.el.nativeElement.innerHTML = result.value;
    });
  }
}