import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { IAttemptResult } from '../../../core/services/quiz.service';

@Component({
    imports: [DecimalPipe, RouterLink],
    selector: 'app-exam-result',
    templateUrl: './exam-result.html',
    styles: `
    .result {
      min-height: 100vh;
      background: var(--paper);
      position: relative;
      padding: 40px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .result::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .result-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 540px;
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 44px 32px;
      box-shadow: 12px 12px 0 var(--line);
    }

    .result-card::before {
      content: 'RESULT';
      position: absolute;
      top: -12px;
      right: 22px;
      background: var(--paper);
      padding: 0 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--blue);
      font-weight: 700;
    }

    .result-kicker {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--muted);
      text-align: center;
      display: block;
      margin-bottom: 14px;
    }

    .result-score-wrap {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid var(--line);
      margin-bottom: 24px;
    }

    .result-score {
      font-family: 'JetBrains Mono', monospace;
      font-size: clamp(3.5rem, 10vw, 5.5rem);
      font-weight: 800;
      line-height: 1;
      letter-spacing: -4px;
      color: var(--blue);
      display: inline-block;
    }

    .result-score-label {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 15.5px;
      font-weight: 700;
      margin-top: 10px;
      color: var(--ink);
      display: block;
    }

    .result-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 2px solid var(--line);
      margin-bottom: 20px;
    }

    .result-stat {
      padding: 18px;
      border-left: 2px solid var(--line);
      text-align: center;
    }

    .result-stat:last-child { border-left: none; }

    .result-stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      display: block;
      margin-bottom: 8px;
    }

    .result-stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 25px;
      font-weight: 700;
      color: var(--ink);
      letter-spacing: -1px;
      display: block;
    }

    .result-status {
      padding: 14px 18px;
      background: var(--paper-2);
      border: 2px solid var(--line);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      letter-spacing: 1px;
    }

    .result-status-badge {
      padding: 4px 12px;
      background: var(--green);
      color: var(--paper);
      font-weight: 700;
    }

    .result-actions { display: flex; gap: 10px; }

    .result-btn {
      flex: 1;
      padding: 13px 18px;
      border: 2px solid var(--line);
      background: transparent;
      color: var(--ink);
      font-family: inherit;
      font-size: 14.5px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .result-btn-primary {
      background: var(--ink);
      color: var(--paper);
    }

    .result-btn-primary:hover {
      background: var(--blue);
      border-color: var(--blue);
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    .result-btn-ghost:hover { background: var(--paper-2); }

    @media (max-width: 640px) {
      .result { padding: 24px 14px; }
      .result-card { padding: 28px 20px; box-shadow: 8px 8px 0 var(--line); }
      .result-stats { grid-template-columns: 1fr; }
      .result-stat { border-left: none; border-top: 2px solid var(--line); }
      .result-stat:first-child { border-top: none; }
      .result-actions { flex-direction: column; }
    }
  `
})
export class ExamResult implements OnInit {
    private _Router: Router = inject(Router);
    public result: IAttemptResult | null = null;

    ngOnInit(): void {
        this.result = (history.state?.result as IAttemptResult) ?? null;
    }
}