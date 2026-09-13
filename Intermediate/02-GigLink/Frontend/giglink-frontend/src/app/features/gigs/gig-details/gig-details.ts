import { Component, inject, OnInit } from '@angular/core';
import { GigsService, IProposal } from '../../../core/services/gigs-service';
import { AuthService } from '../../../core/services/auth-service';
import { ToastService } from '../../../core/services/toast-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule, RouterLink],
    selector: 'app-gig-details',
    templateUrl: './gig-details.html',
    styles: `
    .gd-desktop {
      min-height: 100vh;
      padding: 40px 20px 80px;
      direction: rtl;
    }

    .aero-window {
      max-width: 900px;
      margin: 0 auto;
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
      position: relative;
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
    }

    .title-text {
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      font-size: 13px;
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

    .aero-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
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

    .aero-content {
      position: relative;
      padding: 22px 24px 26px;
      background: var(--content-bg);
      z-index: 1;
    }

    .gig-card {
      position: relative;
      padding: 22px 24px;
      border-radius: 6px;
      margin-bottom: 18px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 45%,
          rgba(232, 242, 252, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.55);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(180, 200, 225, 0.4),
        0 2px 6px rgba(0, 30, 70, 0.1);
      overflow: hidden;
    }

    .gig-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 3%;
      right: 3%;
      height: 42%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 25px 25px;
      pointer-events: none;
    }

    .gig-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(120, 155, 195, 0.3);
      position: relative;
    }

    .gig-title {
      font-family: 'Cairo', sans-serif;
      font-size: clamp(1.4rem, 2.5vw, 1.9rem);
      font-weight: 900;
      letter-spacing: -0.8px;
      line-height: 1.2;
      margin: 0;
      max-width: 560px;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .gig-budget-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 12px 18px;
      border-radius: 6px;
      flex-shrink: 0;
      position: relative;
      color: #ffffff;
      background:
        linear-gradient(180deg,
          #8dc4f8 0%,
          #4a90dc 44%,
          #2b78ca 50%,
          #1a5ea8 51%,
          #3a82d0 100%);
      border: 1px solid #0e3e73;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -2px 4px rgba(0, 30, 70, 0.35),
        0 3px 8px rgba(30, 90, 180, 0.35);
      overflow: hidden;
    }

    .gig-budget-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: 8%;
      right: 8%;
      height: 46%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 20px 20px;
      pointer-events: none;
    }

    .gig-budget-label {
      font-family: 'Cairo', sans-serif;
      font-size: 9.5px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      opacity: 0.85;
      margin-bottom: 3px;
      font-weight: 700;
      position: relative;
      z-index: 1;
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .gig-budget-value {
      font-family: 'Cairo', sans-serif;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.5px;
      position: relative;
      z-index: 1;
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .gig-body {
      font-family: 'Cairo', sans-serif;
      font-size: 14.5px;
      line-height: 1.75;
      color: #1e4a7a;
      margin: 0 0 18px;
      position: relative;
    }

    .gig-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding-top: 16px;
      border-top: 1px solid rgba(120, 155, 195, 0.3);
      position: relative;
    }

    .gig-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.95) 0%,
          rgba(220, 235, 250, 0.9) 100%);
      border: 1px solid rgba(120, 155, 195, 0.5);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.95),
        0 1px 3px rgba(0, 30, 70, 0.08);
      font-family: 'Cairo', sans-serif;
      font-size: 11.5px;
      font-weight: 700;
    }

    .gig-meta-key {
      color: #4a6b8f;
      letter-spacing: 0.3px;
    }

    .gig-meta-val {
      color: #0a2949;
    }

    .section-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 10px;
      margin-bottom: 14px;
      border-bottom: 1px solid rgba(120, 155, 195, 0.3);
    }

    .section-heading-text {
      font-family: 'Cairo', sans-serif;
      font-size: 15.5px;
      font-weight: 800;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .section-heading-count {
      font-family: 'Cairo', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: #4a6b8f;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .proposal-panel {
      position: relative;
      padding: 20px 22px 22px;
      border-radius: 6px;
      margin-bottom: 18px;
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

    .proposal-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 3%;
      right: 3%;
      height: 42%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 25px 25px;
      pointer-events: none;
    }

    .pf-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(120, 155, 195, 0.3);
      position: relative;
    }

    .pf-head-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: #ffffff;
      flex-shrink: 0;
      background:
        radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.8) 0%, transparent 45%),
        linear-gradient(180deg, #6cb8ff 0%, #1e6fd9 100%);
      border: 1px solid rgba(180, 220, 255, 0.7);
      box-shadow:
        inset 0 -2px 3px rgba(0, 30, 70, 0.35),
        0 2px 6px rgba(30, 90, 180, 0.35);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
    }

    .pf-title {
      font-family: 'Cairo', sans-serif;
      font-size: 15.5px;
      font-weight: 800;
      margin: 0;
      color: #0a2949;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .pf-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
      position: relative;
    }

    .pf-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .pf-field-full {
      grid-column: 1 / -1;
    }

    .pf-label {
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      font-weight: 700;
      color: #1e4a7a;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .pf-input,
    .pf-textarea {
      width: 100%;
      padding: 10px 13px;
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 600;
      color: #0a2949;
      background:
        linear-gradient(180deg,
          rgba(235, 244, 252, 0.95) 0%,
          rgba(255, 255, 255, 0.98) 50%,
          rgba(255, 255, 255, 1) 100%);
      border: 1px solid rgba(120, 155, 195, 0.7);
      border-radius: 4px;
      outline: none;
      transition: all 0.2s ease;
      box-shadow:
        inset 0 2px 4px rgba(120, 150, 190, 0.15),
        inset 0 -1px 0 rgba(255, 255, 255, 0.7);
    }

    .pf-textarea {
      resize: vertical;
      min-height: 90px;
      line-height: 1.6;
    }

    .pf-input::placeholder,
    .pf-textarea::placeholder {
      color: #8ba4c2;
      font-weight: 500;
    }

    .pf-input:focus,
    .pf-textarea:focus {
      border-color: var(--blue);
      background: #ffffff;
      box-shadow:
        inset 0 2px 4px rgba(120, 150, 190, 0.15),
        0 0 0 3px rgba(90, 160, 240, 0.35),
        0 0 12px rgba(90, 160, 240, 0.5);
    }

    .pf-submit {
      position: relative;
      width: 100%;
      padding: 11px 18px;
      border-radius: 5px;
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 800;
      cursor: pointer;
      color: #ffffff;
      background:
        linear-gradient(180deg,
          #8dc4f8 0%,
          #4a90dc 44%,
          #2b78ca 50%,
          #1a5ea8 51%,
          #3a82d0 100%);
      border: 1px solid #0e3e73;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -2px 4px rgba(0, 30, 70, 0.35),
        0 3px 10px rgba(30, 90, 180, 0.4);
      text-shadow: 0 1px 2px rgba(0, 30, 70, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .pf-submit::before {
      content: '';
      position: absolute;
      top: 0;
      left: 5%;
      right: 5%;
      height: 46%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.55) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 5px 5px 50% 50% / 5px 5px 20px 20px;
      pointer-events: none;
    }

    .pf-submit:hover {
      background:
        linear-gradient(180deg,
          #a8d5ff 0%,
          #5aa0e8 44%,
          #3a88d8 50%,
          #2a6eb8 51%,
          #4a92e0 100%);
      transform: translateY(-1px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        inset 0 -2px 4px rgba(0, 30, 70, 0.4),
        0 5px 14px rgba(30, 90, 180, 0.5),
        0 0 20px rgba(90, 160, 240, 0.5);
    }

    .proposals-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .proposal-card {
      position: relative;
      padding: 18px 20px;
      border-radius: 6px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      align-items: center;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(244, 250, 255, 0.96) 45%,
          rgba(232, 242, 252, 0.96) 100%);
      border: 1px solid rgba(120, 155, 195, 0.5);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 2px 6px rgba(0, 30, 70, 0.1);
      overflow: hidden;
    }

    .proposal-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 4%;
      right: 4%;
      height: 44%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 6px 6px 50% 50% / 6px 6px 20px 20px;
      pointer-events: none;
    }

    .proposal-author {
      font-family: 'Cairo', sans-serif;
      font-size: 15px;
      font-weight: 800;
      margin: 0 0 6px;
      color: #0a2949;
      position: relative;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .proposal-stats {
      display: flex;
      gap: 12px;
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      color: #4a6b8f;
      margin-bottom: 6px;
      position: relative;
      font-weight: 600;
    }

    .proposal-stats strong {
      color: var(--blue);
      font-weight: 800;
    }

    .proposal-msg {
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      line-height: 1.65;
      color: #1e4a7a;
      margin: 0;
      position: relative;
    }

    .proposal-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
      position: relative;
    }

    .btn-accept {
      position: relative;
      padding: 9px 18px;
      border-radius: 5px;
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      color: #ffffff;
      background:
        linear-gradient(180deg,
          #8ee0a4 0%,
          #4aaa68 44%,
          #2a8f4a 50%,
          #1a6b36 51%,
          #3fa862 100%);
      border: 1px solid #176032;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -2px 4px rgba(0, 40, 20, 0.35),
        0 3px 8px rgba(30, 100, 50, 0.4);
      text-shadow: 0 1px 2px rgba(0, 40, 20, 0.5);
      overflow: hidden;
      transition: all 0.15s ease;
    }

    .btn-accept::before {
      content: '';
      position: absolute;
      top: 0;
      left: 6%;
      right: 6%;
      height: 46%;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.55) 0%,
        rgba(255, 255, 255, 0) 100%);
      border-radius: 5px 5px 50% 50% / 5px 5px 20px 20px;
      pointer-events: none;
    }

    .btn-accept:hover {
      background:
        linear-gradient(180deg,
          #a8eebb 0%,
          #5aba78 44%,
          #3a9f5a 50%,
          #2a7b46 51%,
          #4fb872 100%);
      transform: translateY(-1px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 5px 12px rgba(30, 120, 60, 0.5),
        0 0 20px rgba(80, 200, 120, 0.5);
    }

    .status-badge {
      padding: 7px 14px;
      border-radius: 999px;
      font-family: 'Cairo', sans-serif;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    }

    .status-accepted {
      background: linear-gradient(180deg, #d5f0dd 0%, #a8dfba 100%);
      color: #176032;
      border: 1px solid #7ac292;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .status-rejected {
      background: linear-gradient(180deg, #fbdede 0%, #f2baba 100%);
      color: #952424;
      border: 1px solid #d98080;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .status-pending {
      background: linear-gradient(180deg, #fff0c8 0%, #ffe0a0 100%);
      color: #8a5400;
      border: 1px solid #e0b860;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .empty-proposals {
      padding: 40px 20px;
      border-radius: 6px;
      text-align: center;
      background:
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.7) 0%,
          rgba(230, 242, 252, 0.7) 100%);
      border: 2px dashed rgba(120, 155, 195, 0.5);
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      color: #4a6b8f;
      font-weight: 600;
    }

    @media (max-width: 640px) {
      .gd-desktop { padding: 20px 12px 60px; }
      .gig-card { padding: 18px 16px; }
      .gig-head { flex-direction: column; }
      .gig-budget-badge { align-self: flex-start; align-items: flex-start; }
      .pf-grid { grid-template-columns: 1fr; }
      .proposal-card { grid-template-columns: 1fr; }
      .proposal-actions { justify-content: flex-end; }
      .aero-toolbar { flex-direction: column; align-items: stretch; }
    }
  `
})
export class GigDetails implements OnInit {
    public _GigsService: GigsService = inject(GigsService);
    public _AuthService: AuthService = inject(AuthService);
    private _ToastService: ToastService = inject(ToastService);
    private _ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);

    proposalModel = { proposedPrice: 0, deliveryDays: 1, message: '' };

    get gigId(): number {
        return Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    }

    get isOwner(): boolean {
        return this._GigsService.selectedGig()?.clientId === this._AuthService.currentUser()?.id;
    }

    ngOnInit(): void {
        this._GigsService.loadGigDetails(this.gigId);
    }

    onSubmitProposal(): void {
        const { proposedPrice, deliveryDays, message } = this.proposalModel;

        if (proposedPrice <= 0 || deliveryDays < 1 || !message.trim()) {
            this._ToastService.show('املا كل الحقول', 'error');
            return;
        }

        this._GigsService.submitProposal(this.gigId, proposedPrice, deliveryDays, message).subscribe({
            next: (res: IProposal) => {
                this._ToastService.show('تم إرسال عرضك بنجاح', 'success');
                this.proposalModel = { proposedPrice: 0, deliveryDays: 1, message: '' };
                this._GigsService.loadGigDetails(this.gigId);
            },
            error: (err) => this._ToastService.show(err.error ?? 'حصل خطأ', 'error')
        });
    }

    onAcceptProposal(proposalId: number) {
        this._GigsService.acceptProposal(proposalId).subscribe({
            next: () => {
                this._ToastService.show('تم قبول العرض ورفض باقي العروض', 'success');
                this._GigsService.loadGigDetails(this.gigId);
            },
            error: (err) => this._ToastService.show(err.error ?? 'حصل خطأ', 'error')
        });
    }

    statusClass(status: string): string {
        if (status === 'Accepted') return 'status-accepted';
        if (status === 'Rejected') return 'status-rejected';
        return 'status-pending';
    }

    statusLabel(status: string): string {
        if (status === 'Accepted') return 'مقبول';
        if (status === 'Rejected') return 'مرفوض';
        return 'قيد المراجعة';
    }
}