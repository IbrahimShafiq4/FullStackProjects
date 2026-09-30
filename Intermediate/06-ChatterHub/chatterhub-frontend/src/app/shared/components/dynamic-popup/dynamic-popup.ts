import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { animate } from 'motion';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-dynamic-popup',
  standalone: true,
  template: `
    @if (popup.config(); as config) {
      <div class="popup-backdrop" (click)="onCancel()">
        <div #panel class="popup" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          <div class="popup__icon" [class.popup__icon--danger]="config.type === 'danger'">
            {{ config.type === 'danger' ? '!' : '?' }}
          </div>

          <h2 class="popup__title">{{ config.title }}</h2>
          <p class="popup__message">{{ config.message }}</p>

          <div class="popup__actions">
            <button type="button" class="btn btn--ghost" (click)="onCancel()">
              {{ config.cancelLabel ?? 'Cancel' }}
            </button>
            <button
              type="button"
              class="btn"
              [class.btn--danger]="config.type === 'danger'"
              [class.btn--primary]="config.type !== 'danger'"
              (click)="onConfirm()">
              {{ config.confirmLabel ?? 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .popup-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(20, 24, 28, 0.45);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 180;
      padding: 24px;
      animation: fade-in 200ms ease both;
    }
    .popup {
      background: var(--surface);
      padding: 32px 28px 24px;
      max-width: 400px;
      width: 100%;
      border-radius: var(--r-xl);
      box-shadow: var(--shadow-lg);
      text-align: center;
    }
    .popup__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--teal-soft);
      color: var(--teal-dark);
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .popup__icon--danger {
      background: var(--red-soft);
      color: var(--red);
    }
    .popup__title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--ink);
      margin-bottom: 8px;
    }
    .popup__message {
      font-size: 14px;
      line-height: 1.55;
      color: var(--muted);
      margin-bottom: 28px;
    }
    .popup__actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .popup__actions .btn { flex: 1; }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  `],
})
export class DynamicPopup {
  popup = inject(PopupService);
  private panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const config = this.popup.config();
      const panel = this.panelRef()?.nativeElement;
      if (config && panel) {
        animate(panel, { scale: [0.9, 1], opacity: [0, 1], y: [12, 0] },
          { type: 'spring', stiffness: 300, damping: 26 });
      }
    });
  }

  onConfirm(): void { this.animateOut(() => this.popup.respond(true)); }
  onCancel(): void { this.animateOut(() => this.popup.respond(false)); }

  private animateOut(onComplete: () => void): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) { onComplete(); return; }
    animate(panel, { scale: [1, 0.94], opacity: [1, 0] }, { duration: 0.18 })
      .finished.then(onComplete);
  }
}