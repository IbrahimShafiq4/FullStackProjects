import {
  Component, effect, ElementRef, inject, Signal, viewChild,
} from '@angular/core';
import { animate } from 'motion';
import { IPopupConfig, PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-dynamic-popup',
  template: `
    @if (_popup.config(); as config) {
      <div class="popup-backdrop" (click)="onCancel()" dir="rtl">
        <div #panel class="popup-panel" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          <div class="popup-head">
            <div class="popup-head__line">
              <span class="hw-serial">SYSTEM · ALERT</span>
              <div class="popup-head__leds" aria-hidden="true">
                <span class="hw-led"
                      [class.hw-led--warm]="config.type !== 'danger'"
                      [class.hw-led--err]="config.type === 'danger'"></span>
                <span class="hw-led"></span>
              </div>
            </div>
            <h3 class="popup-title">{{ config.title }}</h3>
          </div>

          <div class="popup-body">
            <p class="popup-message">{{ config.message }}</p>
          </div>

          <div class="popup-actions">
            <button class="hw-btn hw-btn--ghost popup-btn" (click)="onCancel()" type="button">
              {{ config.cancelLabel ?? 'إلغاء' }}
            </button>
            <button class="hw-btn popup-btn" type="button"
                    [class.hw-btn--danger]="config.type === 'danger'"
                    [class.hw-btn--primary]="config.type !== 'danger'"
                    (click)="onConfirm()">
              {{ config.confirmLabel ?? 'تأكيد' }}
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
      background: rgba(10,12,20,0.72);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 250;
      padding: 20px;
    }
    .popup-panel {
      width: 100%;
      max-width: 460px;
      background: var(--bg-panel);
      border: 2px solid var(--border-strong);
      box-shadow: inset 0 0 0 1px var(--border-hair), var(--shadow-deep);
      overflow: hidden;
    }
    .popup-head {
      padding: 14px 18px;
      background: rgba(0,0,0,0.25);
      border-bottom: 1px solid var(--border-hair);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    [data-theme="light"] .popup-head { background: rgba(139,122,90,0.08); }
    .popup-head__line {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .popup-head__leds { display: inline-flex; gap: 6px; }
    .popup-title {
      font-family: 'Aref Ruqaa', serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--fg-base);
      line-height: 1.1;
      text-align: right;
    }
    .popup-body {
      padding: 20px 18px;
      font-family: 'IBM Plex Sans Arabic', sans-serif;
      font-size: 14px;
      line-height: 1.8;
      color: var(--fg-soft);
    }
    .popup-message { text-align: right; }
    .popup-actions {
      display: flex;
      gap: 10px;
      padding: 14px 18px;
      background: rgba(0,0,0,0.2);
      border-top: 1px solid var(--border-hair);
      justify-content: flex-end;
      flex-wrap: wrap;
    }
    [data-theme="light"] .popup-actions { background: rgba(139,122,90,0.06); }
    .popup-btn { padding: 10px 18px; font-size: 13px; }
  `],
})
export class DynamicPopup {
  public _popup: PopupService = inject(PopupService);
  private panelRef: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const config: IPopupConfig | null = this._popup.config();
      const panel = this.panelRef()?.nativeElement;
      if (config && panel) {
        animate(panel, { scale: [0.94, 1], opacity: [0, 1] }, { type: 'spring', stiffness: 320, damping: 26 });
      }
    });
  }

  onConfirm(): void { this.animateOut(() => this._popup.respond(true)); }
  onCancel(): void { this.animateOut(() => this._popup.respond(false)); }

  private animateOut(onComplete: () => void): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return onComplete();
    animate(panel, { scale: [1, 0.94], opacity: [1, 0] }, { duration: 0.15 }).finished.then(onComplete);
  }
}