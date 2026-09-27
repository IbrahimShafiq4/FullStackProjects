import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    imports: [],
    template: `
        <button class="theme-toggle"
                (click)="_ThemeService.toggle()"
                [attr.aria-label]="_ThemeService.isDark() ? 'الوضع النهاري' : 'الوضع الليلي'"
                [attr.title]="_ThemeService.isDark() ? 'الوضع النهاري' : 'الوضع الليلي'">

            <span class="toggle-track">

                <span class="toggle-stars">
                    <span class="star star-1"></span>
                    <span class="star star-2"></span>
                    <span class="star star-3"></span>
                </span>

                <span class="toggle-clouds">
                    <span class="cloud cloud-1"></span>
                    <span class="cloud cloud-2"></span>
                </span>

                <span class="toggle-sun">
                    <span class="sun-core"></span>
                    <span class="sun-ray ray-1"></span>
                    <span class="sun-ray ray-2"></span>
                    <span class="sun-ray ray-3"></span>
                    <span class="sun-ray ray-4"></span>
                    <span class="sun-ray ray-5"></span>
                    <span class="sun-ray ray-6"></span>
                    <span class="sun-ray ray-7"></span>
                    <span class="sun-ray ray-8"></span>
                </span>

                <span class="toggle-moon">
                    <span class="moon-core"></span>
                    <span class="moon-crater crater-1"></span>
                    <span class="moon-crater crater-2"></span>
                    <span class="moon-crater crater-3"></span>
                </span>

                <span class="toggle-thumb"
                      [class.toggle-thumb-dark]="_ThemeService.isDark()">

                    @if (_ThemeService.isDark()) {
                        <svg class="thumb-icon thumb-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="12" height="12">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    } @else {
                        <svg class="thumb-icon thumb-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="12" height="12">
                            <circle cx="12" cy="12" r="4"/>
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                        </svg>
                    }
                </span>

                <span class="toggle-glow"
                      [class.toggle-glow-dark]="_ThemeService.isDark()">
                </span>

            </span>

        </button>
    `,
    styles: [`
        /* ===================================================
           Theme Toggle — Sun/Moon Scene
           =================================================== */

        :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .theme-toggle {
            padding: 0;
            background: none;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            transition: transform 200ms cubic-bezier(0.32, 0.72, 0, 1);
            -webkit-tap-highlight-color: transparent;
        }

        .theme-toggle:hover {
            transform: scale(1.04);
        }

        .theme-toggle:active {
            transform: scale(0.96);
        }

        .theme-toggle:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 3px;
        }

        /* ===================================================
           المسار الأساسي
           =================================================== */

        .toggle-track {
            position: relative;
            display: inline-flex;
            align-items: center;
            width: 68px;
            height: 34px;
            padding: 3px;
            border-radius: 999px;
            background: linear-gradient(180deg, #b8d8e8 0%, #88b8d0 100%);
            box-shadow:
                inset 0 2px 6px rgba(0, 0, 0, 0.15),
                inset 0 -1px 0 rgba(255, 255, 255, 0.4),
                0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition:
                background 600ms cubic-bezier(0.32, 0.72, 0, 1),
                box-shadow 600ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        :host-context(html.dark) .toggle-track {
            background: linear-gradient(180deg, #1a2530 0%, #0e1418 100%);
            box-shadow:
                inset 0 2px 6px rgba(0, 0, 0, 0.6),
                inset 0 -1px 0 rgba(255, 255, 255, 0.03),
                0 2px 8px rgba(0, 0, 0, 0.3);
        }

        /* ===================================================
           الشمس
           =================================================== */

        .toggle-sun {
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            pointer-events: none;
            opacity: 1;
            transition:
                opacity 400ms cubic-bezier(0.32, 0.72, 0, 1),
                transform 600ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        :host-context(html.dark) .toggle-sun {
            opacity: 0;
            transform: translateY(-50%) translateX(-20px) rotate(-90deg) scale(0.4);
        }

        .sun-core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: radial-gradient(circle at 35% 30%,
                #fff8d8 0%,
                #f4e090 40%,
                #d4a017 80%,
                #8b6a0f 100%);
            box-shadow:
                inset 0 -2px 3px rgba(139, 106, 15, 0.4),
                0 0 10px rgba(244, 224, 144, 0.6);
        }

        .sun-ray {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 3px;
            margin-left: -1px;
            margin-top: -12px;
            background: linear-gradient(180deg, #f4e090 0%, transparent 100%);
            border-radius: 1px;
            transform-origin: 1px 12px;
        }

        .ray-1 { transform: rotate(0deg); }
        .ray-2 { transform: rotate(45deg); }
        .ray-3 { transform: rotate(90deg); }
        .ray-4 { transform: rotate(135deg); }
        .ray-5 { transform: rotate(180deg); }
        .ray-6 { transform: rotate(225deg); }
        .ray-7 { transform: rotate(270deg); }
        .ray-8 { transform: rotate(315deg); }

        .sun-ray {
            animation: sun-ray-pulse 3s ease-in-out infinite;
        }

        @keyframes sun-ray-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }

        /* ===================================================
           القمر
           =================================================== */

        .toggle-moon {
            position: absolute;
            top: 50%;
            left: 8px;
            transform: translateY(-50%) translateX(20px) rotate(90deg) scale(0.4);
            width: 20px;
            height: 20px;
            pointer-events: none;
            opacity: 0;
            transition:
                opacity 400ms cubic-bezier(0.32, 0.72, 0, 1) 200ms,
                transform 600ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        :host-context(html.dark) .toggle-moon {
            opacity: 1;
            transform: translateY(-50%) translateX(0) rotate(0deg) scale(1);
        }

        .moon-core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: radial-gradient(circle at 35% 30%,
                #f4f1ea 0%,
                #d8d0b8 50%,
                #a89878 100%);
            box-shadow:
                inset 0 -2px 3px rgba(90, 80, 60, 0.5),
                0 0 10px rgba(244, 241, 234, 0.3);
        }

        .moon-crater {
            position: absolute;
            border-radius: 50%;
            background: rgba(120, 108, 84, 0.35);
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        .crater-1 {
            top: 6px;
            left: 6px;
            width: 4px;
            height: 4px;
        }

        .crater-2 {
            top: 10px;
            left: 12px;
            width: 3px;
            height: 3px;
        }

        .crater-3 {
            top: 13px;
            left: 7px;
            width: 2px;
            height: 2px;
        }

        /* ===================================================
           النجوم
           =================================================== */

        .toggle-stars {
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: 0;
            transition: opacity 500ms cubic-bezier(0.32, 0.72, 0, 1) 300ms;
        }

        :host-context(html.dark) .toggle-stars {
            opacity: 1;
        }

        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            background-color: #f4f1ea;
            box-shadow: 0 0 4px rgba(244, 241, 234, 0.8);
            animation: star-twinkle 2s ease-in-out infinite;
        }

        .star-1 {
            top: 8px;
            left: 22px;
            animation-delay: 0s;
        }

        .star-2 {
            top: 20px;
            left: 38px;
            animation-delay: 0.6s;
        }

        .star-3 {
            top: 12px;
            left: 48px;
            animation-delay: 1.2s;
        }

        @keyframes star-twinkle {
            0%, 100% { opacity: 0.4; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        /* ===================================================
           السحاب
           =================================================== */

        .toggle-clouds {
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: 1;
            transition: opacity 400ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        :host-context(html.dark) .toggle-clouds {
            opacity: 0;
        }

        .cloud {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 999px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        }

        .cloud::before,
        .cloud::after {
            content: '';
            position: absolute;
            background-color: inherit;
            border-radius: 50%;
        }

        .cloud-1 {
            top: 10px;
            left: 20px;
            width: 18px;
            height: 6px;
        }

        .cloud-1::before {
            top: -4px;
            left: 3px;
            width: 8px;
            height: 8px;
        }

        .cloud-1::after {
            top: -2px;
            right: 3px;
            width: 6px;
            height: 6px;
        }

        .cloud-2 {
            top: 18px;
            left: 34px;
            width: 12px;
            height: 4px;
        }

        .cloud-2::before {
            top: -3px;
            left: 2px;
            width: 6px;
            height: 6px;
        }

        /* ===================================================
           المقبض المتحرك
           =================================================== */

        .toggle-thumb {
            position: relative;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: radial-gradient(circle at 35% 30%,
                #fff8d8 0%,
                #f4e090 50%,
                #d4a017 100%);
            color: #5a4508;
            box-shadow:
                inset 0 -2px 4px rgba(139, 106, 15, 0.4),
                inset 0 2px 3px rgba(255, 255, 255, 0.5),
                0 2px 6px rgba(0, 0, 0, 0.2);
            transform: translateX(0);
            transition:
                transform 600ms cubic-bezier(0.32, 0.72, 0, 1),
                background 600ms cubic-bezier(0.32, 0.72, 0, 1),
                box-shadow 600ms cubic-bezier(0.32, 0.72, 0, 1);
            will-change: transform;
        }

        :host-context(html.dark) .toggle-thumb,
        .toggle-thumb-dark {
            transform: translateX(-34px);
            background: radial-gradient(circle at 35% 30%,
                #f4f1ea 0%,
                #d8d0b8 50%,
                #a89878 100%);
            color: #4a4030;
            box-shadow:
                inset 0 -2px 4px rgba(90, 80, 60, 0.5),
                inset 0 2px 3px rgba(255, 255, 255, 0.6),
                0 2px 6px rgba(0, 0, 0, 0.4);
        }

        .thumb-icon {
            display: block;
            transition: transform 600ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        .toggle-thumb-dark .thumb-icon {
            transform: rotate(-20deg);
        }

        /* ===================================================
           التوهج
           =================================================== */

        .toggle-glow {
            position: absolute;
            top: 50%;
            right: 6px;
            transform: translateY(-50%);
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: radial-gradient(circle,
                rgba(244, 224, 144, 0.6) 0%,
                transparent 70%);
            pointer-events: none;
            opacity: 0;
            animation: glow-pulse 3s ease-in-out infinite;
            transition: opacity 400ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        :host-context(html:not(.dark)) .toggle-glow {
            opacity: 1;
        }

        .toggle-glow-dark {
            left: 6px;
            right: auto;
            background: radial-gradient(circle,
                rgba(244, 241, 234, 0.3) 0%,
                transparent 70%);
        }

        @keyframes glow-pulse {
            0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.7; }
            50% { transform: translateY(-50%) scale(1.15); opacity: 1; }
        }

        /* ===================================================
           الاستجابة
           =================================================== */

        @media (max-width: 640px) {
            .toggle-track {
                width: 60px;
                height: 30px;
            }

            .toggle-thumb {
                width: 24px;
                height: 24px;
            }

            :host-context(html.dark) .toggle-thumb,
            .toggle-thumb-dark {
                transform: translateX(-30px);
            }
        }

        /* ===================================================
           احترام prefers-reduced-motion
           =================================================== */

        @media (prefers-reduced-motion: reduce) {
            .toggle-track,
            .toggle-sun,
            .toggle-moon,
            .toggle-thumb,
            .toggle-clouds,
            .toggle-stars,
            .toggle-glow {
                transition: none !important;
                animation: none !important;
            }
        }
    `]
})
export class ThemeToggle {
    public readonly _ThemeService: ThemeService = inject(ThemeService);
}