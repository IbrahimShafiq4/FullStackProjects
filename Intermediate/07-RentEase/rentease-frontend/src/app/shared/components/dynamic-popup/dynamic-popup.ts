import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { animate } from 'motion';

@Component({
  selector: 'app-dynamic-popup',
  templateUrl: './dynamic-popup.html',
})
export class DynamicPopup {
  public _PopupService: PopupService = inject(PopupService);
  private panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const config = this._PopupService.config();
      const panel = this.panelRef()?.nativeElement;
      if (config && panel) {
        animate(panel,
          { opacity: [0, 1], y: [12, 0], scale: [0.98, 1] },
          { duration: 0.18, ease: [0.16, 1, 0.3, 1] });
      }
    });
  }

  onConfirm(): void { this.animateOut(() => this._PopupService.respond(true)); }
  onCancel(): void  { this.animateOut(() => this._PopupService.respond(false)); }

  private animateOut(done: () => void): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return done();
    animate(panel, { opacity: [1, 0], scale: [1, 0.98] }, { duration: 0.14 }).finished.then(done);
  }
}