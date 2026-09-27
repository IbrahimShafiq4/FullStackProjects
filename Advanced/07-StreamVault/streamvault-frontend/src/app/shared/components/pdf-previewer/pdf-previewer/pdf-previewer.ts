import { HttpClient } from '@angular/common/http';
import { Component, inject, input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../src/environments';

@Component({
  selector: 'app-pdf-previewer',
  imports: [],
  template: `
        <div class="pdf-previewer" [class.pdf-fullscreen]="isFullscreen()">

            <div class="pp-ceiling">
                <div class="ceiling-line"></div>
                <div class="ceiling-lamp lamp-left">
                    <div class="lamp-cord"></div>
                    <div class="lamp-shade"></div>
                    <div class="lamp-glow"></div>
                </div>
                <div class="ceiling-lamp lamp-center">
                    <div class="lamp-cord"></div>
                    <div class="lamp-shade"></div>
                    <div class="lamp-glow"></div>
                </div>
                <div class="ceiling-lamp lamp-right">
                    <div class="lamp-cord"></div>
                    <div class="lamp-shade"></div>
                    <div class="lamp-glow"></div>
                </div>
            </div>

            <div class="pp-frame">

                <div class="pp-side-decor side-left">
                    <svg class="tree-svg" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="pp-trunk-1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#8b5a2b" />
                                <stop offset="100%" stop-color="#3d2612" />
                            </linearGradient>
                            <radialGradient id="pp-leaf-1" cx="40%" cy="30%" r="60%">
                                <stop offset="0%" stop-color="#5a8a3a" />
                                <stop offset="60%" stop-color="#3d6b28" />
                                <stop offset="100%" stop-color="#2a5018" />
                            </radialGradient>
                        </defs>
                        <rect x="46" y="140" width="8" height="55" fill="url(#pp-trunk-1)" rx="2" />
                        <ellipse cx="50" cy="100" rx="40" ry="55" fill="url(#pp-leaf-1)" />
                    </svg>
                    <svg class="tree-svg tree-svg-2" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                        <rect x="46" y="140" width="8" height="55" fill="url(#pp-trunk-1)" rx="2" />
                        <ellipse cx="50" cy="100" rx="38" ry="52" fill="url(#pp-leaf-1)" />
                    </svg>
                </div>

                <div class="pp-side-decor side-right">
                    <svg class="tree-svg" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                        <rect x="46" y="140" width="8" height="55" fill="url(#pp-trunk-1)" rx="2" />
                        <ellipse cx="50" cy="100" rx="38" ry="52" fill="url(#pp-leaf-1)" />
                    </svg>
                    <svg class="tree-svg tree-svg-2" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                        <rect x="46" y="140" width="8" height="55" fill="url(#pp-trunk-1)" rx="2" />
                        <ellipse cx="50" cy="100" rx="40" ry="55" fill="url(#pp-leaf-1)" />
                    </svg>
                </div>

                <div class="pp-corner corner-tl"><div class="screw"></div></div>
                <div class="pp-corner corner-tr"><div class="screw"></div></div>
                <div class="pp-corner corner-bl"><div class="screw"></div></div>
                <div class="pp-corner corner-br"><div class="screw"></div></div>

                <div class="pp-header">
                    <div class="pp-header-left">
                        <div class="pp-header-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="18" height="18">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6" />
                                <path d="M9 13h1.5a1.5 1.5 0 0 1 0 3H9v-3zM9 16v2" />
                                <path d="M15 13v5M15 13h2" />
                            </svg>
                        </div>
                        <span class="pp-title">{{ title() }}</span>
                    </div>
                    <div class="pp-header-right">
                        <div class="pp-badge">PDF</div>
                        @if (safeUrl()) {
                            <a class="pp-icon-btn"
                               [href]="blobUrl()"
                               target="_blank"
                               rel="noopener"
                               aria-label="فتح في تبويب جديد"
                               title="فتح في تبويب جديد">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="16" height="16">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <path d="M15 3h6v6M10 14L21 3" />
                                </svg>
                            </a>
                        }
                    </div>
                </div>

                <div class="pp-body">
                    @if (isLoading()) {
                        <div class="pp-loading">
                            <div class="pp-loading-scene">
                                <div class="loading-desk">
                                    <div class="loading-desk-top"></div>
                                    <div class="loading-desk-legs">
                                        <div class="loading-leg"></div>
                                        <div class="loading-leg"></div>
                                    </div>
                                </div>
                                <div class="loading-paper">
                                    <div class="loading-paper-line line-1"></div>
                                    <div class="loading-paper-line line-2"></div>
                                    <div class="loading-paper-line line-3"></div>
                                    <div class="loading-paper-line line-4"></div>
                                </div>
                            </div>
                            <div class="pp-spinner"></div>
                            <span class="pp-loading-text">جاري تحميل المستند...</span>
                        </div>
                    } @else if (hasError()) {
                        <div class="pp-error">
                            <div class="pp-error-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="40" height="40">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                            </div>
                            <p class="pp-error-text">{{ errorMessage() }}</p>
                        </div>
                    } @else if (safeUrl(); as url) {
                        <div class="pp-frame-wrap">
                            <div class="pp-page-decor top">
                                <div class="page-corner"></div>
                                <div class="page-corner"></div>
                            </div>
                            <iframe [src]="url" class="pp-iframe" title="{{ title() }}"></iframe>
                            <div class="pp-page-decor bottom">
                                <div class="page-corner"></div>
                                <div class="page-corner"></div>
                            </div>
                        </div>
                    }
                </div>

                <div class="pp-chalk-tray">
                    <div class="chalk-piece piece-white"></div>
                    <div class="chalk-piece piece-yellow"></div>
                    <div class="chalk-piece piece-pink"></div>
                    <div class="eraser">
                        <div class="eraser-top"></div>
                        <div class="eraser-bottom"></div>
                    </div>
                </div>
            </div>

            <div class="pp-grass-decor">
                <svg class="grass-svg" viewBox="0 0 1200 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="pp-grass-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#7ba862" />
                            <stop offset="100%" stop-color="#3d5a30" />
                        </linearGradient>
                    </defs>
                    <path d="M0,50 Q50,30 100,45 T200,42 T300,48 T400,40 T500,47 T600,44 T700,50 T800,45 T900,48 T1000,42 T1100,46 T1200,44 L1200,80 L0,80 Z"
                          fill="url(#pp-grass-grad)" />
                </svg>
                <div class="flower flower-1">
                    <div class="flower-petals"><span></span><span></span><span></span><span></span></div>
                    <div class="flower-center"></div>
                    <div class="flower-stem"></div>
                </div>
                <div class="flower flower-2">
                    <div class="flower-petals"><span></span><span></span><span></span><span></span></div>
                    <div class="flower-center"></div>
                    <div class="flower-stem"></div>
                </div>
                <div class="flower flower-3">
                    <div class="flower-petals"><span></span><span></span><span></span><span></span></div>
                    <div class="flower-center"></div>
                    <div class="flower-stem"></div>
                </div>
            </div>

            <div class="pp-sky-decor">
                <div class="pp-cloud cloud-1">
                    <div class="cloud-puff"></div>
                    <div class="cloud-puff"></div>
                    <div class="cloud-puff"></div>
                </div>
                <div class="pp-cloud cloud-2">
                    <div class="cloud-puff"></div>
                    <div class="cloud-puff"></div>
                </div>
                <div class="pp-bird bird-1"><span></span><span></span></div>
                <div class="pp-bird bird-2"><span></span><span></span></div>
            </div>

        </div>
    `,
  styles: [`

        :host {
            display: block;
        }

        .pdf-previewer {
            position: relative;
            background: linear-gradient(180deg, #f7f3eb 0%, #ebe5d5 100%);
            border-radius: var(--radius-md);
            overflow: hidden;
            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.6),
                0 20px 60px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(26, 38, 32, 0.08);
            padding-bottom: 40px;
            transition: all 400ms cubic-bezier(0.32, 0.72, 0, 1);
        }

        :host-context(html.dark) .pdf-previewer {
            background: linear-gradient(180deg, #1a2620 0%, #0f1614 100%);
            box-shadow:
                inset 0 1px 0 rgba(244, 241, 234, 0.06),
                0 20px 60px rgba(0, 0, 0, 0.5);
            border-color: rgba(244, 241, 234, 0.08);
        }

        .pdf-fullscreen {
            padding-bottom: 0;
            border-radius: 0;
        }


        .pp-ceiling {
            position: relative;
            height: 60px;
            background: linear-gradient(180deg, #d4c9b0 0%, #f7f3eb 100%);
            border-bottom: 1px solid rgba(26, 38, 32, 0.08);
        }

        :host-context(html.dark) .pp-ceiling {
            background: linear-gradient(180deg, #0a0e0c 0%, #1a2620 100%);
            border-bottom-color: rgba(244, 241, 234, 0.08);
        }

        .ceiling-line {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg,
                transparent 0%,
                rgba(212, 160, 23, 0.3) 20%,
                rgba(212, 160, 23, 0.5) 50%,
                rgba(212, 160, 23, 0.3) 80%,
                transparent 100%);
        }

        .ceiling-lamp {
            position: absolute;
            top: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .lamp-left { left: 15%; }
        .lamp-center { left: 50%; transform: translateX(-50%); }
        .lamp-right { right: 15%; }

        .lamp-cord {
            width: 1px;
            height: 20px;
            background-color: rgba(26, 38, 32, 0.3);
        }

        :host-context(html.dark) .lamp-cord {
            background-color: rgba(244, 241, 234, 0.2);
        }

        .lamp-shade {
            width: 30px;
            height: 18px;
            background: linear-gradient(180deg, #4a3a20 0%, #2a1a08 100%);
            border-radius: 15px 15px 4px 4px;
            box-shadow:
                inset 0 -2px 4px rgba(0, 0, 0, 0.4),
                0 2px 6px rgba(0, 0, 0, 0.2);
            position: relative;
        }

        .lamp-shade::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 3px;
            background: radial-gradient(ellipse, rgba(255, 220, 140, 0.8), transparent);
            border-radius: 50%;
        }

        .lamp-glow {
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 60px;
            background: radial-gradient(ellipse at center top,
                rgba(255, 220, 140, 0.2) 0%,
                transparent 70%);
            pointer-events: none;
            animation: pp-lamp-flicker 4s ease-in-out infinite;
        }

        @keyframes pp-lamp-flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
        }


        .pp-frame {
            position: relative;
            margin: 12px;
            padding: 16px;
            background: linear-gradient(145deg, #8b5a2b 0%, #5f3d1c 50%, #3d2612 100%);
            border-radius: 6px;
            box-shadow:
                inset 0 2px 0 rgba(255, 255, 255, 0.15),
                inset 0 -3px 0 rgba(0, 0, 0, 0.4),
                0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .pp-frame::before {
            content: '';
            position: absolute;
            inset: 4px;
            border-radius: 4px;
            background-image:
                repeating-linear-gradient(90deg,
                    transparent 0 3px,
                    rgba(0, 0, 0, 0.08) 3px 4px);
            pointer-events: none;
            opacity: 0.5;
        }


        .pp-side-decor {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 70px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            z-index: 2;
            pointer-events: none;
        }

        .side-left { left: -45px; }
        .side-right { right: -45px; }

        .tree-svg {
            width: 60px;
            height: 120px;
            opacity: 0.7;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
            animation: pp-tree-sway 6s ease-in-out infinite;
            transform-origin: bottom center;
        }

        .tree-svg-2 {
            animation-delay: -2s;
            opacity: 0.5;
        }

        @keyframes pp-tree-sway {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(1.5deg); }
        }


        .pp-corner {
            position: absolute;
            width: 24px;
            height: 24px;
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
                0 2px 4px rgba(0, 0, 0, 0.3);
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


        .pp-header {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 16px;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.15) 100%);
            border-bottom: 1px solid rgba(244, 241, 234, 0.08);
            z-index: 3;
        }

        .pp-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 0;
        }

        .pp-header-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }

        .pp-header-icon {
            width: 32px;
            height: 32px;
            border-radius: var(--radius);
            background: linear-gradient(135deg, #d94a3d 0%, #a8231a 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow:
                inset 0 -2px 4px rgba(0, 0, 0, 0.2),
                0 2px 8px rgba(217, 74, 61, 0.3);
        }

        .pp-title {
            font-size: var(--text-sm);
            font-weight: 700;
            color: var(--chalk);
            letter-spacing: 0.5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            min-width: 0;
        }

        .pp-badge {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 2px;
            padding: 3px 10px;
            background: linear-gradient(135deg, #d94a3d 0%, #a8231a 100%);
            color: #fff;
            border-radius: 10px;
            box-shadow:
                inset 0 -2px 3px rgba(0, 0, 0, 0.3),
                0 2px 6px rgba(217, 74, 61, 0.4);
        }

        .pp-icon-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(244, 241, 234, 0.06);
            color: rgba(244, 241, 234, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(244, 241, 234, 0.1);
            cursor: pointer;
            transition: all 200ms cubic-bezier(0.32, 0.72, 0, 1);
            text-decoration: none;
        }

        .pp-icon-btn:hover {
            background-color: rgba(217, 74, 61, 0.2);
            color: #fff;
            border-color: rgba(217, 74, 61, 0.4);
            transform: scale(1.05);
        }


        .pp-body {
            position: relative;
            aspect-ratio: 4 / 5;
            background-color: #e8e0d0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            z-index: 1;
        }

        :host-context(html.dark) .pp-body {
            background-color: #0a0e0c;
        }

        .pp-frame-wrap {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 8px;
        }

        .pp-iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
            background-color: #fff;
            border-radius: 2px;
            box-shadow:
                0 2px 8px rgba(0, 0, 0, 0.15),
                inset 0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        .pp-page-decor {
            position: absolute;
            left: 8px;
            right: 8px;
            height: 6px;
            pointer-events: none;
            z-index: 2;
        }

        .pp-page-decor.top { top: 8px; }
        .pp-page-decor.bottom { bottom: 8px; }

        .page-corner {
            position: absolute;
            top: 0;
            width: 12px;
            height: 12px;
            border-top: 2px solid rgba(217, 74, 61, 0.4);
            border-right: 2px solid rgba(217, 74, 61, 0.4);
        }

        .page-corner:nth-child(1) { left: 0; }
        .page-corner:nth-child(2) { right: 0; }


        .pp-loading {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            background-color: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(6px);
            pointer-events: none;
            z-index: 10;
            animation: pp-fade-in 300ms ease-out;
        }

        @keyframes pp-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .pp-loading-scene {
            display: flex;
            align-items: flex-end;
            gap: 20px;
            margin-bottom: 16px;
            opacity: 0.7;
        }

        .loading-desk {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .loading-desk-top {
            width: 60px;
            height: 6px;
            background: linear-gradient(180deg, #8b5a2b 0%, #5f3d1c 100%);
            border-radius: 3px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .loading-desk-legs {
            display: flex;
            justify-content: space-between;
            width: 40px;
        }

        .loading-leg {
            width: 4px;
            height: 20px;
            background: linear-gradient(180deg, #5f3d1c 0%, #3d2612 100%);
            border-radius: 0 0 2px 2px;
        }

        .loading-paper {
            position: relative;
            width: 40px;
            height: 50px;
            background-color: #fdfbf5;
            border-radius: 2px;
            box-shadow:
                1px 2px 4px rgba(0, 0, 0, 0.2),
                inset 0 0 0 1px rgba(0, 0, 0, 0.05);
            padding: 8px 6px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .loading-paper-line {
            height: 2px;
            background-color: rgba(100, 120, 150, 0.3);
            border-radius: 1px;
        }

        .line-1 { width: 80%; }
        .line-2 { width: 60%; }
        .line-3 { width: 90%; }
        .line-4 { width: 50%; }

        .pp-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(244, 241, 234, 0.12);
            border-top-color: #d94a3d;
            border-radius: 50%;
            animation: pp-spin 900ms linear infinite;
            position: relative;
        }

        .pp-spinner::after {
            content: '';
            position: absolute;
            inset: 6px;
            border: 2px solid rgba(244, 241, 234, 0.06);
            border-bottom-color: rgba(217, 74, 61, 0.4);
            border-radius: 50%;
            animation: pp-spin 1400ms linear infinite reverse;
        }

        @keyframes pp-spin {
            to { transform: rotate(360deg); }
        }

        .pp-loading-text {
            font-size: var(--text-sm);
            font-weight: 600;
            color: var(--chalk-dim);
            letter-spacing: 1px;
        }


        .pp-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            height: 100%;
            padding: 32px;
            text-align: center;
        }

        .pp-error-icon {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background-color: rgba(217, 74, 61, 0.15);
            color: #d94a3d;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            animation: pp-error-shake 500ms ease-out;
        }

        @keyframes pp-error-shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
        }

        .pp-error-text {
            font-size: var(--text-base);
            font-weight: 700;
            color: var(--chalk);
            letter-spacing: 0.5px;
        }


        .pp-chalk-tray {
            position: relative;
            margin-top: 8px;
            height: 24px;
            padding: 0 16px;
            background: linear-gradient(180deg, #8b5a2b 0%, #5f3d1c 60%, #3d2612 100%);
            border-radius: 0 0 6px 6px;
            box-shadow:
                inset 0 2px 0 rgba(255, 255, 255, 0.15),
                inset 0 -3px 0 rgba(0, 0, 0, 0.4),
                0 4px 12px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 4;
        }

        .chalk-piece {
            display: inline-block;
            width: 6px;
            height: 18px;
            border-radius: 2px;
            box-shadow:
                inset 0 -2px 3px rgba(0, 0, 0, 0.15),
                0 1px 2px rgba(0, 0, 0, 0.3);
            transform: translateY(-3px) rotate(-4deg);
        }

        .piece-white {
            background: linear-gradient(180deg, #f9f6ee 0%, #e8e3d2 100%);
        }

        .piece-yellow {
            background: linear-gradient(180deg, #f4e090 0%, #d4b060 100%);
            transform: translateY(-3px) rotate(3deg);
        }

        .piece-pink {
            background: linear-gradient(180deg, #f0c8d0 0%, #d098a8 100%);
            transform: translateY(-3px) rotate(-2deg);
        }

        .eraser {
            margin-inline-start: auto;
            width: 40px;
            height: 14px;
            position: relative;
            transform: translateY(-3px);
        }

        .eraser-top {
            width: 100%;
            height: 6px;
            background: linear-gradient(180deg, #f0e8d0 0%, #d4c9a8 100%);
            border-radius: 2px 2px 0 0;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .eraser-bottom {
            width: 100%;
            height: 8px;
            background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
            border-radius: 0 0 2px 2px;
            box-shadow:
                inset 0 -2px 3px rgba(0, 0, 0, 0.4),
                0 2px 4px rgba(0, 0, 0, 0.3);
        }


        .pp-grass-decor {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 80px;
            pointer-events: none;
            z-index: 1;
        }

        .grass-svg {
            width: 100%;
            height: 100%;
            display: block;
        }

        .flower {
            position: absolute;
            bottom: 30px;
            width: 24px;
            height: 50px;
            animation: pp-flower-sway 4s ease-in-out infinite;
            transform-origin: bottom center;
        }

        .flower-1 { left: 12%; animation-delay: 0s; }
        .flower-2 { left: 45%; animation-delay: -1.5s; }
        .flower-3 { left: 82%; animation-delay: -2.5s; }

        @keyframes pp-flower-sway {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }

        .flower-petals {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 24px;
        }

        .flower-petals span {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #ffd0e0 0%, #e890b0 100%);
            box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.15);
        }

        .flower-petals span:nth-child(1) {
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        .flower-petals span:nth-child(2) {
            top: 50%;
            left: 0;
            transform: translateY(-50%);
        }

        .flower-petals span:nth-child(3) {
            top: 50%;
            right: 0;
            transform: translateY(-50%);
        }

        .flower-petals span:nth-child(4) {
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        .flower-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #f4e090 0%, #d4a017 100%);
            box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.2);
            z-index: 2;
        }

        .flower-stem {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 30px;
            background: linear-gradient(180deg, #4a7a2a 0%, #2a5018 100%);
            border-radius: 1px;
        }


        .pp-sky-decor {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            pointer-events: none;
            overflow: hidden;
            z-index: 0;
        }

        .pp-cloud {
            position: absolute;
            display: flex;
            align-items: flex-end;
        }

        .cloud-1 {
            top: 20px;
            left: 10%;
            animation: pp-cloud-drift 60s linear infinite;
        }

        .cloud-2 {
            top: 30px;
            right: 15%;
            animation: pp-cloud-drift 80s linear infinite reverse;
        }

        .cloud-puff {
            width: 24px;
            height: 18px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            margin-inline-end: -8px;
        }

        .cloud-puff:nth-child(2) {
            width: 32px;
            height: 22px;
            margin-bottom: 4px;
        }

        .cloud-puff:nth-child(3) {
            width: 20px;
            height: 14px;
        }

        @keyframes pp-cloud-drift {
            from { transform: translateX(0); }
            to { transform: translateX(200px); }
        }

        .pp-bird {
            position: absolute;
            width: 12px;
            height: 8px;
        }

        .bird-1 {
            top: 15px;
            left: 30%;
            animation: pp-bird-fly 30s linear infinite;
        }

        .bird-2 {
            top: 25px;
            left: 50%;
            animation: pp-bird-fly 35s linear infinite reverse;
        }

        .pp-bird span {
            position: absolute;
            width: 8px;
            height: 2px;
            background-color: rgba(26, 38, 32, 0.3);
            border-radius: 1px;
        }

        :host-context(html.dark) .pp-bird span {
            background-color: rgba(244, 241, 234, 0.3);
        }

        .pp-bird span:nth-child(1) {
            transform: rotate(-25deg);
            left: 0;
        }

        .pp-bird span:nth-child(2) {
            transform: rotate(25deg);
            right: 0;
        }

        @keyframes pp-bird-fly {
            from { transform: translateX(0); }
            to { transform: translateX(300px); }
        }

        .pdf-fullscreen .pp-body {
            aspect-ratio: auto;
            height: 100vh;
        }

        .pdf-fullscreen .pp-side-decor,
        .pdf-fullscreen .pp-grass-decor,
        .pdf-fullscreen .pp-sky-decor,
        .pdf-fullscreen .pp-ceiling,
        .pdf-fullscreen .pp-chalk-tray,
        .pdf-fullscreen .pp-corner {
            display: none;
        }

        .pdf-fullscreen .pp-frame {
            margin: 0;
            padding: 0;
            border-radius: 0;
            background: #000;
        }


        @media (max-width: 900px) {
            .pp-side-decor {
                display: none;
            }

            .pp-ceiling {
                height: 40px;
            }

            .ceiling-lamp {
                transform: scale(0.8);
            }

            .pp-chalk-tray {
                height: 20px;
                padding: 0 12px;
            }

            .chalk-piece {
                width: 4px;
                height: 14px;
            }

            .eraser {
                width: 30px;
                height: 12px;
            }
        }

        @media (max-width: 640px) {
            .pp-frame {
                margin: 6px;
                padding: 10px;
            }

            .pp-header {
                padding: 8px 12px;
            }

            .pp-header-icon {
                width: 28px;
                height: 28px;
            }

            .pp-title {
                font-size: var(--text-xs);
            }

            .pp-badge {
                display: none;
            }

            .pp-spinner {
                width: 40px;
                height: 40px;
            }

            .pp-error-icon {
                width: 56px;
                height: 56px;
            }

            .pp-error-text {
                font-size: var(--text-sm);
            }

            .pp-loading-scene {
                transform: scale(0.8);
            }

            .pp-grass-decor {
                height: 50px;
            }

            .flower {
                transform: scale(0.7);
            }

            .flower-2 {
                display: none;
            }
        }

        @media (max-width: 400px) {
            .pp-chalk-tray {
                display: none;
            }

            .pp-frame {
                margin: 4px;
                padding: 8px;
            }
        }


        @media (prefers-reduced-motion: reduce) {
            .tree-svg,
            .flower,
            .pp-cloud,
            .pp-bird,
            .lamp-glow,
            .pp-spinner {
                animation: none !important;
            }
        }
    `]
})
export class PdfPreviewer implements OnInit, OnDestroy {
  private readonly _HttpClient: HttpClient = inject(HttpClient);
  private readonly _Sanitizer: DomSanitizer = inject(DomSanitizer);

  public studyFileId = input.required<number>();
  public title = input<string>('مستند');

  public safeUrl: WritableSignal<SafeResourceUrl | null> = signal<SafeResourceUrl | null>(null);
  public blobUrl: WritableSignal<string> = signal<string>('');
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public hasError: WritableSignal<boolean> = signal<boolean>(false);
  public errorMessage: WritableSignal<string> = signal<string>('');
  public isFullscreen: WritableSignal<boolean> = signal<boolean>(false);

  private _BlobUrlInternal: string | null = null;

  public ngOnInit(): void {
    this._LoadFile();
    document.addEventListener('fullscreenchange', this._OnFullscreenChange);
  }

  private _LoadFile(): void {
    const url: string = `${environment.apiUrl}/api/studyfiles/${this.studyFileId()}/download`;

    this._HttpClient.get(url, {
      responseType: 'blob',
      withCredentials: true,
      observe: 'response'
    }).subscribe({
      next: (response) => {
        const blob: Blob | null = response.body;
        if (!blob || blob.size === 0) {
          this.isLoading.set(false);
          this.hasError.set(true);
          this.errorMessage.set('الملف فاضي أو غير موجود');
          return;
        }

        this._BlobUrlInternal = window.URL.createObjectURL(blob);
        this.blobUrl.set(this._BlobUrlInternal);
        this.safeUrl.set(this._Sanitizer.bypassSecurityTrustResourceUrl(this._BlobUrlInternal));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.hasError.set(true);
        if (err.status === 403) {
          this.errorMessage.set('لازم تشتري الملف الأول عشان تشوفه');
        } else if (err.status === 404) {
          this.errorMessage.set('الملف مش موجود');
        } else {
          this.errorMessage.set('تعذر تحميل الملف');
        }
      }
    });
  }

  private readonly _OnFullscreenChange = (): void => {
    this.isFullscreen.set(document.fullscreenElement !== null);
  };

  public ngOnDestroy(): void {
    document.removeEventListener('fullscreenchange', this._OnFullscreenChange);

    if (this._BlobUrlInternal) {
      window.URL.revokeObjectURL(this._BlobUrlInternal);
      this._BlobUrlInternal = null;
    }
    this.safeUrl.set(null);
  }
}