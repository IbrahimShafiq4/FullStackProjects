import { Component, effect, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { animate } from 'motion';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-dynamic-popup',
  imports: [],
  template: `
        @if (_PopupService.config(); as config) {
            <div class="popup-backdrop" (click)="onCancel()">

                <div #panel class="popup-panel" (click)="$event.stopPropagation()">

                    <!-- إطار خشبي -->
                    <div class="popup-frame">

                        <!-- مسامير -->
                        <div class="popup-corner corner-tl"><div class="screw"></div></div>
                        <div class="popup-corner corner-tr"><div class="screw"></div></div>
                        <div class="popup-corner corner-bl"><div class="screw"></div></div>
                        <div class="popup-corner corner-br"><div class="screw"></div></div>

                        <!-- الديكور العلوي -->
                        <div class="popup-top-bar"></div>

                        <!-- الأيقونة -->
                        <div class="popup-icon-wrap">
                            @if (config.type === 'danger') {
                                <div class="popup-icon popup-icon-danger">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
                                        <path d="M12 9v4M12 17h.01"/>
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                    </svg>
                                </div>
                            } @else if (config.type === 'info') {
                                <div class="popup-icon popup-icon-info">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 16v-4M12 8h.01"/>
                                    </svg>
                                </div>
                            } @else {
                                <div class="popup-icon popup-icon-confirm">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                        <path d="M12 17h.01"/>
                                    </svg>
                                </div>
                            }
                        </div>

                        <!-- العنوان والرسالة -->
                        <h2 class="popup-title">{{ config.title }}</h2>
                        <p class="popup-message">{{ config.message }}</p>

                        <!-- الأزرار -->
                        <div class="popup-actions">
                            <button class="popup-btn popup-btn-cancel" (click)="onCancel()">
                                {{ config.cancelLabel ?? 'إلغاء' }}
                            </button>
                            <button class="popup-btn"
                                    [class.popup-btn-danger]="config.type === 'danger'"
                                    [class.popup-btn-primary]="config.type !== 'danger'"
                                    (click)="onConfirm()">
                                {{ config.confirmLabel ?? 'تأكيد' }}
                            </button>
                        </div>

                        <!-- شريط الطباشير السفلي -->
                        <div class="popup-chalk-tray">
                            <div class="chalk-piece piece-white"></div>
                            <div class="chalk-piece piece-yellow"></div>
                            <div class="chalk-piece piece-pink"></div>
                            <div class="eraser">
                                <div class="eraser-top"></div>
                                <div class="eraser-bottom"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    `,
  styles: [`

        :host {
            display: contents;
        }

        .popup-backdrop {
            position: fixed;
            inset: 0;
            background-color: rgba(19, 28, 24, 0.75);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9998;
            padding: 20px;
            animation: backdrop-fade 250ms ease-out;
        }

        @keyframes backdrop-fade {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .popup-panel {
            max-width: 460px;
            width: 100%;
            position: relative;
        }

        .popup-frame {
            position: relative;
            padding: 24px 24px 28px;
            background: linear-gradient(145deg, #8b5a2b 0%, #5f3d1c 50%, #3d2612 100%);
            border-radius: 8px;
            box-shadow:
                inset 0 2px 0 rgba(255, 255, 255, 0.15),
                inset 0 -3px 0 rgba(0, 0, 0, 0.4),
                0 30px 80px rgba(0, 0, 0, 0.6),
                0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .popup-frame::before {
            content: '';
            position: absolute;
            inset: 4px;
            border-radius: 6px;
            background-image:
                repeating-linear-gradient(90deg,
                    transparent 0 3px,
                    rgba(0, 0, 0, 0.06) 3px 4px);
            pointer-events: none;
            opacity: 0.5;
        }

        .popup-corner {
            position: absolute;
            width: 20px;
            height: 20px;
            z-index: 5;
            pointer-events: none;
        }

        .corner-tl { top: 8px; left: 8px; }
        .corner-tr { top: 8px; right: 8px; }
        .corner-bl { bottom: 8px; left: 8px; }
        .corner-br { bottom: 8px; right: 8px; }

        .screw {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #d4a017 0%, #8b6a0f 60%, #5a4508 100%);
            box-shadow:
                inset 0 -2px 3px rgba(0, 0, 0, 0.5),
                inset 0 2px 3px rgba(255, 255, 255, 0.2),
                0 2px 4px rgba(0, 0, 0, 0.5);
            position: relative;
        }

        .screw::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: 60%;
            height: 2px;
            background-color: rgba(0, 0, 0, 0.4);
            border-radius: 1px;
        }

        .popup-top-bar {
            height: 3px;
            margin-bottom: 20px;
            background: linear-gradient(90deg,
                transparent 0%,
                rgba(212, 160, 23, 0.6) 30%,
                rgba(212, 160, 23, 0.9) 50%,
                rgba(212, 160, 23, 0.6) 70%,
                transparent 100%);
            border-radius: 2px;
            position: relative;
            z-index: 1;
        }

        .popup-icon-wrap {
            display: flex;
            justify-content: center;
            margin-bottom: 16px;
            position: relative;
            z-index: 1;
        }

        .popup-icon {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            animation: icon-pop 500ms cubic-bezier(0.32, 0.72, 0, 1) 100ms backwards;
            box-shadow:
                inset 0 -4px 8px rgba(0, 0, 0, 0.3),
                inset 0 4px 6px rgba(255, 255, 255, 0.15);
        }

        @keyframes icon-pop {
            0% { transform: scale(0.3) rotate(-180deg); opacity: 0; }
            60% { transform: scale(1.15) rotate(10deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .popup-icon-confirm {
            background: radial-gradient(circle at 35% 30%, #f4e090 0%, #d4a017 60%, #8b6a0f 100%);
            color: #1a1208;
            box-shadow:
                inset 0 -4px 8px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(212, 160, 23, 0.4);
        }

        .popup-icon-danger {
            background: radial-gradient(circle at 35% 30%, #e09a9a 0%, #a83a3a 60%, #6a1a1a 100%);
            color: #fff;
            box-shadow:
                inset 0 -4px 8px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(168, 58, 58, 0.5);
        }

        .popup-icon-info {
            background: radial-gradient(circle at 35% 30%, #a8c8e0 0%, #3d5a80 60%, #1e3a5c 100%);
            color: #fff;
            box-shadow:
                inset 0 -4px 8px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(61, 90, 128, 0.5);
        }

        .popup-title {
            font-size: var(--text-xl);
            font-weight: 700;
            color: var(--chalk);
            text-align: center;
            margin-bottom: 12px;
            letter-spacing: 0.3px;
            text-shadow: 0 0 12px rgba(244, 241, 234, 0.2);
            position: relative;
            z-index: 1;
        }

        .popup-message {
            font-size: var(--text-base);
            line-height: 1.75;
            color: var(--chalk-dim);
            text-align: center;
            margin-bottom: 24px;
            position: relative;
            z-index: 1;
        }

        .popup-actions {
            display: flex;
            gap: 10px;
            position: relative;
            z-index: 1;
        }

        .popup-btn {
            flex: 1;
            padding: 12px 18px;
            border-radius: var(--radius);
            font-size: var(--text-base);
            font-weight: 700;
            cursor: pointer;
            transition: all 200ms cubic-bezier(0.32, 0.72, 0, 1);
            font-family: var(--font-ar);
            border: 1px solid transparent;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-height: 46px;
        }

        .popup-btn:active {
            transform: scale(0.97);
        }

        .popup-btn-cancel {
            background-color: transparent;
            border-color: rgba(244, 241, 234, 0.25);
            color: var(--chalk-dim);
        }

        .popup-btn-cancel:hover {
            background-color: rgba(244, 241, 234, 0.08);
            color: var(--chalk);
            border-color: rgba(244, 241, 234, 0.4);
        }

        .popup-btn-primary {
            background: linear-gradient(135deg, #d4a017 0%, #8b6a0f 100%);
            color: #1a1208;
            box-shadow:
                inset 0 -3px 6px rgba(0, 0, 0, 0.25),
                0 4px 12px rgba(212, 160, 23, 0.4);
        }

        .popup-btn-primary:hover {
            background: linear-gradient(135deg, #e8b530 0%, #a07818 100%);
            transform: translateY(-2px);
            box-shadow:
                inset 0 -3px 6px rgba(0, 0, 0, 0.25),
                0 8px 20px rgba(212, 160, 23, 0.6);
        }

        .popup-btn-danger {
            background: linear-gradient(135deg, #e09a9a 0%, #a83a3a 100%);
            color: #fff;
            box-shadow:
                inset 0 -3px 6px rgba(0, 0, 0, 0.25),
                0 4px 12px rgba(168, 58, 58, 0.4);
        }

        .popup-btn-danger:hover {
            background: linear-gradient(135deg, #e8a8a8 0%, #b84040 100%);
            transform: translateY(-2px);
            box-shadow:
                inset 0 -3px 6px rgba(0, 0, 0, 0.25),
                0 8px 20px rgba(168, 58, 58, 0.6);
        }

        .popup-chalk-tray {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 18px;
            padding: 0 16px;
            background: linear-gradient(180deg, #8b5a2b 0%, #5f3d1c 60%, #3d2612 100%);
            border-radius: 0 0 6px 6px;
            box-shadow:
                inset 0 2px 0 rgba(255, 255, 255, 0.15),
                inset 0 -3px 0 rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 4;
        }

        .chalk-piece {
            display: inline-block;
            width: 5px;
            height: 14px;
            border-radius: 2px;
            transform: translateY(-2px) rotate(-3deg);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .piece-white { background: linear-gradient(180deg, #f9f6ee 0%, #e8e3d2 100%); }
        .piece-yellow { background: linear-gradient(180deg, #f4e090 0%, #d4b060 100%); transform: translateY(-2px) rotate(3deg); }
        .piece-pink { background: linear-gradient(180deg, #f0c8d0 0%, #d098a8 100%); transform: translateY(-2px) rotate(-1deg); }

        .eraser {
            margin-inline-start: auto;
            width: 30px;
            height: 11px;
            position: relative;
            transform: translateY(-2px);
        }

        .eraser-top {
            width: 100%;
            height: 5px;
            background: linear-gradient(180deg, #f0e8d0 0%, #d4c9a8 100%);
            border-radius: 2px 2px 0 0;
        }

        .eraser-bottom {
            width: 100%;
            height: 6px;
            background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
            border-radius: 0 0 2px 2px;
        }


        @media (max-width: 640px) {
            .popup-backdrop {
                padding: 12px;
            }

            .popup-frame {
                padding: 20px 18px 24px;
            }

            .popup-icon {
                width: 60px;
                height: 60px;
            }

            .popup-title {
                font-size: var(--text-lg);
            }

            .popup-message {
                font-size: var(--text-sm);
            }

            .popup-btn {
                padding: 10px 14px;
                font-size: var(--text-sm);
                min-height: 42px;
            }

            .popup-actions {
                flex-direction: column-reverse;
            }

            .popup-corner {
                width: 16px;
                height: 16px;
            }
        }


        @media (prefers-reduced-motion: reduce) {
            .popup-backdrop,
            .popup-icon {
                animation: none !important;
            }
        }
    `]
})
export class DynamicPopup {
  public readonly _PopupService: PopupService = inject(PopupService);
  private readonly _PanelRef: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const config = this._PopupService.config();
      const panel = this._PanelRef()?.nativeElement;

      if (config && panel) {
        animate(panel,
          { scale: [0.85, 1], opacity: [0, 1], y: [24, 0] },
          { duration: 0.42, ease: [0.32, 0.72, 0, 1] }
        );
      }
    });
  }

  public onConfirm(): void {
    this._animateOut(() => this._PopupService.respond(true));
  }

  public onCancel(): void {
    this._animateOut(() => this._PopupService.respond(false));
  }

  private _animateOut(onComplete: () => void): void {
    const panel = this._PanelRef()?.nativeElement;
    if (!panel) return onComplete();

    animate(panel, { scale: [1, 0.92], opacity: [1, 0] }, { duration: 0.22, ease: [0.32, 0.72, 0, 1] })
      .finished.then(onComplete);
  }
}