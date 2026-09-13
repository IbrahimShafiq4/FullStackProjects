import { Component, inject, OnInit } from '@angular/core';
import { GigForm } from '../gig-form/gig-form';
import { RouterLink } from '@angular/router';
import { GigsService } from '../../../core/services/gigs-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  imports: [RouterLink, GigForm],
  selector: 'app-gig-list',
  templateUrl: './gig-list.html',
  styles: `

    .desktop {
      min-height: 100vh;
      padding: 44px 24px 80px;
      direction: rtl;
      position: relative;
    }


    .aero-window {
      max-width: 1080px;
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
        /* Outer white glow */
        0 0 0 1px rgba(255, 255, 255, 0.65),
        /* Soft inner reflection */
        inset 0 0 0 1px rgba(255, 255, 255, 0.55),
        /* Big drop shadow */
        0 24px 70px rgba(0, 25, 60, 0.55),
        0 8px 20px rgba(0, 25, 60, 0.35),
        /* Blue ambient glow */
        0 0 40px rgba(110, 180, 240, 0.35);
      backdrop-filter: blur(22px) saturate(1.5);
      -webkit-backdrop-filter: blur(22px) saturate(1.5);
      overflow: hidden;
    }

    /* Top glass shine across the whole window */
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
      z-index: 2;
    }

    /* Extra shine on title bar top half */
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
      letter-spacing: 0.2px;
    }

    /* Window controls — minimize, maximize, close */
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
        0 0 6px rgba(90, 160, 220, 0.6),
        0 1px 2px rgba(0, 30, 70, 0.2);
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
        0 0 10px rgba(255, 100, 80, 0.7),
        0 1px 2px rgba(0, 30, 70, 0.25);
    }


    .aero-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 10px 16px;
      background:
        linear-gradient(180deg,
          rgba(246, 251, 255, 0.75) 0%,
          rgba(228, 240, 252, 0.7) 100%);
      border-bottom: 1px solid rgba(120, 155, 195, 0.45);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.85),
        inset 0 -1px 0 rgba(255, 255, 255, 0.35);
      position: relative;
      z-index: 1;
    }

    .toolbar-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }


    .aero-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 14px;
      font-family: inherit;
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

    /* Aero button top shine — the signature detail */
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
        inset 0 2px 4px rgba(50, 90, 140, 0.35),
        inset 0 -1px 0 rgba(255, 255, 255, 0.5);
      transform: translateY(1px);
    }

    .aero-btn-icon {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--blue);
      filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.8));
      position: relative;
      z-index: 1;
    }

    .aero-btn-text {
      position: relative;
      z-index: 1;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.85);
    }

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

    .aero-btn-primary .aero-btn-icon {
      color: #ffffff;
      filter: drop-shadow(0 1px 1px rgba(0, 30, 70, 0.5));
    }

    .aero-btn-primary .aero-btn-text {
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
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

    .toolbar-info {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #1e4a7a;
      padding: 6px 14px;
      border-radius: 999px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.95) 0%,
          rgba(220, 235, 250, 0.9) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.95),
        0 1px 3px rgba(0, 30, 70, 0.1);
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .toolbar-info-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background:
        radial-gradient(circle at 35% 30%, #a8e8b8 0%, #2a8f4a 100%);
      box-shadow:
        0 0 6px rgba(80, 200, 120, 0.9),
        inset 0 -1px 1px rgba(0, 30, 60, 0.3);
    }


    .aero-content {
      position: relative;
      padding: 22px 24px 26px;
      background: var(--content-bg);
      min-height: 380px;
      z-index: 1;
    }

    .aero-content::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.9);
    }


    .content-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 14px;
      margin-bottom: 18px;
      border-bottom: 1px solid rgba(120, 155, 195, 0.35);
      flex-wrap: wrap;
    }

    .content-heading-text {
      font-family: 'Cairo', sans-serif;
      font-size: 17px;
      font-weight: 800;
      color: #0a2949;
      letter-spacing: -0.3px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .content-heading-count {
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      font-weight: 700;
      color: #4a6b8f;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }


    .gig-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .gig-tile {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 16px 18px;
      border-radius: 6px;
      text-decoration: none;
      color: #0d2b4d;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 45%,
          rgba(232, 242, 252, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(180, 200, 225, 0.4),
        0 1px 3px rgba(0, 30, 70, 0.1);
      transition: all 0.15s ease;
      overflow: hidden;
      min-height: 150px;
    }

    /* Tile top shine */
    .gig-tile::before {
      content: '';
      position: absolute;
      top: 0;
      left: 4%;
      right: 4%;
      height: 45%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.75) 0%,
        rgba(255, 255, 255, 0.1) 70%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 20px 20px;
      pointer-events: none;
    }

    .gig-tile:hover {
      border-color: var(--btn-border-2);
      background:
        linear-gradient(180deg,
          #f8fcff 0%,
          #e8f2fb 45%,
          #d5e7f7 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(180, 200, 225, 0.4),
        0 0 12px rgba(90, 160, 240, 0.5),
        0 4px 12px rgba(0, 30, 70, 0.15);
      transform: translateY(-2px);
    }

    .gig-tile-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px dashed rgba(120, 155, 195, 0.35);
      position: relative;
    }

    .gig-tile-title {
      font-family: 'Cairo', sans-serif;
      font-size: 15.5px;
      font-weight: 800;
      line-height: 1.35;
      letter-spacing: -0.3px;
      margin: 0;
      flex: 1;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .gig-tile-budget {
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      font-weight: 800;
      white-space: nowrap;
      padding: 5px 12px;
      border-radius: 4px;
      color: #ffffff;
      background:
        linear-gradient(180deg,
          #8dc4f8 0%,
          #4a90dc 48%,
          #2b78ca 50%,
          #1a5ea8 100%);
      border: 1px solid #0e3e73;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -1px 0 rgba(0, 30, 70, 0.35),
        0 1px 3px rgba(0, 30, 70, 0.2);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .gig-tile-desc {
      font-size: 13.5px;
      line-height: 1.65;
      color: #4a6b8f;
      margin: 0 0 auto;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      position: relative;
    }

    .gig-tile-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      margin-top: 12px;
      border-top: 1px dashed rgba(120, 155, 195, 0.35);
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      color: #6e8bab;
      font-weight: 600;
      position: relative;
    }

    .gig-tile-author {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .gig-tile-author-icon {
      font-size: 12px;
      opacity: 0.8;
    }

    .gig-tile-cta {
      color: var(--blue);
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }


    .empty-state {
      grid-column: 1 / -1;
      padding: 60px 30px;
      border-radius: 8px;
      text-align: center;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.7) 0%,
          rgba(230, 242, 252, 0.7) 100%);
      border: 2px dashed rgba(120, 155, 195, 0.5);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      background:
        radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, transparent 50%),
        linear-gradient(180deg, #e0ebf6 0%, #b8cee2 100%);
      border: 1px solid rgba(120, 155, 195, 0.6);
      box-shadow:
        inset 0 -3px 6px rgba(0, 30, 70, 0.15),
        inset 0 2px 4px rgba(255, 255, 255, 0.9),
        0 3px 8px rgba(0, 30, 70, 0.12);
      color: #6e8bab;
    }

    .empty-title {
      font-family: 'Cairo', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #1e4a7a;
      margin: 0 0 6px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .empty-sub {
      font-size: 13.5px;
      color: #6e8bab;
      margin: 0;
      font-weight: 500;
    }


    .aero-statusbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 7px 16px;
      background:
        linear-gradient(180deg,
          rgba(228, 238, 248, 0.9) 0%,
          rgba(208, 224, 240, 0.9) 100%);
      border-top: 1px solid rgba(120, 155, 195, 0.5);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        inset 0 -1px 0 rgba(255, 255, 255, 0.3);
      position: relative;
      z-index: 1;
      font-family: 'Cairo', sans-serif;
      font-size: 12px;
      color: #4a6b8f;
      font-weight: 600;
    }

    .statusbar-group {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .statusbar-divider {
      width: 1px;
      height: 14px;
      background: rgba(120, 155, 195, 0.5);
      box-shadow: 1px 0 0 rgba(255, 255, 255, 0.7);
    }


    @media (max-width: 900px) {
      .gig-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .desktop { padding: 20px 12px 60px; }
      .aero-toolbar { flex-direction: column; align-items: stretch; gap: 10px; }
      .toolbar-buttons { width: 100%; }
      .aero-btn { flex: 1; justify-content: center; }
      .aero-content { padding: 16px 14px 20px; }
      .win-ctrl { width: 26px; height: 20px; }
      .title-text { font-size: 12px; }
    }
  `
})
export class GigList implements OnInit {
  _GigsService: GigsService = inject(GigsService);
  _AuthService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this._GigsService.loadOpenGigs();
  }
}