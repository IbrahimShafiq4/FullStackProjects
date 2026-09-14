import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ChallengeService, IParticipation } from '../../../core/services/challenge.service';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmService } from '../../../shared/services/confirm.service';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-challenge-submissions',
  templateUrl: './challenge-submissions.html',
  styles: `
    .cs-page {
      min-height: 100vh;
      padding: 24px 20px 60px;
      direction: rtl;
      background: var(--bg);
      background-image:
        linear-gradient(45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(-45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--bg-2) 75%),
        linear-gradient(-45deg, transparent 75%, var(--bg-2) 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    }

    .cs-inner { max-width: 1180px; margin: 0 auto; }

    .cs-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
      text-decoration: none;
      margin-bottom: 16px;
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .cs-back:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .cs-back:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .cs-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 14px;
      margin-bottom: 20px;
      border-bottom: 3px solid var(--ink);
      flex-wrap: wrap;
    }

    .cs-title {
      font-family: var(--font-pixel-ar);
      font-size: 28px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 4px;
      line-height: 1.2;
    }

    .cs-sub {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      color: var(--muted);
      margin: 0;
      line-height: 1.6;
    }

    .cs-stats {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 14px;
      background: var(--ink);
      color: var(--surface);
      font-family: var(--font-pixel-en);
      font-size: 17px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--gold);
      letter-spacing: 1px;
    }

    .cs-stats-num { color: var(--gold); font-weight: 700; }

    .cs-legend {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
      padding: 12px 14px;
      background: var(--surface);
      border: 2px dashed var(--ink);
      margin-bottom: 20px;
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      color: var(--ink-2);
    }

    .cs-legend-title {
      font-weight: 700;
      color: var(--ink);
      margin-inline-end: 8px;
    }

    .cs-legend-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: var(--surface-2);
      border: 2px solid var(--ink);
      font-family: var(--font-pixel-ar);
      font-weight: 700;
      line-height: 1.2;
    }

    .cs-legend-dot {
      width: 12px;
      height: 12px;
      border: 2px solid var(--ink);
      display: inline-block;
    }

    .cs-legend-dot-1 { background: var(--gold); }
    .cs-legend-dot-2 { background: #d8d8d8; }
    .cs-legend-dot-3 { background: #d4a373; }

    .cs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }

    .cs-card {
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.1s steps(2);
      position: relative;
    }

    .cs-card:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 var(--ink);
    }

    .cs-card-rank-1 {
      border-color: var(--gold);
      box-shadow: 4px 4px 0 var(--gold);
    }

    .cs-card-rank-2 {
      border-color: #b8b8b8;
      box-shadow: 4px 4px 0 #b8b8b8;
    }

    .cs-card-rank-3 {
      border-color: #b87333;
      box-shadow: 4px 4px 0 #b87333;
    }

    .cs-card-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px 12px;
      font-family: var(--font-pixel-en);
      font-size: 15px;
      letter-spacing: 1px;
      line-height: 1.3;
      border: 2.5px solid var(--ink);
      z-index: 2;
      font-weight: 700;
    }

    .cs-badge-gold { background: var(--gold); color: var(--ink); }
    .cs-badge-silver { background: #d8d8d8; color: var(--ink); }
    .cs-badge-bronze { background: #d4a373; color: var(--ink); }

    .cs-photo {
      width: 100%;
      aspect-ratio: 4 / 3;
      background: var(--surface-2);
      object-fit: cover;
      image-rendering: pixelated;
      border-bottom: 2.5px solid var(--ink);
      display: block;
    }

    .cs-photo-empty {
      width: 100%;
      aspect-ratio: 4 / 3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: var(--muted-2);
      background: var(--surface-2);
      border-bottom: 2.5px solid var(--ink);
    }

    .cs-body {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .cs-user {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cs-avatar {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--surface);
      background: var(--orange);
      border: 2px solid var(--ink);
      flex-shrink: 0;
    }

    .cs-name {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
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

    .cs-caption {
      font-family: var(--font-pixel-ar);
      font-size: 13.5px;
      line-height: 1.7;
      color: var(--ink-2);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 56px;
    }

    .cs-date {
      font-family: var(--font-pixel-en);
      font-size: 13px;
      color: var(--muted);
      line-height: 1;
      margin: 0;
    }

    .cs-rank-label {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      font-weight: 700;
      color: var(--muted);
      margin: 0;
      padding-top: 8px;
      border-top: 2px dashed var(--ink);
      text-align: start;
    }

    .cs-rank-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      margin-top: auto;
    }

    .cs-rank-btn {
      padding: 8px 4px;
      font-family: var(--font-pixel-en);
      font-size: 15px;
      font-weight: 700;
      color: var(--ink);
      background: var(--surface-2);
      border: 2px solid var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cs-rank-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 2px 2px 0 var(--ink);
      background: var(--surface);
    }

    .cs-rank-btn-active-1 {
      background: var(--gold);
      color: var(--ink);
      border-color: var(--ink);
    }

    .cs-rank-btn-active-2 {
      background: #d8d8d8;
      color: var(--ink);
      border-color: var(--ink);
    }

    .cs-rank-btn-active-3 {
      background: #d4a373;
      color: var(--ink);
      border-color: var(--ink);
    }

    .cs-rank-btn-clear {
      background: var(--surface);
      color: var(--danger);
      border-color: var(--danger);
    }

    .cs-rank-btn-clear:hover {
      background: var(--danger);
      color: var(--surface);
    }

    .cs-rank-btn-disabled {
      opacity: 0.3;
      cursor: default;
      pointer-events: none;
    }

    .cs-empty {
      grid-column: 1 / -1;
      padding: 60px 30px;
      text-align: center;
      border: 3px dashed var(--ink);
      background: var(--surface);
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      color: var(--muted);
      line-height: 1.6;
    }

    .cs-empty-icon {
      font-size: 52px;
      display: block;
      margin-bottom: 14px;
    }

    @media (max-width: 1024px) {
      .cs-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 640px) {
      .cs-page { padding: 16px 14px 40px; }
      .cs-grid { grid-template-columns: 1fr; }
      .cs-title { font-size: 22px; }
    }
  `
})
export class ChallengeSubmissions implements OnInit {
  private _route = inject(ActivatedRoute);
  private _challenges = inject(ChallengeService);
  private _toast = inject(ToastService);
  private _confirm = inject(ConfirmService);

  public service = this._challenges;

  get challengeId(): number {
    return Number(this._route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this._challenges.loadSubmissions(this.challengeId);
  }

  setRank(participationId: number, rank: number | null): void {
    this._challenges.setRank(participationId, rank).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this._challenges.loadSubmissions(this.challengeId);
      },
      error: (err) => this._toast.show(err.error?.message || 'فشل التعيين', 'error')
    });
  }

  async clearRank(participationId: number, currentRank: number): Promise<void> {
    const ok = await this._confirm.open({
      title: 'إلغاء المركز',
      message: `هل تريد إلغاء المركز ${currentRank} من هذه المشاركة؟`,
      confirmText: 'إلغاء المركز',
      cancelText: 'رجوع',
      tone: 'danger'
    });

    if (!ok) return;

    this.setRank(participationId, null);
  }

  isRanked(rank: number | null, value: number): boolean {
    return rank === value;
  }

  rankCardClass(rank: number | null): string {
    if (rank === 1) return 'cs-card-rank-1';
    if (rank === 2) return 'cs-card-rank-2';
    if (rank === 3) return 'cs-card-rank-3';
    return '';
  }

  rankBadgeClass(rank: number | null): string {
    if (rank === 1) return 'cs-badge-gold';
    if (rank === 2) return 'cs-badge-silver';
    if (rank === 3) return 'cs-badge-bronze';
    return '';
  }

  rankLabel(rank: number | null): string {
    if (rank === 1) return '🥇 المركز الأول';
    if (rank === 2) return '🥈 المركز الثاني';
    if (rank === 3) return '🥉 المركز الثالث';
    return '';
  }

  rankBtnClass(rank: number | null, value: number): string {
    if (rank === value) {
      return 'cs-rank-btn-active-' + value;
    }
    return '';
  }
}