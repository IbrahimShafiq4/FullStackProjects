import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toast-layer">
      @for (toast of _ToastService.toasts(); track toast.id) {
      <div class="aero-toast" [class]="'aero-toast-' + toast.type">
        <div class="aero-toast-titlebar">
          <span class="aero-toast-title">{{ toast.type === 'success' ? 'نجاح' : toast.type === 'error' ? 'خطأ' : 'معلومة' }}</span>
          <button class="aero-toast-close" (click)="_ToastService.dismiss(toast.id)" type="button">✕</button>
        </div>

        <div class="aero-toast-body">
          <div class="aero-toast-icon">
            {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'i' }}
          </div>
          <p class="aero-toast-msg">{{ toast.message }}</p>
        </div>
      </div>
      }
    </div>
  `,
  styles: `
    .toast-layer {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
      direction: rtl;
    }

    .aero-toast {
      min-width: 320px;
      max-width: 460px;
      border-radius: 6px;
      overflow: hidden;
      pointer-events: auto;
      animation: aero-toast-in 0.35s cubic-bezier(0.2, 1.2, 0.4, 1);
      border: 1px solid var(--frame-border);
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.6),
        0 12px 40px rgba(0, 25, 60, 0.5),
        0 4px 12px rgba(0, 25, 60, 0.3),
        0 0 24px rgba(110, 180, 240, 0.3);
      backdrop-filter: blur(16px) saturate(1.5);
      -webkit-backdrop-filter: blur(16px) saturate(1.5);
    }

    .aero-toast-titlebar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 6px 5px 12px;
      background:
        linear-gradient(180deg,
          var(--title-1) 0%,
          var(--title-2) 44%,
          var(--title-3) 50%,
          var(--title-4) 100%);
      border-bottom: 1px solid rgba(90, 130, 180, 0.55);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .aero-toast-titlebar::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 4px;
      right: 4px;
      height: 48%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 4px 4px 50% 50% / 4px 4px 8px 8px;
      pointer-events: none;
    }

    .aero-toast-title {
      position: relative;
      z-index: 1;
      font-family: 'Cairo', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .aero-toast-close {
      position: relative;
      z-index: 1;
      width: 22px;
      height: 18px;
      border-radius: 3px;
      border: 1px solid #8b2a1e;
      background:
        linear-gradient(180deg,
          #ff9080 0%,
          #e86a58 45%,
          #cc4834 50%,
          #b83020 51%,
          #e05a48 100%);
      color: #ffffff;
      cursor: pointer;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.5),
        0 1px 2px rgba(0, 30, 70, 0.2);
      text-shadow: 0 1px 1px rgba(80, 0, 0, 0.5);
      transition: all 0.15s ease;
    }

    .aero-toast-close:hover {
      background:
        linear-gradient(180deg,
          #ffb0a0 0%,
          #f08070 45%,
          #d85040 50%,
          #c03020 51%,
          #e87060 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        0 0 8px rgba(255, 100, 80, 0.7);
    }

    .aero-toast-body {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      background:
        linear-gradient(180deg,
          rgba(250, 253, 255, 0.95) 0%,
          rgba(235, 244, 252, 0.95) 100%);
    }

    .aero-toast-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      flex-shrink: 0;
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow:
        inset 0 2px 4px rgba(255, 255, 255, 0.4),
        inset 0 -2px 4px rgba(0, 20, 50, 0.3),
        0 2px 6px rgba(0, 30, 70, 0.25);
    }

    .aero-toast-success .aero-toast-icon {
      background: radial-gradient(circle at 35% 25%, #8ee0a4 0%, #2a8f4a 100%);
    }

    .aero-toast-error .aero-toast-icon {
      background: radial-gradient(circle at 35% 25%, #ff9080 0%, #c94040 100%);
    }

    .aero-toast-info .aero-toast-icon {
      background: radial-gradient(circle at 35% 25%, #6cb8ff 0%, #1e6fd9 100%);
    }

    .aero-toast-msg {
      margin: 0;
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 600;
      color: #0a2949;
      line-height: 1.5;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
    }

    @keyframes aero-toast-in {
      from { opacity: 0; transform: translateY(-30px) scale(0.94); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (max-width: 640px) {
      .toast-layer {
        left: 12px;
        right: 12px;
        transform: none;
      }
      .aero-toast { min-width: auto; max-width: 100%; }
    }
  `
})
export class ToastContainer {
  public _ToastService: ToastService = inject(ToastService);
}