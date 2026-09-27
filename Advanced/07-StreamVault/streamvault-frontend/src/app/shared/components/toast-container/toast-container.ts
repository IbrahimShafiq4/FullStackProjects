import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [],
  template: `
        <div class="toast-stack">
            @for (toast of _ToastService.toasts(); track toast.id) {
                <div class="toast"
                     [class.toast-success]="toast.type === 'success'"
                     [class.toast-error]="toast.type === 'error'"
                     [class.toast-info]="toast.type === 'info'">

                    <div class="toast-corner toast-corner-tl"></div>
                    <div class="toast-corner toast-corner-tr"></div>
                    <div class="toast-corner toast-corner-bl"></div>
                    <div class="toast-corner toast-corner-br"></div>

                    <div class="toast-icon">
                        @if (toast.type === 'success') {
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="16" height="16">
                                <path d="M5 13l4 4L19 7"/>
                            </svg>
                        } @else if (toast.type === 'error') {
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="16" height="16">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        } @else {
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="16" height="16">
                                <circle cx="12" cy="12" r="9"/>
                                <path d="M12 8v4M12 16h.01"/>
                            </svg>
                        }
                    </div>

                    <span class="toast-message">{{ toast.message }}</span>

                    <button class="toast-close"
                            (click)="_ToastService.dismiss(toast.id)"
                            aria-label="إغلاق">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>

                    <div class="toast-progress"
                         [class.toast-progress-success]="toast.type === 'success'"
                         [class.toast-progress-error]="toast.type === 'error'"
                         [class.toast-progress-info]="toast.type === 'info'">
                    </div>
                </div>
            }
        </div>
    `,
  styles: [`

        :host {
            display: contents;
        }

        .toast-stack {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
            max-width: 90vw;
            width: 100%;
            align-items: center;
        }

        .toast {
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px 14px 16px;
            min-width: 280px;
            max-width: 440px;
            border-radius: var(--radius-md);
            background: linear-gradient(160deg, var(--board-soft) 0%, var(--board-deep) 100%);
            color: var(--chalk);
            box-shadow:
                inset 0 1px 0 rgba(244, 241, 234, 0.08),
                inset 0 -2px 0 rgba(0, 0, 0, 0.3),
                0 12px 32px rgba(0, 0, 0, 0.35),
                0 4px 12px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(244, 241, 234, 0.06);
            pointer-events: auto;
            animation: toast-in 350ms cubic-bezier(0.32, 0.72, 0, 1);
            overflow: hidden;
        }

        .toast::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
                radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.02) 0 1px, transparent 1px),
                radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.015) 0 1px, transparent 1px);
            background-size: 40px 40px, 60px 60px;
            pointer-events: none;
            opacity: 0.6;
        }

        @keyframes toast-in {
            0% {
                opacity: 0;
                transform: translateY(-20px) scale(0.92);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .toast-corner {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #d4a017 0%, #8b6a0f 60%, #5a4508 100%);
            box-shadow:
                inset 0 -1px 2px rgba(0, 0, 0, 0.5),
                0 1px 2px rgba(0, 0, 0, 0.4);
            z-index: 2;
        }

        .toast-corner-tl { top: 4px; left: 4px; }
        .toast-corner-tr { top: 4px; right: 4px; }
        .toast-corner-bl { bottom: 4px; left: 4px; }
        .toast-corner-br { bottom: 4px; right: 4px; }

        .toast-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
            box-shadow:
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                inset 0 2px 3px rgba(255, 255, 255, 0.15);
            animation: icon-pop 500ms cubic-bezier(0.32, 0.72, 0, 1) 100ms backwards;
        }

        @keyframes icon-pop {
            0% { transform: scale(0.3) rotate(-180deg); }
            60% { transform: scale(1.15) rotate(10deg); }
            100% { transform: scale(1) rotate(0deg); }
        }

        .toast-success .toast-icon {
            background: radial-gradient(circle at 35% 30%, #7fc88f 0%, #3d7a4a 60%, #1a4a2a 100%);
            color: #fff;
            box-shadow:
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 16px rgba(127, 200, 143, 0.5);
        }

        .toast-error .toast-icon {
            background: radial-gradient(circle at 35% 30%, #e09a9a 0%, #a83a3a 60%, #6a1a1a 100%);
            color: #fff;
            box-shadow:
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 16px rgba(224, 154, 154, 0.5);
        }

        .toast-info .toast-icon {
            background: radial-gradient(circle at 35% 30%, #f4e090 0%, #d4a017 60%, #8b6a0f 100%);
            color: #1a1208;
            box-shadow:
                inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                0 0 16px rgba(212, 160, 23, 0.5);
        }

        .toast-message {
            flex: 1;
            font-size: var(--text-sm);
            font-weight: 600;
            line-height: 1.5;
            letter-spacing: 0.3px;
            color: var(--chalk);
            text-shadow: 0 0 8px rgba(244, 241, 234, 0.15);
            position: relative;
            z-index: 1;
        }

        .toast-close {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: rgba(244, 241, 234, 0.06);
            color: rgba(244, 241, 234, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
            transition: all 200ms cubic-bezier(0.32, 0.72, 0, 1);
            flex-shrink: 0;
            position: relative;
            z-index: 1;
        }

        .toast-close:hover {
            background-color: rgba(244, 241, 234, 0.15);
            color: var(--chalk);
            transform: scale(1.1);
        }

        .toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent 0%, var(--accent) 100%);
            transform-origin: left;
            animation: progress-shrink 3.5s linear forwards;
            z-index: 3;
        }

        .toast-progress-success {
            background: linear-gradient(90deg, transparent 0%, #7fc88f 100%);
        }

        .toast-progress-error {
            background: linear-gradient(90deg, transparent 0%, #e09a9a 100%);
        }

        .toast-progress-info {
            background: linear-gradient(90deg, transparent 0%, #d4a017 100%);
        }

        @keyframes progress-shrink {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }


        @media (max-width: 640px) {
            .toast-stack {
                top: 16px;
                padding: 0 12px;
            }

            .toast {
                min-width: unset;
                width: 100%;
                max-width: 100%;
                padding: 12px 14px 12px 12px;
                gap: 10px;
            }

            .toast-icon {
                width: 28px;
                height: 28px;
            }

            .toast-message {
                font-size: var(--text-xs);
            }
        }


        @media (prefers-reduced-motion: reduce) {
            .toast,
            .toast-icon,
            .toast-progress {
                animation: none !important;
            }
        }
    `]
})
export class ToastContainer {
  public readonly _ToastService: ToastService = inject(ToastService);
}