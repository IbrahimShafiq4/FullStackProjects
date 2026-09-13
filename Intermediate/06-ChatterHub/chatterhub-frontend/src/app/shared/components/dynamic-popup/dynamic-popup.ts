import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { animate } from 'motion';
import { PopupService } from '../../services/popup.service';

@Component({
  imports: [],
  selector: 'app-dynamic-popup',
  styles: ``,
  templateUrl: './dynamic-popup.html',
})
export class DynamicPopup {
  popup = inject(PopupService);
  private panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const config = this.popup.config();
      const panel = this.panelRef()?.nativeElement;
      if (config && panel) {
        animate(panel, { scale: [0.85, 1], opacity: [0, 1], y: [20, 0] }, { type: 'spring', stiffness: 260, damping: 20 });
      }
    });
  }

  onConfirm() { this.animateOut(() => this.popup.respond(true)); }
  onCancel() { this.animateOut(() => this.popup.respond(false)); }

  private animateOut(onComplete: () => void) {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return onComplete();
    animate(panel, { scale: [1, 0.9], opacity: [1, 0] }, { duration: 0.2 }).finished.then(onComplete);
  }
}
