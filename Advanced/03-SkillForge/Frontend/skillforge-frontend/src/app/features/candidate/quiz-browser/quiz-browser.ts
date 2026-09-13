import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    imports: [RouterLink],
    selector: 'app-quiz-browser',
    templateUrl: './quiz-browser.html',
    styles: `
    .qb-page {
      min-height: 100vh;
      background: var(--paper);
      position: relative;
      padding: 32px 20px 80px;
    }

    .qb-page::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .qb-in { position: relative; max-width: 1240px; margin: 0 auto; z-index: 1; }

    .qb-head {
      padding-bottom: 24px;
      border-bottom: 2px solid var(--line);
      margin-bottom: 24px;
    }

    .kicker {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--blue);
      display: block;
      margin-bottom: 10px;
    }

    .title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: clamp(1.9rem, 3.2vw, 2.6rem);
      font-weight: 700;
      letter-spacing: -1.2px;
      margin: 0 0 8px;
    }

    .title em { color: var(--blue); font-style: normal; }

    .sub { font-size: 15px; color: var(--muted); margin: 0; }

    .info-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border: 2px solid var(--line);
      margin-bottom: 24px;
    }

    .info-cell {
      padding: 18px 22px;
      border-left: 2px solid var(--line);
    }

    .info-cell:first-child { border-left: none; }

    .info-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      display: block;
      margin-bottom: 8px;
    }

    .info-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 19px;
      font-weight: 700;
      color: var(--ink);
    }

    .info-val.blue { color: var(--blue); }
    .info-val.green { color: var(--green); }

    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

    .quiz-card {
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      transition: all 0.15s ease;
      text-decoration: none;
      color: var(--ink);
      min-height: 240px;
    }

    .quiz-card::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: var(--blue);
    }

    .quiz-card:hover {
      box-shadow: 6px 6px 0 var(--line);
      transform: translate(-3px, -3px);
    }

    .quiz-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 14px;
      margin-bottom: 18px;
      border-bottom: 1px dashed rgba(13,13,13,0.2);
    }

    .quiz-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      color: var(--muted);
    }

    .quiz-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      padding: 3px 10px;
      background: var(--green);
      color: var(--paper);
      letter-spacing: 1px;
    }

    .quiz-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 20px;
      font-weight: 700;
      line-height: 1.35;
      letter-spacing: -0.4px;
      margin: 0 0 18px;
      flex: 1;
    }

    .quiz-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid var(--line);
      margin-bottom: 18px;
    }

    .quiz-stat {
      padding: 10px 12px;
      border-left: 1px solid var(--line);
    }

    .quiz-stat:last-child { border-left: none; }

    .quiz-stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 1px;
      color: var(--muted);
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
    }

    .quiz-stat-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 700;
      color: var(--ink);
    }

    .quiz-cta {
      padding: 12px;
      background: var(--ink);
      color: var(--paper);
      border: 2px solid var(--line);
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 700;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      transition: all 0.15s ease;
    }

    .quiz-card:hover .quiz-cta {
      background: var(--blue);
      border-color: var(--blue);
    }

    .empty {
      grid-column: 1 / -1;
      padding: 60px 30px;
      border: 2px dashed var(--line);
      text-align: center;
    }

    .empty-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 56px;
      font-weight: 700;
      color: rgba(13,13,13,0.1);
      line-height: 1;
      display: block;
      margin-bottom: 12px;
    }

    .empty-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 21px;
      font-weight: 700;
      margin: 0 0 6px;
    }

    .empty-sub { font-size: 14.5px; color: var(--muted); margin: 0; }

    @media (max-width: 1024px) {
      .grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 640px) {
      .qb-page { padding: 20px 14px 60px; }
      .grid { grid-template-columns: 1fr; }
      .info-bar { grid-template-columns: 1fr; }
      .info-cell { border-left: none; border-top: 2px solid var(--line); }
      .info-cell:first-child { border-top: none; }
    }
  `
})
export class QuizBrowser implements OnInit {
    public _QuizService: QuizService = inject(QuizService);
    public _CandidateService: CandidateService = inject(CandidateService);
    private _Toast: ToastService = inject(ToastService);

    ngOnInit(): void {
        this._CandidateService.loadMe().subscribe({
            next: () => this._QuizService.loadAvailableQuizzes(),
            error: () => this._Toast.show('فشل تحميل بيانات المرشح', 'error')
        });
    }
}