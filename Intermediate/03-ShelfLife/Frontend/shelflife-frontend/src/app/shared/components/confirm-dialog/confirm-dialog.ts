import { Component, inject, HostListener } from '@angular/core';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (service.active(); as options) {
    <div class="cd-backdrop" (click)="service.cancel()">
      <div class="cd-dialog" [class]="'cd-dialog-' + options.tone" (click)="$event.stopPropagation()">
        <div class="cd-corner"></div>

        <div class="cd-head">
          <div class="cd-head-icon">
            {{ options.tone === 'danger' ? '!' : options.tone === 'olive' ? '?' : 'i' }}
          </div>
          <h2 class="cd-title">{{ options.title }}</h2>
        </div>

        <p class="cd-message">{{ options.message }}</p>

        <div class="cd-actions">
          <button class="cd-btn cd-btn-cancel" type="button" (click)="service.cancel()">
            <span>✕</span>
            <span>{{ options.cancelText }}</span>
          </button>

          <button
            class="cd-btn cd-btn-confirm"
            [class.cd-btn-danger]="options.tone === 'danger'"
            [class.cd-btn-olive]="options.tone === 'olive'"
            type="button"
            (click)="service.confirm()">
            <span>✓</span>
            <span>{{ options.confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: `
    .cd-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9998;
      background: rgba(26, 28, 20, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      direction: rtl;
      animation: cd-fade-in 0.15s steps(3);
    }

    @keyframes cd-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .cd-dialog {
      position: relative;
      width: 100%;
      max-width: 420px;
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 8px 8px 0 var(--ink);
      padding: 20px 20px 18px;
      animation: cd-slide-in 0.2s steps(4);
    }

    @keyframes cd-slide-in {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cd-corner {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 14px;
      height: 14px;
      background: var(--orange);
      border: 3px solid var(--ink);
    }

    .cd-dialog-danger .cd-corner { background: var(--danger); }
    .cd-dialog-olive .cd-corner { background: var(--olive); }

    .cd-head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 3px dashed var(--ink);
    }

    .cd-head-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 26px;
      line-height: 1;
      font-weight: 700;
      color: var(--surface);
      background: var(--orange);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      flex-shrink: 0;
    }

    .cd-dialog-danger .cd-head-icon { background: var(--danger); }
    .cd-dialog-olive .cd-head-icon { background: var(--olive); }

    .cd-title {
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      color: var(--ink);
      margin: 0;
      line-height: 1.2;
    }

    .cd-message {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      line-height: 1.75;
      color: var(--ink-2);
      margin: 0 0 18px;
      text-align: start;
    }

    .cd-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .cd-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 14px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--ink);
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .cd-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .cd-btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .cd-btn-confirm {
      background: var(--olive);
      color: var(--surface);
    }

    .cd-btn-confirm:hover {
      background: var(--olive-2);
    }

    .cd-btn-danger {
      background: var(--danger);
      color: var(--surface);
    }

    .cd-btn-danger:hover {
      background: #8a2f24;
    }

    .cd-btn-olive {
      background: var(--olive);
      color: var(--surface);
    }

    .cd-btn-olive:hover {
      background: var(--olive-2);
    }

    .cd-btn-cancel {
      background: var(--surface-2);
      color: var(--ink-2);
    }

    @media (max-width: 480px) {
      .cd-dialog {
        padding: 16px 16px 14px;
        box-shadow: 6px 6px 0 var(--ink);
      }
      .cd-title { font-size: 18px; }
      .cd-message { font-size: 14px; }
      .cd-actions { grid-template-columns: 1fr; }
    }
  `
})
export class ConfirmDialog {
  public service = inject(ConfirmService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.service.active()) {
      this.service.cancel();
    }
  }

  @HostListener('document:keydown.enter')
  onEnter(): void {
    if (this.service.active()) {
      this.service.confirm();
    }
  }
}