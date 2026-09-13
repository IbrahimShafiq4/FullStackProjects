import { Component, effect, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
    selector: 'app-dynamic-popup',
    template: `
    @if (_PopupService.config(); as config) {
    <div class="pop-backdrop" (click)="onCancel()">
      <div class="pop-panel" #panel (click)="$event.stopPropagation()">
        <div class="pop-head">
          <span class="pop-kicker">// {{ config.type === 'danger' ? 'warning' : 'confirm' }}</span>
          <h2 class="pop-title">{{ config.title }}</h2>
        </div>
        <p class="pop-msg">{{ config.message }}</p>
        <div class="pop-actions">
          <button class="pop-btn pop-btn-primary" [class.pop-btn-danger]="config.type === 'danger'" (click)="onConfirm()">
            {{ config.confirmLabel ?? 'تأكيد' }}
          </button>
          <button class="pop-btn pop-btn-ghost" (click)="onCancel()">
            {{ config.cancelLabel ?? 'إلغاء' }}
          </button>
        </div>
      </div>
    </div>
    }
  `,
    styles: `
    .pop-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(13,13,13,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    }

    .pop-panel {
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 28px;
      width: 100%;
      max-width: 440px;
      box-shadow: 8px 8px 0 var(--line);
    }

    .pop-head { margin-bottom: 16px; }

    .pop-kicker {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--blue);
      display: block;
      margin-bottom: 8px;
    }

    .pop-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 21px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0;
    }

    .pop-msg {
      font-size: 14.5px;
      line-height: 1.7;
      color: var(--muted);
      margin: 0 0 24px;
    }

    .pop-actions { display: flex; gap: 10px; }

    .pop-btn {
      flex: 1;
      padding: 11px 16px;
      border: 2px solid var(--line);
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      background: transparent;
      color: var(--ink);
    }

    .pop-btn-primary {
      background: var(--ink);
      color: var(--paper);
    }

    .pop-btn-primary:hover {
      background: var(--blue);
      border-color: var(--blue);
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    .pop-btn-danger {
      background: var(--red);
      border-color: var(--red);
      color: var(--paper);
    }

    .pop-btn-danger:hover {
      background: #b91c1c;
      border-color: #b91c1c;
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    .pop-btn-ghost:hover { background: var(--paper-2); }
  `
})
export class DynamicPopup {
    public _PopupService: PopupService = inject(PopupService);
    private panelRef: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('panel');

    constructor() {
        effect(() => {
            const config = this._PopupService.config();
            const panel = this.panelRef()?.nativeElement;
            if (config && panel) {
                panel.animate(
                    [
                        { transform: 'scale(0.9) translateY(16px)', opacity: 0 },
                        { transform: 'scale(1) translateY(0)', opacity: 1 }
                    ],
                    { duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
                );
            }
        });
    }

    onConfirm() { this._PopupService.respond(true); }
    onCancel() { this._PopupService.respond(false); }
}