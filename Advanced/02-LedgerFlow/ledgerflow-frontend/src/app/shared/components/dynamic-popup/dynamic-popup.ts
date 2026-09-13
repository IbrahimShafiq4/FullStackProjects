import { Component, effect, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import gsap from 'gsap';

@Component({
  imports: [],
  selector: 'app-dynamic-popup',
  templateUrl: './dynamic-popup.html',
})
export class DynamicPopup {
  public _PopupService: PopupService = inject(PopupService);
  private panelRef: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const config = this._PopupService.config();
      const panel = this.panelRef()?.nativeElement;
      if (config && panel) {
        gsap.fromTo(panel,
          { scale: 0.92, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      }
    });
  }

  onConfirm() { this.animateOut(() => this._PopupService.respond(true)); }
  onCancel() { this.animateOut(() => this._PopupService.respond(false)); }

  private animateOut(onComplete: () => void) {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return onComplete();
    gsap.to(panel, {
      scale: 0.95,
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete
    });
  }
}