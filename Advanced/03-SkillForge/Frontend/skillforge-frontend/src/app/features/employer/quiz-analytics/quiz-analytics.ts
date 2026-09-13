import { Component, inject, OnInit, AfterViewInit, ElementRef, viewChild, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import Chart from 'chart.js/auto';
import { QuizService } from '../../../core/services/quiz.service';

@Component({
    imports: [RouterLink, DecimalPipe],
    selector: 'app-quiz-analytics',
    templateUrl: './quiz-analytics.html',
    styles: `
    .analytics {
      min-height: 100vh;
      background: var(--paper);
      position: relative;
      padding: 32px 20px 80px;
    }

    .analytics::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .analytics-in { position: relative; max-width: 1100px; margin: 0 auto; z-index: 1; }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      border: 2px solid var(--line);
      background: transparent;
      color: var(--ink);
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;
      margin-bottom: 20px;
    }

    .back-btn:hover { background: var(--paper-2); }

    .analytics-head {
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

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border: 2px solid var(--line);
      margin-bottom: 24px;
      background: var(--paper);
    }

    .stat {
      padding: 24px 20px;
      border-left: 2px solid var(--line);
    }

    .stat:first-child { border-left: none; }

    .stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      display: block;
      margin-bottom: 10px;
    }

    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 34px;
      font-weight: 700;
      letter-spacing: -1.5px;
      line-height: 1;
      display: block;
    }

    .stat-value.blue { color: var(--blue); }
    .stat-value.amber { color: var(--amber); }
    .stat-value.green { color: var(--green); }

    .chart-card {
      border: 2px solid var(--line);
      background: var(--paper);
      padding: 28px;
      position: relative;
    }

    .chart-card::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: var(--blue);
    }

    .chart-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: 16px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(13,13,13,0.15);
    }

    .chart-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.3px;
      margin: 0;
    }

    .chart-hint {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--muted);
      letter-spacing: 1px;
    }

    .chart-wrap { height: 380px; position: relative; }

    @media (max-width: 900px) {
      .stat-grid { grid-template-columns: 1fr; }
      .stat { border-left: none; border-top: 2px solid var(--line); }
      .stat:first-child { border-top: none; }
    }

    @media (max-width: 640px) {
      .analytics { padding: 20px 14px 60px; }
      .chart-card { padding: 18px; }
      .chart-wrap { height: 300px; }
    }
  `
})
export class QuizAnalytics implements OnInit, AfterViewInit {
    public _QuizService: QuizService = inject(QuizService);
    private _ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private difficultyChartRef: Signal<ElementRef<HTMLCanvasElement> | undefined> = viewChild<ElementRef<HTMLCanvasElement>>('difficultyChart');

    ngOnInit(): void {
        const quizId: number = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
        this._QuizService.loadAnalytics(quizId);
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.renderChart(), 500);
    }

    private renderChart() {
        const canvas = this.difficultyChartRef()?.nativeElement;
        const analytics = this._QuizService.analytics();
        if (!canvas || !analytics) return;

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: analytics.questionsDifficulty.map((q) => q.questionText.substring(0, 30) + '...'),
                datasets: [{
                    label: 'نسبة الإجابة الصحيحة %',
                    data: analytics.questionsDifficulty.map((q) => q.correctRate),
                    backgroundColor: analytics.questionsDifficulty.map((q) =>
                        q.correctRate < 30 ? '#dc2626' : q.correctRate < 60 ? '#f59e0b' : '#15803d'
                    ),
                    borderColor: '#0d0d0d',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: { family: 'JetBrains Mono', size: 12 },
                            color: '#0d0d0d'
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(13,13,13,0.08)' },
                        ticks: { font: { family: 'JetBrains Mono', size: 11 }, color: '#6b6b6b' }
                    },
                    y: {
                        grid: { color: 'rgba(13,13,13,0.08)' },
                        ticks: { font: { family: 'IBM Plex Sans Arabic', size: 11 }, color: '#0d0d0d' }
                    }
                }
            }
        });
    }
}