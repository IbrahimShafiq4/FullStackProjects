import { Component, effect, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { animate } from 'motion';
import { IPopupConfig, PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-dynamic-popup',
  styles: `
    .popup-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 10, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 250;
      padding: 20px;
    }

    .popup-panel {
      width: 100%;
      max-width: 440px;
      background: var(--surface);
      border: 3px solid var(--rule);
      overflow: hidden;
    }

    .popup-head {
      padding: 12px 16px;
      background: var(--ink);
      color: var(--paper);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      font-weight: 900;
    }

    .popup-close {
      background: transparent;
      border: 0;
      color: var(--paper);
      font-size: 14px;
      cursor: pointer;
      opacity: 0.7;
    }
    .popup-close:hover { opacity: 1; }

    .popup-body {
      padding: 20px;
      font-family: 'Amiri', serif;
      font-size: 16px;
      line-height: 1.7;
      color: var(--ink);
    }

    .popup-actions {
      display: flex;
      gap: 10px;
      padding: 12px 16px;
      background: var(--surface-2);
      border-top: 1px solid var(--rule-soft);
      justify-content: flex-end;
    }
  `,
  template: `
    @if (_PopupService.config(); as config) {
      <div class="popup-backdrop" (click)="onCancel()" dir="rtl">
        <div #panel class="popup-panel" (click)="$event.stopPropagation()">
          <div class="popup-head">
            <span>{{ config.title }}</span>
            <button class="popup-close" (click)="onCancel()">✕</button>
          </div>
          <div class="popup-body">{{ config.message }}</div>
          <div class="popup-actions">
            <button class="btn btn-ghost btn-sm" (click)="onCancel()">
              {{ config.cancelLabel ?? 'إلغاء' }}
            </button>
            <button class="btn btn-sm" [class.btn-danger]="config.type === 'danger'"
                    [class.btn-primary]="config.type !== 'danger'" (click)="onConfirm()">
              {{ config.confirmLabel ?? 'تأكيد' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class DynamicPopup {
  public _PopupService: PopupService = inject(PopupService);
  private panelRef: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const config: IPopupConfig | null = this._PopupService.config();
      const panel = this.panelRef()?.nativeElement;
      if (config && panel) {
        animate(panel, { scale: [0.94, 1], opacity: [0, 1] }, { type: 'spring', stiffness: 300, damping: 24 });
      }
    });
  }

  onConfirm() { this.animateOut(() => this._PopupService.respond(true)); }
  onCancel() { this.animateOut(() => this._PopupService.respond(false)); }

  private animateOut(onComplete: () => void) {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return onComplete();
    animate(panel, { scale: [1, 0.94], opacity: [1, 0] }, { duration: 0.15 }).finished.then(onComplete);
  }
}