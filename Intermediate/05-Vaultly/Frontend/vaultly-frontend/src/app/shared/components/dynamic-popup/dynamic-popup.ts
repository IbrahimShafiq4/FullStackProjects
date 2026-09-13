import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import gsap from 'gsap';
@Component({
  imports: [],
  selector: 'app-dynamic-popup',
  templateUrl: './dynamic-popup.html',
})
export class DynamicPopup {
  _PopupService: PopupService = inject(PopupService);
  private panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    this.gsapInitiator();
  }

  gsapInitiator(): void {
    effect(() => {
      const config = this._PopupService.config();
      const panel = this.panelRef()?.nativeElement;

      if (config && panel) {
        gsap.fromTo(
          panel,
          { scale: 0.85, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' }
        )
      }
    })
  }

  onConfirm(): void { this.animateOut(() => this._PopupService.respond(true));  }

  onCancel(): void  { this.animateOut(() => this._PopupService.respond(false)); }

  private animateOut(onComplete: () => void): void {
    const panel = this.panelRef()?.nativeElement;
    if(!panel) return onComplete();

    gsap.to(panel, {
      scale: 0.9,
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete,
    })
  }
}
