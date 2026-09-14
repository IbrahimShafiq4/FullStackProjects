import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { ActivityService } from '../../core/services/activity.service';
import { ChallengeService } from '../../core/services/challenge.service';
import { TestimonialService } from '../../core/services/testimonial.service';

interface IStat {
  number: string;
  value: string;
  label: string;
  sub: string;
}

interface IFeature {
  number: string;
  title: string;
  desc: string;
  icon: string;
}

interface IStep {
  number: string;
  title: string;
  desc: string;
  time: string;
}

interface IFreshness {
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  tone: 'olive' | 'orange' | 'muted';
}

interface IRecipe {
  title: string;
  category: string;
  uses: string[];
  time: string;
  difficulty: string;
  emoji: string;
}

interface IMyth {
  myth: string;
  truth: string;
  category: string;
}

interface IHudFighter {
  name: string;
  emoji: string;
  days: number;
  max: number;
  tone: 'olive' | 'orange' | 'danger';
}

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styles: `
    .magazine {
      min-height: 100vh;
      direction: rtl;
      text-align: start;
      color: var(--ink);
      background-color: var(--bg);
      background-image:
        linear-gradient(45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(-45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--bg-2) 75%),
        linear-gradient(-45deg, transparent 75%, var(--bg-2) 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      position: relative;
    }

    /* ═══════════ NAV ═══════════ */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--surface);
      border-bottom: 3px solid var(--ink);
      box-shadow: 0 4px 0 rgba(26, 28, 20, 0.12);
    }

    .nav-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--ink);
      flex-shrink: 0;
    }

    .brand-mark {
      width: 34px;
      height: 34px;
      background: var(--olive);
      color: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 24px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
    }

    .brand-texts {
      display: flex;
      flex-direction: column;
      line-height: 1;
      gap: 2px;
    }

    .brand-name {
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1;
    }

    .brand-tag {
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: var(--orange-2);
      line-height: 1;
    }

    .nav-links {
      display: flex;
      gap: 6px;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      padding: 6px 12px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--ink-2);
      text-decoration: none;
      background: transparent;
      border: 2px solid transparent;
      transition: all 0.1s steps(2);
      cursor: pointer;
      line-height: 1.2;
    }

    .nav-link:hover {
      background: var(--ink);
      color: var(--surface);
      border-color: var(--ink);
    }

    .nav-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
    }

    /* ═══════════ BUTTONS ═══════════ */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 16px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      background: var(--surface);
      color: var(--ink);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .btn-solid {
      background: var(--ink);
      color: var(--surface);
    }

    .btn-solid:hover {
      background: var(--olive);
      box-shadow: 4px 4px 0 var(--olive);
    }

    .btn-orange {
      background: var(--orange);
      color: var(--surface);
    }

    .btn-orange:hover {
      background: var(--orange-2);
    }

    .btn-lg {
      padding: 12px 22px;
      font-size: 17px;
    }

    /* ═══════════ CONTAINER ═══════════ */
    .wrap {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* ═══════════ HERO ═══════════ */
    .hero {
      padding: 32px 0 28px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px;
      background: var(--olive-soft);
      border: 2.5px solid var(--ink);
      font-family: var(--font-pixel-en);
      font-size: 16px;
      color: var(--olive-2);
      letter-spacing: 1px;
      line-height: 1;
      margin-bottom: 20px;
      box-shadow: 2px 2px 0 var(--ink);
    }

    .hero-badge-dot {
      width: 8px;
      height: 8px;
      background: var(--olive);
      animation: pixel-blink 1.4s steps(2) infinite;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 32px;
      align-items: start;
    }

    .hero-title {
      font-family: var(--font-pixel-ar);
      font-size: clamp(1.8rem, 4.2vw, 3.2rem);
      font-weight: 700;
      line-height: 1.25;
      margin: 0 0 18px;
      color: var(--ink);
      text-align: start;
    }

    .hero-title-line {
      display: block;
    }

    .hero-title em {
      font-style: normal;
      color: var(--olive);
    }

    .hero-title-mark {
      display: inline-block;
      padding: 2px 10px;
      background: var(--gold);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      color: var(--ink);
    }

    .hero-sub {
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      line-height: 1.9;
      color: var(--ink-2);
      max-width: 560px;
      margin: 0 0 24px;
      text-align: start;
    }

    .hero-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* ═══════════ HUD ═══════════ */
    .hud {
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 6px 6px 0 var(--ink);
      padding: 14px;
      position: relative;
    }

    .hud::before {
      content: '';
      position: absolute;
      top: -3px;
      right: -3px;
      width: 12px;
      height: 12px;
      background: var(--orange);
      border: 3px solid var(--ink);
    }

    .hud-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      margin-bottom: 12px;
      border-bottom: 3px dashed var(--ink);
    }

    .hud-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      font-weight: 700;
      color: var(--ink);
    }

    .hud-title-icon {
      width: 22px;
      height: 22px;
      background: var(--olive);
      color: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 16px;
      line-height: 1;
      border: 2px solid var(--ink);
    }

    .hud-live {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border: 2px solid var(--ink);
      background: var(--danger-soft);
      font-family: var(--font-pixel-en);
      font-size: 14px;
      color: var(--danger);
      letter-spacing: 1px;
      line-height: 1;
    }

    .hud-live-dot {
      width: 6px;
      height: 6px;
      background: var(--danger);
      animation: pixel-blink 1s steps(2) infinite;
    }

    .hud-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      margin-bottom: 4px;
      border: 2px solid var(--ink);
      background: var(--surface-2);
      transition: all 0.1s steps(2);
    }

    .hud-row:hover {
      transform: translate(-1px, -1px);
      box-shadow: 2px 2px 0 var(--ink);
    }

    .hud-emoji {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      border: 2px solid var(--ink);
      flex-shrink: 0;
    }

    .hud-emoji-olive { background: var(--olive-soft); }
    .hud-emoji-orange { background: var(--orange-soft); }
    .hud-emoji-danger { background: var(--danger-soft); }

    .hud-body {
      flex: 1;
      min-width: 0;
    }

    .hud-name {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 4px;
      text-align: start;
      line-height: 1.2;
    }

    .hud-bar {
      height: 10px;
      background: var(--surface-3);
      border: 1.5px solid var(--ink);
      position: relative;
      overflow: hidden;
    }

    .hud-bar::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(90deg,
        transparent 0,
        transparent 6px,
        rgba(26, 28, 20, 0.2) 6px,
        rgba(26, 28, 20, 0.2) 7px);
      z-index: 2;
    }

    .hud-bar-fill {
      height: 100%;
      transition: width 0.4s steps(6);
    }

    .hud-bar-olive { background: var(--olive); }
    .hud-bar-orange { background: var(--orange); }
    .hud-bar-danger { background: var(--danger); }

    .hud-days {
      font-family: var(--font-pixel-en);
      font-size: 18px;
      line-height: 1;
      padding: 4px 8px;
      border: 2px solid var(--ink);
      background: var(--surface);
      flex-shrink: 0;
      letter-spacing: 0.5px;
    }

    .hud-days-olive { color: var(--olive); }
    .hud-days-orange { color: var(--orange-2); }
    .hud-days-danger {
      color: var(--danger);
      animation: pixel-blink 1.2s steps(2) infinite;
    }

    /* ═══════════ PIXEL SCENE ═══════════ */
    .pixel-scene {
      position: relative;
      height: 90px;
      margin-top: 32px;
      overflow: hidden;
      background: linear-gradient(180deg,
        var(--sky) 0%,
        var(--sky) 65%,
        var(--sky-2) 65%,
        var(--sky-2) 100%);
      border-top: 4px solid var(--ink);
      border-bottom: 4px solid var(--ink);
      image-rendering: pixelated;
    }

    .scene-sun {
      position: absolute;
      top: 12px;
      left: 40px;
      width: 32px;
      height: 32px;
      background: var(--orange);
      box-shadow:
        -4px 0 0 var(--orange-2),
        4px 0 0 var(--orange-2),
        0 -4px 0 var(--orange-2),
        0 4px 0 var(--orange-2);
    }

    .scene-cloud {
      position: absolute;
      height: 12px;
      background: var(--surface);
      border: 2px solid var(--ink);
    }

    .cloud-1 {
      top: 16px;
      left: -100px;
      width: 44px;
      animation: cloud-scroll 40s linear infinite;
    }
    .cloud-1::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 8px;
      width: 24px;
      height: 8px;
      background: var(--surface);
      border: 2px solid var(--ink);
      border-bottom: none;
    }

    .cloud-2 {
      top: 34px;
      left: -100px;
      width: 56px;
      animation: cloud-scroll 55s linear infinite;
      animation-delay: -12s;
    }
    .cloud-2::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 12px;
      width: 32px;
      height: 8px;
      background: var(--surface);
      border: 2px solid var(--ink);
      border-bottom: none;
    }

    .cloud-3 {
      top: 8px;
      left: -100px;
      width: 32px;
      animation: cloud-scroll 65s linear infinite;
      animation-delay: -25s;
    }

    .scene-bird {
      position: absolute;
      top: 26px;
      left: -30px;
      width: 6px;
      height: 6px;
      background: var(--ink);
      animation: cloud-scroll 30s linear infinite;
    }
    .scene-bird::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -4px;
      width: 5px;
      height: 3px;
      background: var(--ink);
    }
    .scene-bird::after {
      content: '';
      position: absolute;
      top: -3px;
      right: -4px;
      width: 5px;
      height: 3px;
      background: var(--ink);
    }

    .scene-ground {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 22px;
      background: var(--grass);
      border-top: 3px solid var(--grass-2);
      background-image:
        repeating-linear-gradient(90deg,
          var(--grass-2) 0,
          var(--grass-2) 2px,
          transparent 2px,
          transparent 8px),
        repeating-linear-gradient(90deg,
          transparent 0,
          transparent 4px,
          var(--grass-2) 4px,
          var(--grass-2) 6px);
      background-size: 8px 100%, 16px 100%;
    }

    /* ═══════════ SECTION ═══════════ */
    .section {
      padding: 40px 0 24px;
    }

    .section-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      padding-bottom: 14px;
      margin-bottom: 24px;
      border-bottom: 3px solid var(--ink);
      flex-wrap: wrap;
      text-align: start;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 10px;
      background: var(--ink);
      color: var(--surface);
      border: 2px solid var(--ink);
      font-family: var(--font-pixel-en);
      font-size: 16px;
      line-height: 1;
      letter-spacing: 1px;
    }

    .section-number-em {
      color: var(--gold);
      font-size: 18px;
    }

    .section-title {
      font-family: var(--font-pixel-ar);
      font-size: clamp(1.6rem, 3.2vw, 2.4rem);
      font-weight: 700;
      line-height: 1.2;
      margin: 8px 0 0;
      color: var(--ink);
      text-align: start;
    }

    .section-title em {
      font-style: normal;
      color: var(--olive);
    }

    .section-desc {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      line-height: 1.8;
      color: var(--muted);
      margin: 6px 0 0;
      max-width: 460px;
      text-align: start;
    }

    /* ═══════════ STATS ═══════════ */
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .stat {
      padding: 14px 12px;
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      transition: all 0.1s steps(2);
      text-align: start;
    }

    .stat:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 var(--ink);
    }

    .stat-number {
      display: inline-block;
      padding: 2px 6px;
      background: var(--gold);
      border: 2px solid var(--ink);
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: var(--ink);
      line-height: 1;
      margin-bottom: 8px;
    }

    .stat-value {
      font-family: var(--font-pixel-en);
      font-size: 46px;
      line-height: 0.9;
      color: var(--ink);
      display: block;
      margin-bottom: 6px;
    }

    .stat-label {
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      font-weight: 700;
      color: var(--ink);
      display: block;
      margin-bottom: 2px;
      line-height: 1.3;
    }

    .stat-sub {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      color: var(--muted);
      line-height: 1.5;
    }

    /* ═══════════ FRESHNESS ═══════════ */
    .freshness {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .fresh-card {
      padding: 18px 16px;
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      text-align: start;
    }

    .fresh-card::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      width: 12px;
      height: 12px;
      border: 3px solid var(--ink);
    }

    .fresh-olive::before { background: var(--olive); }
    .fresh-orange::before { background: var(--orange); }
    .fresh-muted::before { background: var(--muted-2); }

    .fresh-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      background: var(--surface-2);
      border: 2px solid var(--ink);
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: var(--ink);
      letter-spacing: 0.5px;
      line-height: 1;
      align-self: flex-start;
    }

    .fresh-tag-dot {
      width: 8px;
      height: 8px;
    }

    .fresh-olive .fresh-tag-dot { background: var(--olive); }
    .fresh-orange .fresh-tag-dot { background: var(--orange); }
    .fresh-muted .fresh-tag-dot { background: var(--muted-2); }

    .fresh-icon {
      font-size: 40px;
      line-height: 1;
      margin: 4px 0;
    }

    .fresh-title {
      font-family: var(--font-pixel-ar);
      font-size: 22px;
      font-weight: 700;
      line-height: 1.2;
      color: var(--ink);
      margin: 0;
    }

    .fresh-subtitle {
      font-family: var(--font-pixel-en);
      font-size: 18px;
      color: var(--muted);
      line-height: 1;
      margin: -6px 0 0;
      letter-spacing: 1px;
    }

    .fresh-desc {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      line-height: 1.75;
      color: var(--ink-2);
      margin: 0;
      padding-top: 10px;
      border-top: 2px dashed var(--ink);
    }

    /* ═══════════ FEATURES ═══════════ */
    .features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .feature {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px 14px;
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      transition: all 0.1s steps(2);
      text-align: start;
    }

    .feature:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 var(--ink);
      background: var(--olive-soft);
    }

    .feature-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .feature-icon {
      width: 36px;
      height: 36px;
      background: var(--gold);
      border: 2px solid var(--ink);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .feature-number {
      font-family: var(--font-pixel-en);
      font-size: 24px;
      line-height: 1;
      color: var(--orange-2);
    }

    .feature-title {
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      font-weight: 700;
      line-height: 1.35;
      color: var(--ink);
      margin: 0;
    }

    .feature-desc {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      line-height: 1.75;
      color: var(--muted);
      margin: 0;
    }

    /* ═══════════ STEPS ═══════════ */
    .steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .step {
      padding: 16px 14px;
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: start;
    }

    .step-num-block {
      width: 48px;
      height: 48px;
      background: var(--orange);
      color: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 32px;
      line-height: 1;
    }

    .step:nth-child(2n) .step-num-block { background: var(--olive); }
    .step:nth-child(3n) .step-num-block {
      background: var(--gold);
      color: var(--ink);
    }

    .step-title {
      font-family: var(--font-pixel-ar);
      font-size: 18px;
      font-weight: 700;
      color: var(--ink);
      margin: 0;
      line-height: 1.3;
    }

    .step-desc {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      line-height: 1.75;
      color: var(--muted);
      margin: 0;
    }

    .step-time {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      background: var(--ink);
      color: var(--surface);
      font-family: var(--font-pixel-en);
      font-size: 15px;
      line-height: 1;
      letter-spacing: 1px;
      align-self: flex-start;
      margin-top: auto;
    }

    /* ═══════════ RECIPES ═══════════ */
    .recipes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .recipe {
      display: flex;
      flex-direction: column;
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      overflow: hidden;
      text-align: start;
    }

    .recipe:hover {
      transform: translate(-3px, -3px);
      box-shadow: 7px 7px 0 var(--ink);
    }

    .recipe-hero {
      aspect-ratio: 16 / 9;
      background: repeating-linear-gradient(45deg,
        var(--surface-2) 0,
        var(--surface-2) 8px,
        var(--olive-soft) 8px,
        var(--olive-soft) 16px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 56px;
      line-height: 1;
      border-bottom: 2.5px solid var(--ink);
      position: relative;
    }

    .recipe:nth-child(2n) .recipe-hero {
      background: repeating-linear-gradient(45deg,
        var(--surface-2) 0,
        var(--surface-2) 8px,
        var(--orange-soft) 8px,
        var(--orange-soft) 16px);
    }

    .recipe:nth-child(3n) .recipe-hero {
      background: repeating-linear-gradient(45deg,
        var(--surface-2) 0,
        var(--surface-2) 8px,
        var(--gold-soft) 8px,
        var(--gold-soft) 16px);
    }

    .recipe-category {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 3px 8px;
      background: var(--ink);
      color: var(--surface);
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      line-height: 1.4;
      font-weight: 700;
    }

    .recipe-body {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .recipe-title {
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      font-weight: 700;
      color: var(--ink);
      margin: 0;
      line-height: 1.35;
    }

    .recipe-uses {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .recipe-tag {
      padding: 2px 8px;
      background: var(--surface-2);
      border: 1.5px solid var(--ink);
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      color: var(--ink-2);
      font-weight: 700;
    }

    .recipe-meta {
      display: flex;
      justify-content: space-between;
      padding-top: 8px;
      border-top: 2px dashed var(--ink-2);
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: var(--muted);
      line-height: 1;
      margin-top: auto;
    }

    /* ═══════════ PULSE ═══════════ */
    .pulse {
      background: var(--ink);
      color: var(--surface);
      padding: 24px 0;
      overflow: hidden;
      border-top: 4px solid var(--ink);
      border-bottom: 4px solid var(--ink);
      margin-top: 40px;
      position: relative;
    }

    .pulse::before,
    .pulse::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 4px;
      background-image: repeating-linear-gradient(90deg,
        var(--gold) 0,
        var(--gold) 8px,
        transparent 8px,
        transparent 16px);
    }

    .pulse::before { top: 4px; }
    .pulse::after { bottom: 4px; }

    .pulse-head {
      max-width: 1280px;
      margin: 0 auto 14px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .pulse-title {
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      color: var(--surface);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pulse-title em {
      font-style: normal;
      color: var(--gold);
    }

    .pulse-live {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border: 2px solid var(--surface);
      background: var(--danger);
      font-family: var(--font-pixel-en);
      font-size: 14px;
      color: var(--surface);
      line-height: 1;
      letter-spacing: 1px;
    }

    .pulse-live-dot {
      width: 6px;
      height: 6px;
      background: var(--surface);
      animation: pixel-blink 1s steps(2) infinite;
    }

    .pulse-hint {
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: rgba(255, 255, 255, 0.55);
      letter-spacing: 1px;
    }

    .pulse-track-wrap {
      overflow: hidden;
    }

    .pulse-track {
      display: flex;
      gap: 12px;
      width: max-content;
      padding: 4px 20px;
      animation: cloud-scroll 60s linear infinite;
    }

    .pulse-track-wrap:hover .pulse-track {
      animation-play-state: paused;
    }

    .pulse-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border: 2px solid var(--surface);
      min-width: 320px;
      flex-shrink: 0;
      transition: all 0.1s steps(2);
    }

    .pulse-item:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translate(-2px, -2px);
      box-shadow: 3px 3px 0 var(--gold);
    }

    .pulse-avatar {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-ar);
      font-size: 18px;
      font-weight: 700;
      background: var(--orange);
      color: var(--surface);
      border: 2px solid var(--surface);
      flex-shrink: 0;
    }

    .pulse-content {
      flex: 1;
      min-width: 0;
      text-align: start;
    }

    .pulse-user {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--surface);
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .pulse-city {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      color: rgba(255, 255, 255, 0.55);
      font-weight: 400;
    }

    .pulse-action {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.5;
    }

    .pulse-time {
      font-family: var(--font-pixel-en);
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      flex-shrink: 0;
      line-height: 1;
    }

    .pulse-empty {
      max-width: 1280px;
      margin: 0 auto;
      padding: 24px 20px;
      text-align: center;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      color: rgba(255, 255, 255, 0.4);
    }

    /* ═══════════ VOICE ═══════════ */
    .voice {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: center;
    }

    .voice-content h3 {
      font-family: var(--font-pixel-ar);
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: 700;
      line-height: 1.2;
      color: var(--ink);
      margin: 0 0 14px;
      text-align: start;
    }

    .voice-content h3 em {
      font-style: normal;
      color: var(--orange-2);
    }

    .voice-content p {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      line-height: 1.8;
      color: var(--muted);
      margin: 0 0 20px;
      max-width: 480px;
      text-align: start;
    }

    .voice-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .voice-list-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      color: var(--ink-2);
      padding: 8px 10px;
      background: var(--surface);
      border: 2px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      text-align: start;
    }

    .voice-list-number {
      font-family: var(--font-pixel-en);
      font-size: 20px;
      color: var(--orange-2);
      flex-shrink: 0;
      line-height: 1;
    }

    .voice-player {
      padding: 20px 18px;
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 6px 6px 0 var(--ink);
      position: relative;
    }

    .voice-player::before {
      content: '';
      position: absolute;
      top: -3px;
      right: -3px;
      width: 12px;
      height: 12px;
      background: var(--orange);
      border: 3px solid var(--ink);
    }

    .voice-player-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      margin-bottom: 12px;
      border-bottom: 2px dashed var(--ink);
    }

    .voice-player-label {
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: var(--muted);
      line-height: 1;
    }

    .voice-player-time {
      font-family: var(--font-pixel-en);
      font-size: 24px;
      color: var(--ink);
      line-height: 1;
    }

    .voice-wave {
      display: flex;
      align-items: center;
      gap: 2px;
      height: 60px;
      margin-bottom: 14px;
      padding: 4px;
      background: var(--surface-2);
      border: 2px solid var(--ink);
    }

    .voice-wave span {
      flex: 1;
      background: var(--ink);
    }

    .voice-wave span:nth-child(3n) { background: var(--orange); }
    .voice-wave span:nth-child(5n) { background: var(--olive); }

    .voice-play {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--ink);
      color: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .voice-play:hover {
      background: var(--orange);
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    /* ═══════════ MYTHS ═══════════ */
    .myths {
      display: flex;
      flex-direction: column;
      gap: 0;
      border-top: 3px solid var(--ink);
    }

    .myth {
      padding: 18px 0;
      border-bottom: 2px solid var(--ink-2);
      display: grid;
      grid-template-columns: 56px 1fr auto;
      gap: 16px;
      align-items: start;
      cursor: pointer;
      transition: padding 0.15s steps(2);
      text-align: start;
    }

    .myth:hover {
      padding-right: 10px;
      background: var(--surface);
    }

    .myth-num {
      font-family: var(--font-pixel-en);
      font-size: 32px;
      color: var(--orange-2);
      line-height: 1;
      padding-top: 4px;
      text-align: center;
    }

    .myth-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: start;
    }

    .myth-category {
      display: inline-block;
      padding: 2px 8px;
      background: var(--ink);
      color: var(--surface);
      font-family: var(--font-pixel-en);
      font-size: 14px;
      letter-spacing: 1px;
      line-height: 1.4;
      align-self: flex-start;
    }

    .myth-title {
      font-family: var(--font-pixel-ar);
      font-size: clamp(1.1rem, 2vw, 1.4rem);
      font-weight: 700;
      line-height: 1.4;
      color: var(--ink);
      margin: 0;
    }

    .myth-answer {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      line-height: 1.8;
      color: var(--muted);
      margin: 4px 0 0;
      max-width: 720px;
      padding: 10px 12px;
      background: var(--surface);
      border: 2px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      animation: fade-up 0.2s steps(4);
    }

    .myth-answer strong {
      color: var(--olive);
      font-weight: 700;
    }

    .myth-toggle {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid var(--ink);
      background: var(--surface);
      font-family: var(--font-pixel-en);
      font-size: 30px;
      color: var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      transition: all 0.1s steps(2);
      flex-shrink: 0;
      line-height: 1;
      cursor: pointer;
    }

    .myth-toggle:hover {
      background: var(--ink);
      color: var(--surface);
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    /* ═══════════ CHALLENGE ═══════════ */
    .challenge {
      background: var(--olive);
      color: var(--surface);
      padding: 32px 24px;
      border: 3px solid var(--ink);
      box-shadow: 6px 6px 0 var(--ink);
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 32px;
      align-items: center;
      position: relative;
      text-align: start;
    }

    .challenge::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background-image: repeating-linear-gradient(90deg,
        var(--gold) 0,
        var(--gold) 6px,
        transparent 6px,
        transparent 12px);
    }

    .challenge-content h3 {
      font-family: var(--font-pixel-ar);
      font-size: clamp(1.5rem, 2.6vw, 2rem);
      font-weight: 700;
      line-height: 1.2;
      color: var(--surface);
      margin: 0 0 12px;
    }

    .challenge-content h3 em {
      font-style: normal;
      color: var(--gold);
    }

    .challenge-desc {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.85);
      margin: 0 0 16px;
      max-width: 460px;
    }

    .challenge-reward {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: var(--ink);
      border: 2.5px solid var(--gold);
      font-family: var(--font-pixel-en);
      font-size: 17px;
      color: var(--gold);
      letter-spacing: 1px;
      line-height: 1;
    }

    .challenge-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 22px;
      margin-top: 16px;
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      font-weight: 700;
      color: var(--ink);
      background: var(--gold);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      text-decoration: none;
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .challenge-cta:hover {
      transform: translate(-1px, -1px);
      box-shadow: 5px 5px 0 var(--ink);
      background: #d8a838;
    }

    .challenge-cta:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .challenge-progress {
      background: rgba(0, 0, 0, 0.25);
      padding: 16px;
      border: 2.5px solid var(--ink);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .challenge-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .challenge-days {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .challenge-days-num {
      font-family: var(--font-pixel-en);
      font-size: 60px;
      line-height: 0.9;
      color: var(--gold);
    }

    .challenge-days-label {
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1;
    }

    .challenge-count {
      font-family: var(--font-pixel-en);
      font-size: 20px;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1;
    }

    .challenge-bar {
      height: 10px;
      background: rgba(0, 0, 0, 0.4);
      border: 2px solid var(--ink);
      overflow: hidden;
      position: relative;
    }

    .challenge-bar-fill {
      height: 100%;
      background: var(--gold);
      transition: width 0.4s steps(6);
    }

    .challenge-dots {
      display: flex;
      justify-content: space-between;
      gap: 4px;
    }

    .challenge-dot {
      flex: 1;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 20px;
      border: 2px solid var(--ink);
      background: rgba(0, 0, 0, 0.3);
      color: rgba(255, 255, 255, 0.4);
      line-height: 1;
    }

    .challenge-dot.done {
      background: var(--gold);
      color: var(--ink);
    }

    .challenge-dot.today {
      background: var(--ink);
      color: var(--gold);
      border-color: var(--gold);
    }

    /* ═══════════ WINNERS ═══════════ */
    .winners {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      align-items: end;
    }

    .winner {
      position: relative;
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 6px 6px 0 var(--ink);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.1s steps(2);
    }

    .winner:hover {
      transform: translate(-2px, -2px);
      box-shadow: 8px 8px 0 var(--ink);
    }

    .winner-1 {
      order: 2;
      border-color: var(--gold);
      box-shadow: 6px 6px 0 var(--gold);
    }

    .winner-2 {
      order: 1;
      border-color: #b8b8b8;
      box-shadow: 6px 6px 0 #b8b8b8;
    }

    .winner-3 {
      order: 3;
      border-color: #b87333;
      box-shadow: 6px 6px 0 #b87333;
    }

    .winner-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 14px;
      font-family: var(--font-pixel-en);
      font-size: 20px;
      letter-spacing: 1px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      z-index: 3;
      font-weight: 700;
    }

    .winner-badge-1 {
      background: var(--gold);
      color: var(--ink);
      animation: pixel-blink 2s steps(2) infinite;
    }

    .winner-badge-2 {
      background: #d8d8d8;
      color: var(--ink);
    }

    .winner-badge-3 {
      background: #d4a373;
      color: var(--ink);
    }

    .winner-photo {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      image-rendering: pixelated;
      border-bottom: 3px solid var(--ink);
      background: var(--surface-2);
      display: block;
    }

    .winner-photo-empty {
      width: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 64px;
      background: var(--surface-2);
      border-bottom: 3px solid var(--ink);
      color: var(--muted-2);
    }

    .winner-body {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: start;
      flex: 1;
    }

    .winner-user {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .winner-avatar {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      font-weight: 700;
      border: 2px solid var(--ink);
      flex-shrink: 0;
    }

    .winner-1 .winner-avatar { background: var(--gold); color: var(--ink); }
    .winner-2 .winner-avatar { background: #b8b8b8; color: var(--ink); }
    .winner-3 .winner-avatar { background: #b87333; color: var(--surface); }

    .winner-name {
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1.2;
      margin: 0;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .winner-caption {
      font-family: var(--font-pixel-ar);
      font-size: 13.5px;
      line-height: 1.65;
      color: var(--muted);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .winner-rank-label {
      font-family: var(--font-pixel-en);
      font-size: 15px;
      letter-spacing: 1.5px;
      padding-top: 8px;
      border-top: 2px dashed var(--ink);
      text-align: center;
      margin-top: auto;
    }

    .winner-1 .winner-rank-label { color: var(--gold-2); }
    .winner-2 .winner-rank-label { color: #8a8a8a; }
    .winner-3 .winner-rank-label { color: #8a5420; }

    .winners-empty {
      grid-column: 1 / -1;
      padding: 50px 30px;
      text-align: center;
      border: 3px dashed var(--ink);
      background: var(--surface);
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      color: var(--muted);
      line-height: 1.7;
    }

    .winners-empty-icon {
      font-size: 56px;
      display: block;
      margin-bottom: 14px;
      line-height: 1;
    }

    /* ═══════════ TESTIMONIALS ═══════════ */
    .testimonials {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .testimonial {
      padding: 16px 14px;
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: start;
    }

    .testimonial-mark {
      font-family: var(--font-pixel-en);
      font-size: 52px;
      line-height: 0.5;
      color: var(--orange);
      margin-bottom: 6px;
    }

    .testimonial-quote {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      line-height: 1.8;
      color: var(--ink-2);
      margin: 0;
      flex: 1;
    }

    .testimonial-author {
      padding-top: 10px;
      border-top: 2px dashed var(--ink);
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .testimonial-name {
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1.2;
    }

    .testimonial-role {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      color: var(--muted);
      line-height: 1.4;
    }

    .empty-testimonials {
      grid-column: 1 / -1;
      padding: 40px 20px;
      text-align: center;
      border: 3px dashed var(--ink);
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      color: var(--muted);
      background: var(--surface);
      line-height: 1.6;
    }

    /* ═══════════ CTA ═══════════ */
    .cta {
      padding: 40px 24px;
      text-align: center;
      background: var(--ink);
      color: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 8px 8px 0 var(--ink);
      position: relative;
    }

    .cta::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background-image: repeating-linear-gradient(90deg,
        var(--gold) 0,
        var(--gold) 6px,
        transparent 6px,
        transparent 12px);
    }

    .cta-kicker {
      display: inline-block;
      padding: 4px 10px;
      background: var(--orange);
      color: var(--surface);
      font-family: var(--font-pixel-en);
      font-size: 16px;
      letter-spacing: 1.5px;
      line-height: 1;
      margin-bottom: 14px;
    }

    .cta-title {
      font-family: var(--font-pixel-ar);
      font-size: clamp(1.6rem, 3.4vw, 2.6rem);
      font-weight: 700;
      line-height: 1.25;
      color: var(--surface);
      margin: 0 0 14px;
    }

    .cta-title em {
      font-style: normal;
      color: var(--gold);
    }

    .cta-desc {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.75);
      margin: 0 0 24px;
      max-width: 520px;
      margin-inline: auto;
    }

    .cta-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta .btn {
      background: var(--surface);
      color: var(--ink);
      border-color: var(--gold);
      box-shadow: 3px 3px 0 var(--gold);
    }

    .cta .btn:hover {
      box-shadow: 4px 4px 0 var(--gold);
    }

    .cta .btn-solid {
      background: var(--gold);
      color: var(--ink);
    }

    /* ═══════════ FOOTER ═══════════ */
    .footer {
      margin-top: 40px;
      background: var(--ink);
      color: var(--surface);
      padding: 28px 20px 20px;
      border-top: 4px solid var(--ink);
      position: relative;
      text-align: start;
    }

    .footer::before {
      content: '';
      position: absolute;
      top: -4px;
      left: 0;
      right: 0;
      height: 4px;
      background-image: repeating-linear-gradient(90deg,
        var(--gold) 0,
        var(--gold) 8px,
        transparent 8px,
        transparent 16px);
    }

    .footer-inner {
      max-width: 1280px;
      margin: 0 auto;
    }

    .footer-top {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 28px;
      padding-bottom: 20px;
      border-bottom: 2px dashed rgba(255, 255, 255, 0.15);
      margin-bottom: 16px;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .footer-brand-mark {
      width: 32px;
      height: 32px;
      background: var(--olive);
      color: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 22px;
      line-height: 1;
      border: 2px solid var(--surface);
    }

    .footer-brand-name {
      font-family: var(--font-pixel-ar);
      font-size: 22px;
      font-weight: 700;
      color: var(--surface);
    }

    .footer-brand-tag {
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: var(--gold);
      letter-spacing: 1.5px;
      line-height: 1;
      margin-bottom: 12px;
    }

    .footer-tag {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.65);
      max-width: 340px;
      margin: 0;
    }

    .footer-col-title {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--surface);
      margin: 0 0 10px;
    }

    .footer-link {
      display: block;
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      padding: 4px 0;
      transition: all 0.1s steps(2);
    }

    .footer-link:hover {
      color: var(--gold);
      padding-right: 6px;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      font-family: var(--font-pixel-en);
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 1px;
    }

    [data-reveal] {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.4s steps(6), transform 0.4s steps(6);
    }

    [data-reveal].revealed {
      opacity: 1;
      transform: translateY(0);
    }

    @media (max-width: 1024px) {
      .nav-links { display: none; }
      .hero-grid { grid-template-columns: 1fr; gap: 24px; }
      .stats { grid-template-columns: repeat(2, 1fr); }
      .freshness { grid-template-columns: 1fr; }
      .features { grid-template-columns: repeat(2, 1fr); }
      .steps { grid-template-columns: 1fr; }
      .recipes { grid-template-columns: 1fr; }
      .voice { grid-template-columns: 1fr; gap: 20px; }
      .myth { grid-template-columns: 46px 1fr auto; gap: 12px; }
      .challenge { grid-template-columns: 1fr; gap: 20px; padding: 24px 18px; }
      .winners { grid-template-columns: 1fr; }
      .winner-1, .winner-2, .winner-3 { order: 0; }
      .testimonials { grid-template-columns: 1fr; }
      .footer-top { grid-template-columns: 1fr 1fr; gap: 20px; }
    }

    @media (max-width: 640px) {
      .nav-inner { padding: 8px 14px; }
      .brand-name { font-size: 17px; }
      .brand-tag { font-size: 13px; }
      .brand-mark { width: 28px; height: 28px; font-size: 20px; }
      .nav-actions .btn { padding: 6px 12px; font-size: 13px; }
      .wrap { padding: 0 14px; }
      .hero { padding: 24px 0 20px; }
      .hero-title { font-size: 1.8rem; }
      .hero-sub { font-size: 15px; }
      .hero-actions { flex-direction: column; align-items: stretch; }
      .hero-actions .btn { justify-content: center; }
      .section { padding: 28px 0 16px; }
      .section-head { flex-direction: column; align-items: flex-start; }
      .stats { grid-template-columns: 1fr; }
      .stat-value { font-size: 38px; }
      .features { grid-template-columns: 1fr; }
      .myth {
        grid-template-columns: 1fr;
        gap: 8px;
        padding: 14px 0;
        position: relative;
      }
      .myth-num { padding-top: 0; text-align: right; font-size: 26px; }
      .myth-toggle {
        position: absolute;
        left: 0;
        top: 14px;
        width: 38px;
        height: 38px;
        font-size: 24px;
      }
      .challenge-days-num { font-size: 44px; }
      .challenge-dot { height: 30px; font-size: 16px; }
      .footer-top { grid-template-columns: 1fr; gap: 16px; }
      .footer { padding: 24px 14px 16px; }
      .cta { padding: 28px 16px; }
      .footer-bottom { flex-direction: column; text-align: center; }
      .pulse-item { min-width: 260px; }
      .pixel-scene { height: 70px; }
      .scene-sun { width: 24px; height: 24px; top: 8px; left: 20px; }
    }
  `
})
export class LandingPage implements OnInit, OnDestroy {
  public auth = inject(AuthService);
  public activity = inject(ActivityService);
  public challengeService = inject(ChallengeService);
  public testimonialService = inject(TestimonialService);

  readonly year = new Date().getFullYear();

  stats = signal<IStat[]>([
    { number: '01', value: '12,480', label: 'منتج مسجَّل', sub: 'في مطابخ 42 مدينة' },
    { number: '02', value: '3,240', label: 'ملاحظة صوتية', sub: 'مسجَّلة هذا الشهر' },
    { number: '03', value: '1,890', label: 'وصفة فيديو', sub: 'من بقايا الأكل' },
    { number: '04', value: '94%', label: 'تقليل الهدر', sub: 'للمستخدمين النشطين' }
  ]);

  freshness = signal<IFreshness[]>([
    {
      tag: 'FRESH',
      title: 'طازة',
      subtitle: 'VICTORIOUS',
      tone: 'olive',
      desc: 'عندك وقت كافي. المنتج في أفضل حالاته، واستخدامه بيمنحك أطباق ممتازة في أي وقت.'
    },
    {
      tag: 'URGENT',
      title: 'قربت تخلص',
      subtitle: 'EXPIRING SOON',
      tone: 'orange',
      desc: 'باقي 3 أيام أو أقل. الوقت مثالي لطبخة إبداعية، أو لتفريز المنتج قبل ما يفسد.'
    },
    {
      tag: 'WASTED',
      title: 'خلصت',
      subtitle: 'EXPIRED',
      tone: 'muted',
      desc: 'فاتت صلاحيته. هنبّهك عشان تتعلم من التجربة وتستهلك بشكل أذكى المرة الجاية.'
    }
  ]);

  features = signal<IFeature[]>([
    { number: '01', icon: '📦', title: 'تتبُّع لحظي', desc: 'سجِّل كل منتج في ثوانٍ — اسم، كمية، تاريخ. اعرف حالته من لقطة واحدة.' },
    { number: '02', icon: '🎙️', title: 'ملاحظات صوتية', desc: 'سجِّل ملاحظة سريعة بدل ما تكتب. مثالية لما إيدك تكون مليانة شغل في المطبخ.' },
    { number: '03', icon: '⏰', title: 'تنبيهات ذكية', desc: 'قبل ما يخلص الأكل بثلاث أيام، هنبّهك عشان تستخدمه بدل ما يترمي.' },
    { number: '04', icon: '📸', title: 'معرض الصور', desc: 'صورة واحدة لكل منتج كافية — تعرف الباقي بحسب كمية وتاريخ سريع.' },
    { number: '05', icon: '🍲', title: 'اقتراحات وصفات', desc: 'هنقترحلك وصفات من المنتجات اللي قربت تخلص، بناءً على اللي عندك فعلاً.' },
    { number: '06', icon: '📊', title: 'إحصائيات شهرية', desc: 'شوف كام أكل اترمي الشهر ده، وحدد هدف حقيقي لتقليل الهدر.' }
  ]);

  steps = signal<IStep[]>([
    { number: '1', title: 'أضف المنتج', desc: 'اسم، كمية، تاريخ انتهاء — وصورة لو حابب. في أقل من 30 ثانية.', time: '30 SEC' },
    { number: '2', title: 'تابع الحالة', desc: 'التطبيق يحسب الأيام المتبقية ويصنّف المنتج تلقائياً بحسب حالته.', time: 'LIVE' },
    { number: '3', title: 'اطبخ واستمتع', desc: 'شوف الوصفات المقترحة، واستخدم اللي عندك قبل ما يفسد.', time: 'DAILY' }
  ]);

  recipes = signal<IRecipe[]>([
    { title: 'شكشوكة الطماطم', category: 'فطور', uses: ['طماطم', 'بيض', 'بصل'], time: '15 MIN', difficulty: 'EASY', emoji: '🍅' },
    { title: 'سلطة الفواكه', category: 'حلويات', uses: ['موز', 'تفاح', 'برتقال'], time: '10 MIN', difficulty: 'EASY', emoji: '🍓' },
    { title: 'مكرونة بالجبنة', category: 'غداء', uses: ['مكرونة', 'جبنة', 'لبن'], time: '20 MIN', difficulty: 'MEDIUM', emoji: '🍝' }
  ]);

  myths = signal<IMyth[]>([
    {
      category: 'STORAGE',
      myth: 'الطماطم لازم تتحفظ في التلاجة عشان تفضل طازة',
      truth: 'التلاجة بتخلي الطماطم تفقد طعمها الطبيعي وتبوظ أسرع. الأنسب تخزينها في مكان جاف بعيد عن الشمس في درجة حرارة الغرفة.'
    },
    {
      category: 'STORAGE',
      myth: 'البيض بيتحفظ في باب التلاجة',
      truth: 'باب التلاجة أدفأ مكان وأكتر عرضة لتغيرات الحرارة. الأنسب تحفظ البيض في الرف الأوسط عشان يدوم أطول.'
    },
    {
      category: 'FRUITS',
      myth: 'كل الفواكه بتتحفظ في التلاجة',
      truth: 'الموز والأفوكادو والمانجو لازم تفضل برا التلاجة لحد ما تنضج. بعد كده تقدر تدخلها عشان توقف النضج.'
    },
    {
      category: 'BAKERY',
      myth: 'الخبز بيتحفظ في التلاجة عشان ميبوظش',
      truth: 'التلاجة بتنشف الخبز بدل ما تحفظه. الأنسب تحفظه في الفريزر في كيس محكم، وتشيّحه على وقت الحاجة.'
    },
    {
      category: 'DAIRY',
      myth: 'اللبن يتحفظ في باب التلاجة',
      truth: 'زي البيض، باب التلاجة أدفأ مكان. اللبن يفضل في الرف الوسط أو السفلي عشان يحفظ نضارته أطول.'
    },
    {
      category: 'VEGGIES',
      myth: 'البصل والبطاطس يتخزنوا مع بعض',
      truth: 'البصل بيخرج غاز بيخلي البطاطس تنبت بسرعة. خزّن كل واحد لوحده في مكان مظلم وجاف.'
    }
  ]);

  hudFighters = signal<IHudFighter[]>([
    { name: 'طماطم', emoji: '🍅', days: 5, max: 7, tone: 'olive' },
    { name: 'لبن', emoji: '🥛', days: 2, max: 7, tone: 'orange' },
    { name: 'بيض', emoji: '🥚', days: 8, max: 14, tone: 'olive' },
    { name: 'عيش', emoji: '🍞', days: 0, max: 5, tone: 'danger' },
    { name: 'جبنة', emoji: '🧀', days: 12, max: 20, tone: 'olive' }
  ]);

  openMyth = signal<number | null>(0);

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.activity.loadRecent(12);
    this.challengeService.loadActive();
    this.testimonialService.loadApproved();
    this.setupRevealObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupRevealObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => this.observer?.observe(el));
    }, 200);
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleMyth(index: number): void {
    this.openMyth.update((v) => (v === index ? null : index));
  }

  waveBars(): number[] {
    return [20, 45, 30, 60, 35, 55, 25, 70, 40, 50, 30, 65, 45, 35, 55, 30, 60, 40, 50, 35, 65, 25, 45, 55];
  }

  challengeDots(target: number): number[] {
    return Array.from({ length: target }, (_, i) => i + 1);
  }

  healthPercent(fighter: IHudFighter): number {
    return Math.max(0, Math.min(100, (fighter.days / fighter.max) * 100));
  }

  fighterEmojiTone(tone: 'olive' | 'orange' | 'danger'): string {
    return 'hud-emoji-' + tone;
  }

  fighterBarTone(tone: 'olive' | 'orange' | 'danger'): string {
    return 'hud-bar-' + tone;
  }

  fighterDaysTone(tone: 'olive' | 'orange' | 'danger'): string {
    return 'hud-days-' + tone;
  }

  fighterDaysLabel(days: number): string {
    return days > 0 ? days + 'D' : 'KO';
  }
}