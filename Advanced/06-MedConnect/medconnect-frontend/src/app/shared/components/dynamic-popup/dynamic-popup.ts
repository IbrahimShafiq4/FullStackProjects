import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { animate } from 'motion';

@Component({
  selector: 'app-dynamic-popup',
  templateUrl: './dynamic-popup.html',
  styleUrl: './dynamic-popup.css',
})
export class DynamicPopup {
  readonly _popup = inject(PopupService);
  private panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const c = this._popup.config();
      queueMicrotask(() => {
        const p = this.panelRef()?.nativeElement;
        if (c && p) {
          animate(p, { opacity: [0, 1], y: [10, 0] }, {
            type: 'spring',
            stiffness: 320,
            damping: 30,
          });
        }
      });
    });
  }

  confirm(): void { this.close(() => this._popup.respond(true)); }
  cancel(): void { this.close(() => this._popup.respond(false)); }

  private close(done: () => void): void {
    const p = this.panelRef()?.nativeElement;
    if (!p) { done(); return; }
    animate(p, { opacity: [1, 0], y: [0, 6] }, { duration: 0.14 }).finished.then(done);
  }
}