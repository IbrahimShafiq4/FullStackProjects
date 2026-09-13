import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

interface IStat { label: string; value: string; hint: string; }
interface IFeature { icon: string; title: string; desc: string; }
interface IStep { num: string; title: string; desc: string; }
interface ICategory { icon: string; name: string; count: string; }
interface ITestimonial { name: string; role: string; quote: string; initials: string; stars: number; }
interface IFaq { q: string; a: string; }

@Component({
    selector: 'app-landing-page',
    imports: [RouterLink],
    templateUrl: './landing-page.html',
    styles: `
    .desktop {
      min-height: 100vh;
      padding: 44px 24px 72px;
      direction: rtl;
      position: relative;
    }

    .aero-window {
      max-width: 1180px;
      margin: 0 auto;
      position: relative;
      border-radius: 8px 8px 6px 6px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.55) 0%,
          rgba(240, 248, 255, 0.42) 40%,
          rgba(225, 240, 252, 0.5) 100%);
      border: 1px solid var(--frame-border);
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.65),
        inset 0 0 0 1px rgba(255, 255, 255, 0.55),
        0 24px 70px rgba(0, 25, 60, 0.55),
        0 8px 20px rgba(0, 25, 60, 0.35),
        0 0 40px rgba(110, 180, 240, 0.35);
      backdrop-filter: blur(22px) saturate(1.5);
      -webkit-backdrop-filter: blur(22px) saturate(1.5);
      overflow: hidden;
    }

    .aero-window::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 62%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0.18) 35%,
        rgba(255, 255, 255, 0) 100%);
      pointer-events: none;
      border-radius: 8px 8px 0 0;
      z-index: 1;
    }

    .aero-titlebar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px 6px 14px;
      background:
        linear-gradient(180deg,
          var(--title-1) 0%,
          var(--title-2) 44%,
          var(--title-3) 50%,
          var(--title-4) 100%);
      border-bottom: 1px solid rgba(90, 130, 180, 0.65);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.95),
        inset 0 -1px 0 rgba(255, 255, 255, 0.35);
      z-index: 5;
    }

    .aero-titlebar::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 4px;
      right: 4px;
      height: 48%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.75) 0%,
        rgba(255, 255, 255, 0.15) 60%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 12px 12px;
      pointer-events: none;
    }

    .title-left {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
      z-index: 1;
    }

    .title-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      filter: drop-shadow(0 1px 1px rgba(0, 30, 70, 0.3));
    }

    .title-text {
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      font-size: 13.5px;
      color: #0a2949;
      text-shadow:
        0 1px 0 rgba(255, 255, 255, 0.9),
        0 0 8px rgba(255, 255, 255, 0.6);
    }

    .window-controls {
      display: flex;
      gap: 2px;
      position: relative;
      z-index: 1;
    }

    .win-ctrl {
      width: 30px;
      height: 22px;
      border-radius: 3px;
      border: 1px solid rgba(60, 100, 150, 0.55);
      background:
        linear-gradient(180deg,
          #f8fcff 0%,
          #e5eff9 45%,
          #cddef1 50%,
          #b8d0ea 51%,
          #cfe0f3 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(120, 150, 190, 0.4),
        0 1px 2px rgba(0, 30, 70, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.15s ease;
      text-decoration: none;
      padding: 0;
    }

    .win-ctrl:hover {
      background:
        linear-gradient(180deg,
          #eaf5ff 0%,
          #d4e7fa 45%,
          #b8d4ee 50%,
          #a0c5e5 51%,
          #bedaf5 100%);
      border-color: #4a7cb0;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 0 6px rgba(90, 160, 220, 0.6);
    }

    .win-ctrl::before {
      content: '';
      position: absolute;
      top: 0;
      left: 6%;
      right: 6%;
      height: 50%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 3px 3px 50% 50% / 3px 3px 8px 8px;
      pointer-events: none;
    }

    .win-ctrl-icon {
      font-size: 11px;
      font-weight: 700;
      color: #1a3a5c;
      position: relative;
      z-index: 1;
      line-height: 1;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .win-ctrl-close {
      background:
        linear-gradient(180deg,
          #ff9080 0%,
          #e86a58 45%,
          #cc4834 50%,
          #b83020 51%,
          #e05a48 100%);
      border-color: #8b2a1e;
    }

    .win-ctrl-close .win-ctrl-icon {
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(80, 0, 0, 0.5);
    }

    .win-ctrl-close:hover {
      background:
        linear-gradient(180deg,
          #ffb0a0 0%,
          #f08070 45%,
          #d85040 50%,
          #c03020 51%,
          #e87060 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 0 10px rgba(255, 100, 80, 0.7);
    }

    .aero-toolbar {
      position: relative;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 10px 16px;
      background:
        linear-gradient(180deg,
          rgba(246, 251, 255, 0.78) 0%,
          rgba(228, 240, 252, 0.72) 100%);
      border-bottom: 1px solid rgba(120, 155, 195, 0.45);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.85),
        inset 0 -1px 0 rgba(255, 255, 255, 0.35);
      flex-wrap: wrap;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #0a2949;
    }

    .toolbar-brand-orb {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cairo', sans-serif;
      font-weight: 900;
      font-size: 13px;
      color: #ffffff;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.85) 0%, transparent 40%),
        linear-gradient(180deg, #4a9eff 0%, #1e6fd9 50%, #0f52a8 100%);
      border: 1px solid rgba(180, 220, 255, 0.8);
      box-shadow:
        inset 0 -3px 6px rgba(0, 30, 70, 0.35),
        inset 0 2px 3px rgba(255, 255, 255, 0.55),
        0 3px 8px rgba(30, 90, 180, 0.35);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .toolbar-brand-name {
      font-family: 'Cairo', sans-serif;
      font-weight: 800;
      font-size: 16px;
      letter-spacing: -0.3px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .aero-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 14px;
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #0a2949;
      cursor: pointer;
      text-decoration: none;
      border-radius: 4px;
      background:
        linear-gradient(180deg,
          var(--btn-1) 0%,
          var(--btn-2) 44%,
          var(--btn-3) 50%,
          var(--btn-4) 51%,
          var(--btn-5) 100%);
      border: 1px solid var(--btn-border);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(140, 170, 210, 0.45),
        0 1px 2px rgba(0, 30, 70, 0.12);
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .aero-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 4%;
      right: 4%;
      height: 48%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.25) 70%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 4px 4px 50% 50% / 4px 4px 12px 12px;
      pointer-events: none;
    }

    .aero-btn:hover {
      background:
        linear-gradient(180deg,
          #eaf5ff 0%,
          #d5e9fb 44%,
          #bbd6ee 50%,
          #a8c8e5 51%,
          #c5dcf4 100%);
      border-color: var(--btn-border-2);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(140, 170, 210, 0.45),
        0 0 10px rgba(90, 160, 240, 0.6),
        0 1px 3px rgba(0, 30, 70, 0.18);
    }

    .aero-btn:active {
      background:
        linear-gradient(180deg,
          #b0c8e0 0%,
          #c5d8ec 45%,
          #d5e5f5 50%,
          #c8dcef 100%);
      box-shadow:
        inset 0 2px 4px rgba(50, 90, 140, 0.35);
      transform: translateY(1px);
    }

    .aero-btn-lg { padding: 11px 22px; font-size: 14px; }

    .aero-btn-primary {
      background:
        linear-gradient(180deg,
          #8dc4f8 0%,
          #4a90dc 44%,
          #2b78ca 50%,
          #1a5ea8 51%,
          #3a82d0 100%);
      border-color: #0e3e73;
      color: #ffffff;
    }

    .aero-btn-primary::before {
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.55) 0%,
        rgba(255, 255, 255, 0) 100%);
    }

    .aero-btn-primary:hover {
      background:
        linear-gradient(180deg,
          #a8d5ff 0%,
          #5aa0e8 44%,
          #3a88d8 50%,
          #2a6eb8 51%,
          #4a92e0 100%);
      border-color: #0a3060;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -1px 0 rgba(0, 30, 70, 0.4),
        0 0 14px rgba(90, 160, 240, 0.8),
        0 1px 3px rgba(0, 30, 70, 0.25);
    }

    .aero-btn-primary * { text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5); }

    .aero-content {
      position: relative;
      z-index: 2;
      padding: 30px 28px 32px;
      background: var(--content-bg);
    }

    .hero {
      position: relative;
      padding: 26px 28px;
      border-radius: 8px;
      margin-bottom: 24px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(240, 248, 255, 0.94) 45%,
          rgba(220, 235, 250, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(180, 200, 225, 0.4),
        0 4px 12px rgba(0, 30, 70, 0.12);
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 3%;
      right: 3%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 8px 8px 50% 50% / 8px 8px 40px 40px;
      pointer-events: none;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 32px;
      align-items: center;
      position: relative;
    }

    .hero-title {
      font-family: 'Cairo', sans-serif;
      font-size: clamp(1.8rem, 4vw, 3.2rem);
      line-height: 1.15;
      font-weight: 900;
      letter-spacing: -1.5px;
      margin: 0 0 16px;
      color: #0a2949;
      text-shadow:
        0 1px 0 rgba(255, 255, 255, 0.8),
        0 2px 8px rgba(10, 40, 80, 0.1);
    }

    .hero-title em {
      color: #1e6fd9;
      font-style: normal;
      text-shadow:
        0 1px 0 rgba(255, 255, 255, 0.8),
        0 0 20px rgba(90, 160, 240, 0.5);
    }

    .hero-sub {
      font-family: 'Cairo', sans-serif;
      font-size: 15px;
      line-height: 1.7;
      color: #1e4a7a;
      margin: 0 0 22px;
      max-width: 520px;
    }

    .hero-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* Hero status panel — like Windows 7 gadgets */
    .hero-panel {
      position: relative;
      padding: 18px 20px;
      border-radius: 6px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 3px 10px rgba(0, 30, 70, 0.12);
      overflow: hidden;
    }

    .hero-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 3%;
      right: 3%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 25px 25px;
      pointer-events: none;
    }

    .hero-panel-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 10px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(120, 155, 195, 0.3);
      position: relative;
    }

    .hero-panel-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #a8e8b8 0%, #2a8f4a 100%);
      box-shadow:
        0 0 6px rgba(80, 200, 120, 0.9),
        inset 0 -1px 1px rgba(0, 30, 60, 0.3);
    }

    .hero-panel-title {
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      font-weight: 800;
      color: #1e4a7a;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .hp-row {
      display: flex;
      justify-content: space-between;
      padding: 7px 0;
      border-bottom: 1px dashed rgba(120, 155, 195, 0.28);
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      position: relative;
    }

    .hp-row:last-child { border-bottom: none; }

    .hp-key { color: #4a6b8f; font-weight: 600; }
    .hp-val { font-weight: 800; color: #0a2949; }
    .hp-val-blue { color: #1e6fd9; }
    .hp-val-green { color: #2a8f4a; }

    .section {
      margin-bottom: 26px;
    }

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 10px;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(120, 155, 195, 0.4);
    }

    .section-title {
      font-family: 'Cairo', sans-serif;
      font-size: 19px;
      font-weight: 800;
      letter-spacing: -0.4px;
      margin: 0;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .section-title em {
      color: #1e6fd9;
      font-style: normal;
    }

    .section-hint {
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      font-weight: 700;
      color: #4a6b8f;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .stat-card {
      position: relative;
      padding: 18px 16px;
      border-radius: 6px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 45%,
          rgba(232, 242, 252, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 2px 6px rgba(0, 30, 70, 0.1);
      transition: all 0.15s ease;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 5%;
      right: 5%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 20px 20px;
      pointer-events: none;
    }

    .stat-card:hover {
      border-color: var(--btn-border-2);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 0 12px rgba(90, 160, 240, 0.5),
        0 4px 12px rgba(0, 30, 70, 0.15);
      transform: translateY(-2px);
    }

    .stat-value {
      font-family: 'Cairo', sans-serif;
      font-size: clamp(1.7rem, 3.2vw, 2.4rem);
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1;
      color: #0a2949;
      display: block;
      margin-bottom: 6px;
      position: relative;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .stat-value-accent {
      background: linear-gradient(180deg, #4a9eff 0%, #0f52a8 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: none;
      filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.7)) drop-shadow(0 0 8px rgba(90, 160, 240, 0.4));
    }

    .stat-label {
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      font-weight: 800;
      display: block;
      margin-bottom: 3px;
      color: #1e4a7a;
      position: relative;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .stat-hint {
      font-family: 'Cairo', sans-serif;
      font-size: 11.5px;
      font-weight: 600;
      color: #6e8bab;
      position: relative;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .feature-card {
      position: relative;
      padding: 20px 18px;
      border-radius: 6px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 45%,
          rgba(232, 242, 252, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 2px 6px rgba(0, 30, 70, 0.1);
      transition: all 0.15s ease;
      overflow: hidden;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 4%;
      right: 4%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 25px 25px;
      pointer-events: none;
    }

    .feature-card:hover {
      border-color: var(--btn-border-2);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 0 14px rgba(90, 160, 240, 0.55),
        0 5px 14px rgba(0, 30, 70, 0.15);
      transform: translateY(-3px);
    }

    .feature-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 14px;
      position: relative;
      color: #ffffff;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.85) 0%, transparent 45%),
        linear-gradient(180deg, #6cb8ff 0%, #1e6fd9 50%, #0f52a8 100%);
      border: 1px solid rgba(180, 220, 255, 0.7);
      box-shadow:
        inset 0 -3px 6px rgba(0, 30, 70, 0.35),
        inset 0 2px 3px rgba(255, 255, 255, 0.5),
        0 3px 8px rgba(30, 90, 180, 0.3);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .feature-title {
      font-family: 'Cairo', sans-serif;
      font-size: 15.5px;
      font-weight: 800;
      letter-spacing: -0.3px;
      margin: 0 0 6px;
      color: #0a2949;
      position: relative;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .feature-desc {
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      line-height: 1.65;
      color: #4a6b8f;
      margin: 0;
      position: relative;
    }

    .roles-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .role-card {
      position: relative;
      padding: 24px 22px;
      border-radius: 8px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(240, 248, 255, 0.95) 45%,
          rgba(225, 240, 252, 0.97) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 3px 10px rgba(0, 30, 70, 0.12);
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .role-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 3%;
      right: 3%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 8px 8px 50% 50% / 8px 8px 35px 35px;
      pointer-events: none;
    }

    .role-card:hover {
      transform: translateY(-3px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 0 16px rgba(90, 160, 240, 0.55),
        0 8px 20px rgba(0, 30, 70, 0.18);
    }

    .role-client { border-top: 4px solid #1e6fd9; }
    .role-freelancer { border-top: 4px solid #d98a10; }

    .role-head {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
      position: relative;
    }

    .role-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
      color: #ffffff;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.7) 0%, transparent 45%),
        linear-gradient(180deg, #6cb8ff 0%, #1e6fd9 100%);
      border: 1px solid rgba(180, 220, 255, 0.7);
      box-shadow:
        inset 0 -2px 4px rgba(0, 30, 70, 0.35),
        0 3px 8px rgba(30, 90, 180, 0.35);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .role-freelancer .role-avatar {
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.7) 0%, transparent 45%),
        linear-gradient(180deg, #ffd47a 0%, #d98a10 100%);
      border-color: rgba(255, 220, 150, 0.7);
      color: #4a2a00;
      text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);
    }

    .role-title {
      font-family: 'Cairo', sans-serif;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.6px;
      margin: 0;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .role-desc {
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      line-height: 1.7;
      color: #4a6b8f;
      margin: 0 0 16px;
      position: relative;
    }

    .role-perks {
      list-style: none;
      padding: 0;
      margin: 0 0 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
    }

    .role-perk {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      color: #1e4a7a;
      font-weight: 600;
    }

    .role-perk-mark {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 900;
      color: #ffffff;
      flex-shrink: 0;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.6) 0%, transparent 45%),
        linear-gradient(180deg, #4a9eff 0%, #1e6fd9 100%);
      box-shadow:
        inset 0 -1px 2px rgba(0, 30, 70, 0.35),
        0 1px 3px rgba(30, 90, 180, 0.3);
    }

    .role-freelancer .role-perk-mark {
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.6) 0%, transparent 45%),
        linear-gradient(180deg, #ffd47a 0%, #d98a10 100%);
      color: #4a2a00;
    }

    .how-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .how-step {
      position: relative;
      padding: 20px 18px;
      border-radius: 6px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 45%,
          rgba(232, 242, 252, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 2px 6px rgba(0, 30, 70, 0.1);
      overflow: hidden;
    }

    .how-step::before {
      content: '';
      position: absolute;
      top: 0;
      left: 4%;
      right: 4%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 25px 25px;
      pointer-events: none;
    }

    .how-num {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cairo', sans-serif;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 14px;
      position: relative;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.75) 0%, transparent 45%),
        linear-gradient(180deg, #6cb8ff 0%, #1e6fd9 50%, #0f52a8 100%);
      border: 1px solid rgba(180, 220, 255, 0.75);
      box-shadow:
        inset 0 -3px 5px rgba(0, 30, 70, 0.35),
        inset 0 2px 3px rgba(255, 255, 255, 0.5),
        0 3px 8px rgba(30, 90, 180, 0.35);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .how-title {
      font-family: 'Cairo', sans-serif;
      font-size: 15.5px;
      font-weight: 800;
      letter-spacing: -0.3px;
      margin: 0 0 6px;
      color: #0a2949;
      position: relative;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .how-desc {
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      line-height: 1.65;
      color: #4a6b8f;
      margin: 0;
      position: relative;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .category-card {
      position: relative;
      padding: 16px 14px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 12px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.5);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 1px 3px rgba(0, 30, 70, 0.08);
      transition: all 0.15s ease;
      overflow: hidden;
      cursor: pointer;
    }

    .category-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 5%;
      right: 5%;
      height: 48%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 15px 15px;
      pointer-events: none;
    }

    .category-card:hover {
      border-color: var(--btn-border-2);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 0 10px rgba(90, 160, 240, 0.5),
        0 3px 8px rgba(0, 30, 70, 0.12);
      transform: translateY(-2px);
    }

    .category-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.9) 0%, transparent 45%),
        linear-gradient(180deg, #eaf4ff 0%, #c3daf6 100%);
      border: 1px solid rgba(120, 155, 195, 0.5);
      box-shadow:
        inset 0 -2px 4px rgba(0, 30, 70, 0.12),
        inset 0 1px 2px rgba(255, 255, 255, 0.9);
      position: relative;
    }

    .category-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
      position: relative;
      min-width: 0;
    }

    .category-name {
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 800;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .category-count {
      font-family: 'Cairo', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #6e8bab;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .testimonial-card {
      position: relative;
      padding: 18px 20px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 45%,
          rgba(232, 242, 252, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 2px 6px rgba(0, 30, 70, 0.1);
      overflow: hidden;
    }

    .testimonial-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 4%;
      right: 4%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 25px 25px;
      pointer-events: none;
    }

    .testimonial-stars {
      display: flex;
      gap: 2px;
      color: #f5a930;
      font-size: 14px;
      margin-bottom: 10px;
      position: relative;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7), 0 0 8px rgba(255, 180, 60, 0.5);
    }

    .testimonial-quote {
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      line-height: 1.7;
      color: #1e4a7a;
      margin: 0 0 16px;
      flex: 1;
      position: relative;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 10px;
      padding-top: 12px;
      border-top: 1px solid rgba(120, 155, 195, 0.3);
      position: relative;
    }

    .testimonial-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cairo', sans-serif;
      font-weight: 800;
      font-size: 15px;
      color: #ffffff;
      flex-shrink: 0;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.7) 0%, transparent 45%),
        linear-gradient(180deg, #6cb8ff 0%, #1e6fd9 100%);
      border: 1px solid rgba(180, 220, 255, 0.7);
      box-shadow:
        inset 0 -2px 3px rgba(0, 30, 70, 0.35),
        0 2px 6px rgba(30, 90, 180, 0.35);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .testimonial-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }

    .testimonial-name {
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 800;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .testimonial-role {
      font-family: 'Cairo', sans-serif;
      font-size: 11.5px;
      font-weight: 600;
      color: #6e8bab;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .faq-item {
      position: relative;
      border-radius: 6px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.5);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 1px 3px rgba(0, 30, 70, 0.08);
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .faq-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 4%;
      right: 4%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 20px 20px;
      pointer-events: none;
    }

    .faq-item:hover {
      border-color: var(--btn-border-2);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 0 10px rgba(90, 160, 240, 0.45);
    }

    .faq-btn {
      width: 100%;
      padding: 14px 18px;
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: inherit;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      position: relative;
    }

    .faq-q {
      font-family: 'Cairo', sans-serif;
      font-size: 14.5px;
      font-weight: 800;
      color: #0a2949;
      margin: 0;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
      flex: 1;
    }

    .faq-toggle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 900;
      color: #ffffff;
      flex-shrink: 0;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.7) 0%, transparent 45%),
        linear-gradient(180deg, #6cb8ff 0%, #1e6fd9 100%);
      border: 1px solid rgba(180, 220, 255, 0.7);
      box-shadow:
        inset 0 -2px 3px rgba(0, 30, 70, 0.35),
        0 2px 4px rgba(30, 90, 180, 0.3);
      text-shadow: 0 1px 1px rgba(0, 30, 70, 0.5);
    }

    .faq-a {
      padding: 0 18px 16px;
      margin: 0;
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      line-height: 1.75;
      color: #4a6b8f;
      position: relative;
      border-top: 1px dashed rgba(120, 155, 195, 0.35);
      padding-top: 12px;
    }

    .cta-block {
      position: relative;
      padding: 36px 32px;
      border-radius: 8px;
      text-align: center;
      overflow: hidden;
      background:
        linear-gradient(180deg,
          rgba(28, 62, 110, 0.94) 0%,
          rgba(18, 48, 92, 0.96) 50%,
          rgba(10, 35, 72, 0.98) 100%);
      border: 1px solid rgba(140, 190, 240, 0.5);
      box-shadow:
        inset 0 1px 0 rgba(180, 220, 255, 0.4),
        inset 0 -1px 0 rgba(0, 20, 50, 0.6),
        0 10px 30px rgba(5, 25, 60, 0.4);
    }

    .cta-block::before {
      content: '';
      position: absolute;
      top: 0;
      left: 8%;
      right: 8%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(180, 220, 255, 0.25) 0%,
        rgba(180, 220, 255, 0) 100%);
      border-radius: 8px 8px 50% 50% / 8px 8px 50px 50px;
      pointer-events: none;
    }

    .cta-inner {
      position: relative;
      z-index: 1;
    }

    .cta-title {
      font-family: 'Cairo', sans-serif;
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      font-weight: 900;
      letter-spacing: -1px;
      line-height: 1.15;
      margin: 0 0 12px;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0, 20, 50, 0.6);
    }

    .cta-title em {
      color: #ffd47a;
      font-style: normal;
      text-shadow: 0 0 20px rgba(255, 200, 100, 0.6);
    }

    .cta-sub {
      font-family: 'Cairo', sans-serif;
      font-size: 14.5px;
      color: #b8d4f0;
      max-width: 520px;
      margin: 0 auto 22px;
      line-height: 1.65;
    }

    .cta-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-actions .aero-btn {
      color: #ffffff;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.18) 0%,
          rgba(255, 255, 255, 0.06) 100%);
      border-color: rgba(180, 220, 255, 0.55);
    }

    .cta-actions .aero-btn:hover {
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.3) 0%,
          rgba(255, 255, 255, 0.12) 100%);
      border-color: rgba(200, 230, 255, 0.85);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.5),
        0 0 14px rgba(120, 180, 240, 0.7);
    }

    .cta-actions .aero-btn-amber {
      color: #4a2a00;
      background:
        linear-gradient(180deg,
          #ffd47a 0%,
          #f5a930 48%,
          #d98a10 50%,
          #b87008 100%);
      border-color: #8a4a00;
      text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);
    }

    .cta-actions .aero-btn-amber:hover {
      background:
        linear-gradient(180deg,
          #ffe090 0%,
          #ffbe50 48%,
          #e89828 50%,
          #c88008 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        0 0 18px rgba(255, 200, 100, 0.7);
    }

    .foot {
      position: relative;
      z-index: 2;
      padding: 22px 28px 20px;
      background:
        linear-gradient(180deg,
          rgba(228, 238, 248, 0.92) 0%,
          rgba(208, 224, 240, 0.92) 100%);
      border-top: 1px solid rgba(120, 155, 195, 0.5);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        inset 0 -1px 0 rgba(255, 255, 255, 0.3);
    }

    .foot-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(120, 155, 195, 0.35);
      margin-bottom: 16px;
    }

    .foot-tag {
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      line-height: 1.65;
      color: #4a6b8f;
      max-width: 320px;
      margin: 10px 0 0;
    }

    .foot-col-title {
      font-family: 'Cairo', sans-serif;
      font-size: 12px;
      font-weight: 800;
      color: #1e4a7a;
      margin: 0 0 10px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .foot-link {
      display: block;
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #4a6b8f;
      text-decoration: none;
      padding: 3px 0;
      transition: all 0.15s ease;
    }

    .foot-link:hover {
      color: #1e6fd9;
      text-shadow: 0 0 8px rgba(90, 160, 240, 0.5);
      padding-right: 4px;
    }

    .foot-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      font-family: 'Cairo', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: #6e8bab;
    }

    @media (max-width: 1024px) {
      .hero-grid { grid-template-columns: 1fr; gap: 22px; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .roles-grid { grid-template-columns: 1fr; }
      .how-grid { grid-template-columns: 1fr; }
      .categories-grid { grid-template-columns: repeat(2, 1fr); }
      .testimonials-grid { grid-template-columns: 1fr 1fr; }
      .foot-grid { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 640px) {
      .desktop { padding: 20px 12px 60px; }
      .aero-content { padding: 20px 16px 22px; }
      .stats-grid { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: 1fr; }
      .categories-grid { grid-template-columns: 1fr; }
      .testimonials-grid { grid-template-columns: 1fr; }
      .foot-grid { grid-template-columns: 1fr; gap: 20px; }
      .cta-block { padding: 28px 20px; }
      .toolbar-right { width: 100%; }
      .aero-btn { flex: 1; justify-content: center; }
      .win-ctrl { width: 26px; height: 20px; }
      .title-text { font-size: 12px; }
    }
  `
})
export class LandingPage implements OnInit, OnDestroy {
    public auth = inject(AuthService);
    readonly year = new Date().getFullYear();

    stats = signal<IStat[]>([
        { label: 'مهمة منشورة', value: '1,240', hint: 'إجمالي المهام النشطة' },
        { label: 'عرض مقدَّم', value: '8,410', hint: 'من فريلانسرز محترفين' },
        { label: 'فريلانسر نشط', value: '3,650', hint: 'في مختلف التخصصات' },
        { label: 'نسبة الرضا', value: '98.2%', hint: 'من أصحاب المهام' }
    ]);

    features = signal<IFeature[]>([
        { icon: '✎', title: 'نشر فوري للمهام', desc: 'انشر مهمتك في أقل من دقيقة مع تحديد الميزانية والمتطلبات بوضوح.' },
        { icon: '✉', title: 'عروض مباشرة', desc: 'استقبل عروضاً من فريلانسرز محترفين مع السعر ومدة التسليم والرسالة.' },
        { icon: '★', title: 'اختيار ذكي', desc: 'قارن العروض بسهولة واختر الأفضل بناءً على السعر والخبرة والتقييم.' },
        { icon: '✓', title: 'قبول تلقائي', desc: 'عند قبول عرض، يتم رفض باقي العروض تلقائياً وتتحول المهمة لـ قيد التنفيذ.' },
        { icon: '🔒', title: 'أمان متقدم', desc: 'مصادقة JWT مخزّنة في HttpOnly cookies مع صلاحيات دقيقة لكل دور.' },
        { icon: '✧', title: 'تجربة عربية أولاً', desc: 'واجهة RTL كاملة بخطوط عربية أنيقة وتجربة استخدام مصممة للمنطقة.' }
    ]);

    steps = signal<IStep[]>([
        { num: '1', title: 'انشر مهمتك', desc: 'حدد العنوان، الوصف، والميزانية. ينشر فوراً في السوق.' },
        { num: '2', title: 'استقبل العروض', desc: 'الفريلانسرز يقدمون عروضهم بالسعر والمدة والرسالة.' },
        { num: '3', title: 'اختر وابدأ', desc: 'قارن العروض، اقبل الأنسب، وابدأ التعاون مباشرة.' }
    ]);

    categories = signal<ICategory[]>([
        { icon: '🎨', name: 'تصميم', count: '240+ مهمة' },
        { icon: '💻', name: 'برمجة', count: '380+ مهمة' },
        { icon: '📢', name: 'تسويق', count: '175+ مهمة' },
        { icon: '✍️', name: 'كتابة', count: '210+ مهمة' },
        { icon: '🌐', name: 'ترجمة', count: '95+ مهمة' },
        { icon: '🎬', name: 'فيديو', count: '130+ مهمة' },
        { icon: '🎙️', name: 'صوتيات', count: '60+ مهمة' },
        { icon: '💼', name: 'استشارات', count: '85+ مهمة' }
    ]);

    testimonials = signal<ITestimonial[]>([
        { name: 'رؤى ياسر', role: 'صاحبة متجر', quote: 'لقيت مصمم محترف في يوم واحد فقط. جودة العمل كانت فوق التوقعات والسعر منطقي جداً.', initials: 'م', stars: 5 },
        { name: 'أحمد شفيق', role: 'مطور ويب', quote: 'أفضل منصة للفريلانسرز في المنطقة العربية. الواجهة سريعة والعروض تصل فوراً.', initials: 'أ', stars: 5 },
        { name: 'محمد طارق', role: 'كاتبة محتوى', quote: 'بدأت مع GigLink قبل سنة، واليوم عندي عملاء دائمين. النظام شفاف من الألف للياء.', initials: 'س', stars: 5 }
    ]);

    faqs = signal<IFaq[]>([
        { q: 'كيف تختلف GigLink عن المنصات الأخرى؟', a: 'منصة عربية أولاً بواجهة RTL كاملة، نظام عروض شفاف، وقبول تلقائي يرفض باقي العروض فور اختيار الأفضل. كل هذا ببنية .NET وAngular حديثة.' },
        { q: 'كم عمولة المنصة؟', a: 'خلال الفترة التجريبية، لا توجد أي عمولة. انشر مهامك أو قدّم عروضك مجاناً بالكامل وبدون أي رسوم خفية.' },
        { q: 'كيف يتم اختيار العرض الفائز؟', a: 'صاحب المهمة يقارن العروض بناءً على السعر، مدة التسليم، والرسالة. عند القبول، يتم رفض باقي العروض تلقائياً وتتحول المهمة لـ قيد التنفيذ.' },
        { q: 'هل يمكنني تقديم أكثر من عرض؟', a: 'كل فريلانسر يمكنه تقديم عرض واحد لكل مهمة. هذا يضمن جودة العروض ويقلل الضوضاء لأصحاب المهام.' },
        { q: 'ما الذي يحدث بعد قبول العرض؟', a: 'تتحول حالة المهمة إلى قيد التنفيذ، وتبدأ مرحلة التواصل المباشر مع الفريلانسر لإتمام المشروع.' },
        { q: 'هل بياناتي آمنة؟', a: 'نستخدم JWT مخزّن في HttpOnly cookies مع SameSite protection، وكل الاتصالات مشفرة HTTPS. لا نشارك بياناتك مع أي طرف ثالث.' }
    ]);

    openFaq = signal<number | null>(0);

    ngOnInit(): void { }

    ngOnDestroy(): void { }

    scrollTo(id: string): void {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    toggleFaq(index: number): void {
        this.openFaq.update(v => v === index ? null : index);
    }

    starsArray(rating: number): number[] {
        return Array(rating).fill(0);
    }
}