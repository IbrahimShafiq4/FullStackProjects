import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
        <div class="nf-screen">

            <!-- السماء -->
            <div class="nf-sky">
                <div class="nf-cloud cloud-1"><span></span><span></span><span></span></div>
                <div class="nf-cloud cloud-2"><span></span><span></span></div>
                <div class="nf-cloud cloud-3"><span></span><span></span><span></span></div>
                <div class="nf-sun"></div>
                <div class="nf-bird bird-1"><span></span><span></span></div>
                <div class="nf-bird bird-2"><span></span><span></span></div>
            </div>

            <!-- السبورة الكبيرة -->
            <div class="nf-board-wrap">
                <div class="nf-board-frame">
                    <div class="nf-board-surface">

                        <!-- مسامير -->
                        <div class="nf-corner corner-tl"><div class="screw"></div></div>
                        <div class="nf-corner corner-tr"><div class="screw"></div></div>
                        <div class="nf-corner corner-bl"><div class="screw"></div></div>
                        <div class="nf-corner corner-br"><div class="screw"></div></div>

                        <!-- نقوش الطباشير -->
                        <div class="chalk-scribble scribble-1"></div>
                        <div class="chalk-scribble scribble-2"></div>
                        <div class="chalk-scribble scribble-3"></div>

                        <!-- المحتوى -->
                        <div class="nf-content">

                            <div class="nf-eyebrow-wrap">
                                <span class="nf-chalk-line"></span>
                                <span class="nf-eyebrow">الصفحة اللي بتدور عليها</span>
                                <span class="nf-chalk-line"></span>
                            </div>

                            <div class="nf-number">
                                <span class="digit digit-4">٤</span>
                                <span class="digit digit-0">٠</span>
                                <span class="digit digit-4">٤</span>
                            </div>

                            <div class="nf-chalk-divider"></div>

                            <h1 class="nf-title">الفصل ده مش موجود</h1>

                            <p class="nf-text">
                                يبدو إن الباب اللي فتحته مش بيوصل لحاجة.
                                <br>
                                ارجع للرواق الرئيسي واختار فصل تاني.
                            </p>

                            <div class="nf-actions">
                                <a routerLink="/" class="nf-btn nf-btn-primary">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                        <path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>
                                    </svg>
                                    <span>الصفحة الرئيسية</span>
                                </a>
                                <a routerLink="/school" class="nf-btn nf-btn-ghost">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                        <path d="M3 21V9l9-6 9 6v12"/>
                                        <path d="M9 21v-6h6v6"/>
                                    </svg>
                                    <span>المدرسة</span>
                                </a>
                            </div>
                        </div>

                        <!-- شريط الطباشير السفلي -->
                        <div class="nf-chalk-tray">
                            <div class="chalk-piece piece-white"></div>
                            <div class="chalk-piece piece-yellow"></div>
                            <div class="chalk-piece piece-pink"></div>
                            <div class="chalk-piece piece-green"></div>
                            <div class="eraser">
                                <div class="eraser-top"></div>
                                <div class="eraser-bottom"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- العشب والزهور -->
            <div class="nf-ground">
                <svg class="nf-grass-svg" viewBox="0 0 1200 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="nf-grass-1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#7ba862" />
                            <stop offset="100%" stop-color="#3d5a30" />
                        </linearGradient>
                    </defs>
                    <path d="M0,60 Q60,40 120,55 T240,50 T360,58 T480,50 T600,56 T720,52 T840,58 T960,50 T1080,55 T1200,52 L1200,100 L0,100 Z"
                          fill="url(#nf-grass-1)" />
                </svg>

                <div class="nf-flower flower-1">
                    <div class="petals"><span></span><span></span><span></span><span></span></div>
                    <div class="center"></div>
                    <div class="stem"></div>
                </div>
                <div class="nf-flower flower-2">
                    <div class="petals"><span></span><span></span><span></span><span></span></div>
                    <div class="center"></div>
                    <div class="stem"></div>
                </div>
                <div class="nf-flower flower-3">
                    <div class="petals"><span></span><span></span><span></span><span></span></div>
                    <div class="center"></div>
                    <div class="stem"></div>
                </div>
                <div class="nf-flower flower-4">
                    <div class="petals"><span></span><span></span><span></span><span></span></div>
                    <div class="center"></div>
                    <div class="stem"></div>
                </div>

                <div class="grass-tuft tuft-1"></div>
                <div class="grass-tuft tuft-2"></div>
                <div class="grass-tuft tuft-3"></div>
                <div class="grass-tuft tuft-4"></div>
            </div>

            <!-- الأشجار -->
            <div class="nf-tree tree-left">
                <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="nf-trunk" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#8b5a2b" />
                            <stop offset="100%" stop-color="#3d2612" />
                        </linearGradient>
                        <radialGradient id="nf-leaf" cx="40%" cy="30%" r="60%">
                            <stop offset="0%" stop-color="#5a8a3a" />
                            <stop offset="60%" stop-color="#3d6b28" />
                            <stop offset="100%" stop-color="#2a5018" />
                        </radialGradient>
                    </defs>
                    <rect x="46" y="140" width="8" height="55" fill="url(#nf-trunk)" rx="2" />
                    <ellipse cx="50" cy="100" rx="45" ry="60" fill="url(#nf-leaf)" />
                    <ellipse cx="30" cy="80" rx="25" ry="30" fill="#4a7a2a" opacity="0.5" />
                </svg>
            </div>

            <div class="nf-tree tree-right">
                <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                    <rect x="46" y="140" width="8" height="55" fill="url(#nf-trunk)" rx="2" />
                    <ellipse cx="50" cy="100" rx="42" ry="55" fill="url(#nf-leaf)" />
                    <ellipse cx="68" cy="90" rx="20" ry="24" fill="#2a5018" opacity="0.5" />
                </svg>
            </div>

            <div class="nf-tree tree-center-left">
                <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                    <rect x="46" y="140" width="8" height="55" fill="url(#nf-trunk)" rx="2" />
                    <ellipse cx="50" cy="100" rx="38" ry="52" fill="url(#nf-leaf)" />
                </svg>
            </div>

            <div class="nf-tree tree-center-right">
                <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                    <rect x="46" y="140" width="8" height="55" fill="url(#nf-trunk)" rx="2" />
                    <ellipse cx="50" cy="100" rx="36" ry="48" fill="url(#nf-leaf)" />
                </svg>
            </div>

        </div>
    `,
  styles: [`

        :host {
            display: block;
        }

        .nf-screen {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 40px 24px;
            background: linear-gradient(180deg, #b8d8e8 0%, #e8f0f5 50%, #7ba862 100%);
            transition: background 600ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        :host-context(html.dark) .nf-screen {
            background: linear-gradient(180deg, #0a1a2a 0%, #1a2a3a 50%, #1a2a18 100%);
        }

        .nf-sky {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
        }

        .nf-sun {
            position: absolute;
            top: 60px;
            right: 80px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: radial-gradient(circle at 40% 40%, #fff8d8 0%, #f4e090 40%, #d4a017 80%);
            box-shadow: 0 0 80px rgba(244, 224, 144, 0.6);
            animation: nf-sun-glow 4s ease-in-out infinite alternate;
        }

        :host-context(html.dark) .nf-sun {
            background: radial-gradient(circle at 40% 40%, #d8d0b0 0%, #a8a080 60%, #807858 100%);
            box-shadow: 0 0 40px rgba(200, 190, 150, 0.3);
            opacity: 0.4;
        }

        @keyframes nf-sun-glow {
            from { box-shadow: 0 0 80px rgba(244, 224, 144, 0.5); }
            to { box-shadow: 0 0 100px rgba(244, 224, 144, 0.8); }
        }

        .nf-cloud {
            position: absolute;
            display: flex;
            align-items: flex-end;
        }

        .nf-cloud span {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.85);
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
        }

        :host-context(html.dark) .nf-cloud span {
            background-color: rgba(100, 110, 120, 0.3);
        }

        .cloud-1 {
            top: 80px;
            left: 8%;
            animation: nf-cloud-drift 80s linear infinite;
        }

        .cloud-1 span:nth-child(1) { width: 40px; height: 40px; margin-right: -8px; }
        .cloud-1 span:nth-child(2) { width: 60px; height: 30px; margin-bottom: 4px; margin-right: -8px; }
        .cloud-1 span:nth-child(3) { width: 40px; height: 40px; }

        .cloud-2 {
            top: 120px;
            right: 20%;
            animation: nf-cloud-drift 100s linear infinite reverse;
        }

        .cloud-2 span:nth-child(1) { width: 30px; height: 30px; margin-right: -6px; }
        .cloud-2 span:nth-child(2) { width: 50px; height: 25px; margin-bottom: 3px; }

        .cloud-3 {
            top: 180px;
            left: 45%;
            animation: nf-cloud-drift 120s linear infinite;
        }

        .cloud-3 span:nth-child(1) { width: 35px; height: 35px; margin-right: -6px; }
        .cloud-3 span:nth-child(2) { width: 55px; height: 28px; margin-bottom: 3px; }
        .cloud-3 span:nth-child(3) { width: 30px; height: 30px; }

        @keyframes nf-cloud-drift {
            from { transform: translateX(0); }
            to { transform: translateX(300px); }
        }

        .nf-bird {
            position: absolute;
            width: 16px;
            height: 10px;
        }

        .nf-bird span {
            position: absolute;
            width: 10px;
            height: 2px;
            background-color: rgba(60, 60, 60, 0.5);
            border-radius: 1px;
        }

        :host-context(html.dark) .nf-bird span {
            background-color: rgba(200, 200, 200, 0.4);
        }

        .nf-bird span:nth-child(1) { transform: rotate(-25deg); left: 0; }
        .nf-bird span:nth-child(2) { transform: rotate(25deg); right: 0; }

        .bird-1 { top: 100px; left: 30%; animation: nf-bird-fly 45s linear infinite; }
        .bird-2 { top: 160px; left: 50%; animation: nf-bird-fly 55s linear infinite reverse; }

        @keyframes nf-bird-fly {
            from { transform: translateX(0); }
            to { transform: translateX(500px); }
        }

        .nf-board-wrap {
            position: relative;
            z-index: 5;
            max-width: 720px;
            width: 100%;
            animation: board-enter 700ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        @keyframes board-enter {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .nf-board-frame {
            padding: 20px;
            background: linear-gradient(145deg, #8b5a2b 0%, #5f3d1c 50%, #3d2612 100%);
            border-radius: 10px;
            box-shadow:
                inset 0 3px 0 rgba(255, 255, 255, 0.15),
                inset 0 -4px 0 rgba(0, 0, 0, 0.5),
                0 30px 80px rgba(0, 0, 0, 0.5),
                0 10px 30px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .nf-board-frame::before {
            content: '';
            position: absolute;
            inset: 6px;
            border-radius: 6px;
            background-image:
                repeating-linear-gradient(90deg,
                    transparent 0 3px,
                    rgba(0, 0, 0, 0.08) 3px 4px);
            pointer-events: none;
            opacity: 0.5;
        }

        .nf-board-surface {
            position: relative;
            padding: 48px 40px 72px;
            background:
                radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.04), transparent 60%),
                linear-gradient(160deg, #223028 0%, #1a2620 55%, #131c18 100%);
            border-radius: 6px;
            box-shadow:
                inset 0 0 40px rgba(0, 0, 0, 0.5),
                inset 0 0 0 1px rgba(244, 241, 234, 0.03);
            overflow: hidden;
            min-height: 420px;
        }

        .nf-board-surface::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
                radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.02) 0 1px, transparent 1px),
                radial-gradient(circle at 65% 70%, rgba(255, 255, 255, 0.015) 0 1px, transparent 1px);
            background-size: 50px 50px, 70px 70px;
            pointer-events: none;
            opacity: 0.7;
        }

        .chalk-scribble {
            position: absolute;
            border-radius: 50%;
            border: 2px solid rgba(244, 241, 234, 0.06);
            pointer-events: none;
        }

        .scribble-1 {
            top: 30px;
            right: 40px;
            width: 60px;
            height: 40px;
            transform: rotate(-15deg);
            border-radius: 60% 40% 30% 70%;
        }

        .scribble-2 {
            bottom: 100px;
            left: 30px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            opacity: 0.5;
        }

        .scribble-3 {
            top: 120px;
            left: 80px;
            width: 80px;
            height: 30px;
            border-radius: 40% 60% 50% 50%;
            transform: rotate(20deg);
            opacity: 0.4;
        }

        .nf-corner {
            position: absolute;
            width: 24px;
            height: 24px;
            z-index: 10;
            pointer-events: none;
        }

        .corner-tl { top: 10px; left: 10px; }
        .corner-tr { top: 10px; right: 10px; }
        .corner-bl { bottom: 10px; left: 10px; }
        .corner-br { bottom: 10px; right: 10px; }

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

        .nf-content {
            position: relative;
            z-index: 2;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .nf-eyebrow-wrap {
            display: flex;
            align-items: center;
            gap: 16px;
            width: 100%;
            justify-content: center;
        }

        .nf-chalk-line {
            flex: 1;
            max-width: 100px;
            height: 1px;
            background: linear-gradient(90deg,
                transparent 0%,
                rgba(244, 241, 234, 0.3) 50%,
                transparent 100%);
        }

        .nf-eyebrow {
            font-size: var(--text-xs);
            font-weight: 700;
            letter-spacing: 4px;
            color: var(--chalk-faded);
            text-transform: uppercase;
            font-family: var(--font-latin);
            white-space: nowrap;
        }

        .nf-number {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin: 8px 0;
        }

        .digit {
            font-family: var(--font-latin);
            font-size: 96px;
            font-weight: 800;
            color: var(--chalk);
            line-height: 1;
            text-shadow:
                0 0 30px rgba(244, 241, 234, 0.3),
                0 4px 8px rgba(0, 0, 0, 0.4);
            animation: digit-appear 700ms cubic-bezier(0.32, 0.72, 0, 1) backwards;
        }

        .digit-4:nth-child(1) { animation-delay: 100ms; }
        .digit-0 { animation-delay: 250ms; }
        .digit-4:nth-child(3) { animation-delay: 400ms; }

        @keyframes digit-appear {
            0% { opacity: 0; transform: scale(0.3) rotate(-20deg); }
            60% { transform: scale(1.1) rotate(5deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .nf-chalk-divider {
            width: 200px;
            height: 2px;
            background: linear-gradient(90deg,
                transparent 0%,
                rgba(244, 241, 234, 0.4) 50%,
                transparent 100%);
            margin: 8px 0;
        }

        .nf-title {
            font-size: var(--text-2xl);
            font-weight: 700;
            color: var(--chalk);
            letter-spacing: 0.5px;
            text-shadow: 0 0 12px rgba(244, 241, 234, 0.2);
            margin: 0;
        }

        .nf-text {
            font-size: var(--text-base);
            color: var(--chalk-dim);
            line-height: 1.8;
            max-width: 400px;
            margin: 0;
        }

        .nf-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 12px;
        }

        .nf-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 22px;
            border-radius: var(--radius);
            font-size: var(--text-base);
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            transition: all 220ms cubic-bezier(0.32, 0.72, 0, 1);
            font-family: var(--font-ar);
            min-height: 46px;
        }

        .nf-btn-primary {
            background: linear-gradient(135deg, #d4a017 0%, #8b6a0f 100%);
            color: #1a1208;
            box-shadow:
                inset 0 -3px 6px rgba(0, 0, 0, 0.25),
                0 6px 20px rgba(212, 160, 23, 0.4);
        }

        .nf-btn-primary:hover {
            background: linear-gradient(135deg, #e8b530 0%, #a07818 100%);
            transform: translateY(-2px);
            box-shadow:
                inset 0 -3px 6px rgba(0, 0, 0, 0.25),
                0 10px 28px rgba(212, 160, 23, 0.6);
        }

        .nf-btn-primary:active {
            transform: translateY(0);
        }

        .nf-btn-ghost {
            background-color: transparent;
            color: var(--chalk-dim);
            border: 1px solid rgba(244, 241, 234, 0.25);
        }

        .nf-btn-ghost:hover {
            background-color: rgba(244, 241, 234, 0.08);
            color: var(--chalk);
            border-color: rgba(244, 241, 234, 0.4);
            transform: translateY(-2px);
        }

        .nf-chalk-tray {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 22px;
            padding: 0 20px;
            background: linear-gradient(180deg, #8b5a2b 0%, #5f3d1c 60%, #3d2612 100%);
            border-radius: 0 0 6px 6px;
            box-shadow:
                inset 0 2px 0 rgba(255, 255, 255, 0.15),
                inset 0 -3px 0 rgba(0, 0, 0, 0.4),
                0 4px 12px rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 4;
        }

        .chalk-piece {
            display: inline-block;
            width: 6px;
            height: 16px;
            border-radius: 2px;
            transform: translateY(-2px) rotate(-3deg);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .piece-white { background: linear-gradient(180deg, #f9f6ee 0%, #e8e3d2 100%); }
        .piece-yellow { background: linear-gradient(180deg, #f4e090 0%, #d4b060 100%); transform: translateY(-2px) rotate(3deg); }
        .piece-pink { background: linear-gradient(180deg, #f0c8d0 0%, #d098a8 100%); transform: translateY(-2px) rotate(-1deg); }
        .piece-green { background: linear-gradient(180deg, #a8d8b0 0%, #7ab888 100%); transform: translateY(-2px) rotate(5deg); }

        .eraser {
            margin-inline-start: auto;
            width: 36px;
            height: 13px;
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
            height: 8px;
            background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
            border-radius: 0 0 2px 2px;
        }

        .nf-ground {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 120px;
            pointer-events: none;
            z-index: 1;
        }

        .nf-grass-svg {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
        }

        .nf-flower {
            position: absolute;
            bottom: 40px;
            width: 28px;
            height: 60px;
            animation: nf-flower-sway 4s ease-in-out infinite;
            transform-origin: bottom center;
        }

        .flower-1 { left: 6%; animation-delay: 0s; }
        .flower-2 { left: 25%; animation-delay: -1s; }
        .flower-3 { left: 72%; animation-delay: -2s; }
        .flower-4 { left: 92%; animation-delay: -1.5s; }

        @keyframes nf-flower-sway {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }

        .petals {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 28px;
            height: 28px;
        }

        .petals span {
            position: absolute;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #ffd0e0 0%, #e890b0 100%);
        }

        .petals span:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
        .petals span:nth-child(2) { top: 50%; left: 0; transform: translateY(-50%); }
        .petals span:nth-child(3) { top: 50%; right: 0; transform: translateY(-50%); }
        .petals span:nth-child(4) { bottom: 0; left: 50%; transform: translateX(-50%); }

        .center {
            position: absolute;
            top: 14px;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #f4e090 0%, #d4a017 100%);
            z-index: 2;
        }

        .stem {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 36px;
            background: linear-gradient(180deg, #4a7a2a 0%, #2a5018 100%);
        }

        .grass-tuft {
            position: absolute;
            bottom: 45px;
            width: 14px;
            height: 24px;
            background:
                radial-gradient(ellipse at 20% 100%, #4a7a2a 0%, transparent 60%),
                radial-gradient(ellipse at 50% 100%, #3d6b28 0%, transparent 60%),
                radial-gradient(ellipse at 80% 100%, #4a7a2a 0%, transparent 60%);
        }

        .tuft-1 { left: 15%; }
        .tuft-2 { left: 42%; }
        .tuft-3 { left: 60%; }
        .tuft-4 { left: 85%; }

        .nf-tree {
            position: absolute;
            bottom: 80px;
            z-index: 2;
            pointer-events: none;
        }

        .nf-tree svg {
            width: 140px;
            height: 240px;
            filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
            animation: nf-tree-sway 6s ease-in-out infinite;
            transform-origin: bottom center;
        }

        .tree-left { left: -20px; }
        .tree-right { right: -20px; }
        .tree-center-left { left: 15%; bottom: 100px; opacity: 0.6; }
        .tree-center-right { right: 15%; bottom: 100px; opacity: 0.6; }

        .tree-center-left svg,
        .tree-center-right svg {
            width: 100px;
            height: 180px;
        }

        @keyframes nf-tree-sway {
            0%, 100% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
        }


        @media (max-width: 900px) {
            .nf-board-wrap {
                max-width: 560px;
            }

            .digit {
                font-size: 72px;
            }

            .nf-title {
                font-size: var(--text-xl);
            }

            .nf-board-surface {
                padding: 32px 24px 60px;
                min-height: 340px;
            }

            .nf-tree svg {
                width: 100px;
                height: 180px;
            }
        }

        @media (max-width: 640px) {
            .nf-screen {
                padding: 24px 16px;
            }

            .nf-board-frame {
                padding: 14px;
            }

            .nf-board-surface {
                padding: 28px 20px 56px;
                min-height: 320px;
            }

            .digit {
                font-size: 64px;
            }

            .nf-title {
                font-size: var(--text-lg);
            }

            .nf-text {
                font-size: var(--text-sm);
            }

            .nf-actions {
                flex-direction: column;
                width: 100%;
            }

            .nf-btn {
                width: 100%;
                justify-content: center;
            }

            .nf-tree {
                display: none;
            }

            .nf-sun {
                width: 60px;
                height: 60px;
                top: 40px;
                right: 40px;
            }

            .nf-board-surface {
                min-height: 280px;
            }

            .nf-corner {
                width: 18px;
                height: 18px;
            }
        }

        @media (max-width: 400px) {
            .digit {
                font-size: 52px;
            }

            .nf-title {
                font-size: var(--text-base);
            }

            .nf-board-surface {
                padding: 24px 16px 48px;
            }
        }


        @media (prefers-reduced-motion: reduce) {
            .nf-sun,
            .nf-cloud,
            .nf-bird,
            .nf-flower,
            .nf-tree svg,
            .digit {
                animation: none !important;
            }
        }
    `]
})
export class NotFound { }