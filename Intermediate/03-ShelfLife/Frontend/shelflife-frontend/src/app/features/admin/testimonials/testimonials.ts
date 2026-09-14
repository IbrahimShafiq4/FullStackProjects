import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TestimonialService, ITestimonial } from '../../../core/services/testimonial.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  imports: [DatePipe],
  selector: 'app-admin-testimonials',
  templateUrl: './testimonials.html',
  styles: `
    .at-page {
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

    .at-inner { max-width: 900px; margin: 0 auto; }

    .at-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 14px;
      margin-bottom: 20px;
      border-bottom: 3px solid var(--ink);
      flex-wrap: wrap;
    }

    .at-title {
      font-family: var(--font-pixel-ar);
      font-size: 28px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 4px;
      line-height: 1.2;
    }

    .at-sub {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      color: var(--muted);
      margin: 0;
      line-height: 1.6;
    }

    .at-stats {
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
      box-shadow: 3px 3px 0 var(--orange);
      letter-spacing: 1px;
    }

    .at-stats-num { color: var(--orange); font-weight: 700; }

    .at-list-title {
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 14px;
      line-height: 1.2;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .at-list-title::before {
      content: '';
      width: 10px;
      height: 10px;
      background: var(--orange);
      border: 2px solid var(--ink);
    }

    .at-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 32px;
    }

    .at-item {
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      padding: 16px 18px;
      position: relative;
    }

    .at-item-approved {
      border-color: var(--olive);
      box-shadow: 4px 4px 0 var(--olive);
    }

    .at-item-pending {
      border-color: var(--orange);
      box-shadow: 4px 4px 0 var(--orange);
    }

    .at-item-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 2px dashed var(--ink);
    }

    .at-item-author {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .at-item-name {
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1.2;
    }

    .at-item-role {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      color: var(--muted);
      line-height: 1.3;
    }

    .at-item-badge {
      padding: 4px 12px;
      font-family: var(--font-pixel-en);
      font-size: 13px;
      letter-spacing: 1.5px;
      line-height: 1.3;
      border: 2px solid var(--ink);
      flex-shrink: 0;
    }

    .at-badge-approved {
      background: var(--olive);
      color: var(--surface);
    }

    .at-badge-pending {
      background: var(--orange);
      color: var(--surface);
    }

    .at-item-stars {
      display: flex;
      gap: 3px;
      margin-bottom: 8px;
      color: var(--gold-2);
      font-size: 18px;
    }

    .at-item-quote {
      font-family: var(--font-pixel-ar);
      font-size: 14.5px;
      line-height: 1.8;
      color: var(--ink-2);
      margin: 0 0 12px;
    }

    .at-item-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 10px;
      border-top: 2px dashed var(--ink);
      flex-wrap: wrap;
    }

    .at-item-date {
      font-family: var(--font-pixel-en);
      font-size: 13px;
      color: var(--muted);
      line-height: 1;
    }

    .at-item-actions {
      display: flex;
      gap: 6px;
    }

    .at-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 7px 14px;
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      font-weight: 700;
      color: var(--ink);
      background: var(--surface);
      border: 2px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .at-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .at-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 0 0 0 var(--ink);
    }

    .at-btn-approve {
      background: var(--olive);
      color: var(--surface);
    }

    .at-btn-approve:hover {
      background: var(--olive-2);
    }

    .at-btn-danger {
      background: var(--danger);
      color: var(--surface);
    }

    .at-btn-danger:hover {
      background: #8a2f24;
    }

    .at-empty {
      padding: 40px 20px;
      text-align: center;
      border: 3px dashed var(--ink);
      background: var(--surface);
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      color: var(--muted);
      line-height: 1.6;
    }

    @media (max-width: 640px) {
      .at-page { padding: 16px 14px 40px; }
      .at-title { font-size: 22px; }
      .at-item-foot { flex-direction: column; align-items: stretch; }
    }
  `
})
export class AdminTestimonials implements OnInit {
  private _testimonials = inject(TestimonialService);
  private _toast = inject(ToastService);
  private _confirm = inject(ConfirmService);

  public service = this._testimonials;

  ngOnInit(): void {
    this._testimonials.loadPending();
    this._testimonials.loadApproved();
  }

  approve(id: number): void {
    this._testimonials.approve(id).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this._testimonials.loadPending();
        this._testimonials.loadApproved();
      },
      error: () => this._toast.show('فشلت الموافقة', 'error')
    });
  }

  async remove(id: number): Promise<void> {
    const ok = await this._confirm.open({
      title: 'حذف الرأي',
      message: 'هل تريد حذف هذا الرأي نهائياً؟',
      confirmText: 'احذف',
      cancelText: 'إلغاء',
      tone: 'danger'
    });

    if (!ok) return;

    this._testimonials.delete(id).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this._testimonials.loadPending();
        this._testimonials.loadApproved();
      },
      error: () => this._toast.show('فشل الحذف', 'error')
    });
  }

  starsArray(count: number): number[] {
    return Array(count).fill(0);
  }

  emptyStars(count: number): number[] {
    return Array(5 - count).fill(0);
  }
}