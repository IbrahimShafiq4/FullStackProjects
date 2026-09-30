import { Component, effect, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { animate } from 'motion';

@Component({
  imports: [],
  selector: 'app-dynamic-popup',
  styleUrl: './dynamic-popup.css',
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
        animate(panel, {
          scale: [0.85, 1],
          opacity: [0, 1],
          y: [20, 0]
        },
          {
            type: 'spring',
            stiffness: 260,
            damping: 20
          })
      }
    })
  }

  onConfirm() {
    this.animateOut(() => this._PopupService.respond(true));
  }

  onCancel(): void {
    this.animateOut(() => this._PopupService.respond(false))
  }

  private animateOut(onComplete: () => void) {
    const panel = this.panelRef()?.nativeElement;
    if (panel) return onComplete();
    animate(panel, {
      scale: [1, 0.9],
      opacity: [1, 0]
    },
      { duration: 0.2 }).finished.then(onComplete);
  }
}
