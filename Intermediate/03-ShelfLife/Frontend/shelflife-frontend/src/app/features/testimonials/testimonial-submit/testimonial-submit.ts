import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TestimonialService, ICreateTestimonial } from '../../../core/services/testimonial.service';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmService } from '../../../shared/services/confirm.service';

@Component({
    imports: [FormsModule, RouterLink, DatePipe],
    selector: 'app-testimonial-submit',
    templateUrl: './testimonial-submit.html',
    styles: `
    .ts-page {
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

    .ts-inner { max-width: 780px; margin: 0 auto; }

    .ts-back {
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

    .ts-back:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .ts-card {
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 8px 8px 0 var(--ink);
      padding: 24px 22px;
      position: relative;
      margin-bottom: 24px;
    }

    .ts-card::before {
      content: '';
      position: absolute;
      top: -3px;
      right: -3px;
      width: 14px;
      height: 14px;
      background: var(--orange);
      border: 3px solid var(--ink);
    }

    .ts-head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 14px;
      margin-bottom: 18px;
      border-bottom: 3px dashed var(--ink);
    }

    .ts-head-icon {
      width: 46px;
      height: 46px;
      background: var(--orange);
      color: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      flex-shrink: 0;
    }

    .ts-head-texts { display: flex; flex-direction: column; gap: 3px; }

    .ts-title {
      font-family: var(--font-pixel-ar);
      font-size: 24px;
      font-weight: 700;
      color: var(--ink);
      margin: 0;
      line-height: 1.2;
    }

    .ts-sub {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      color: var(--muted);
      margin: 0;
      line-height: 1.5;
    }

    .ts-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .ts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .ts-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .ts-label {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink-2);
      text-align: start;
      line-height: 1.4;
    }

    .ts-input, .ts-textarea {
      width: 100%;
      padding: 10px 12px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 400;
      color: var(--ink);
      background: var(--surface-2);
      border: 2.5px solid var(--ink);
      box-shadow: inset 2px 2px 0 rgba(26, 28, 20, 0.08);
      outline: none;
      text-align: start;
      direction: rtl;
      transition: all 0.1s steps(2);
    }

    .ts-textarea {
      resize: vertical;
      min-height: 120px;
      line-height: 1.75;
    }

    .ts-input::placeholder,
    .ts-textarea::placeholder {
      color: var(--muted-2);
      opacity: 0.7;
    }

    .ts-input:focus, .ts-textarea:focus {
      background: var(--surface);
      box-shadow: 3px 3px 0 var(--orange);
      transform: translate(-1px, -1px);
    }

    .ts-stars {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .ts-star {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 26px;
      color: var(--muted-2);
      background: var(--surface-2);
      border: 2.5px solid var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1;
    }

    .ts-star:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 var(--ink);
      color: var(--gold);
      background: var(--gold-soft);
    }

    .ts-star.ts-star-on {
      background: var(--gold);
      color: var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
    }

    .ts-counter {
      font-family: var(--font-pixel-en);
      font-size: 14px;
      color: var(--muted);
      margin-inline-start: 8px;
    }

    .ts-submit {
      width: 100%;
      padding: 14px 20px;
      margin-top: 8px;
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      font-weight: 700;
      color: var(--surface);
      background: var(--olive);
      border: 3px solid var(--ink);
      box-shadow: 5px 5px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1.2;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .ts-submit:hover {
      background: var(--olive-2);
      transform: translate(-1px, -1px);
      box-shadow: 6px 6px 0 var(--ink);
    }

    .ts-submit:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .ts-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 5px 5px 0 var(--ink);
    }

    /* ═══ MY SUBMISSIONS ═══ */
    .ts-list-title {
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

    .ts-list-title::before {
      content: '';
      width: 10px;
      height: 10px;
      background: var(--orange);
      border: 2px solid var(--ink);
    }

    .ts-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ts-item {
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      padding: 16px 18px;
      position: relative;
    }

    .ts-item-approved {
      border-color: var(--olive);
      box-shadow: 4px 4px 0 var(--olive);
    }

    .ts-item-pending {
      border-color: var(--orange);
      box-shadow: 4px 4px 0 var(--orange);
    }

    .ts-item-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 2px dashed var(--ink);
    }

    .ts-item-author {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ts-item-name {
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1.2;
    }

    .ts-item-role {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      color: var(--muted);
      line-height: 1.3;
    }

    .ts-item-badge {
      padding: 4px 12px;
      font-family: var(--font-pixel-en);
      font-size: 13px;
      letter-spacing: 1.5px;
      line-height: 1.3;
      border: 2px solid var(--ink);
      flex-shrink: 0;
    }

    .ts-badge-approved {
      background: var(--olive);
      color: var(--surface);
    }

    .ts-badge-pending {
      background: var(--orange);
      color: var(--surface);
    }

    .ts-item-stars {
      display: flex;
      gap: 3px;
      margin-bottom: 8px;
      color: var(--gold-2);
      font-size: 18px;
    }

    .ts-item-quote {
      font-family: var(--font-pixel-ar);
      font-size: 14.5px;
      line-height: 1.8;
      color: var(--ink-2);
      margin: 0 0 10px;
    }

    .ts-item-date {
      font-family: var(--font-pixel-en);
      font-size: 13px;
      color: var(--muted);
      line-height: 1;
      margin: 0;
    }

    .ts-item-remove {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 16px;
      background: var(--danger);
      color: var(--surface);
      border: 2px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1;
    }

    .ts-item-remove:hover {
      background: #8a2f24;
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .ts-empty {
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
      .ts-page { padding: 16px 14px 40px; }
      .ts-card { padding: 18px 14px; }
      .ts-row { grid-template-columns: 1fr; }
      .ts-title { font-size: 20px; }
      .ts-star { width: 38px; height: 38px; font-size: 22px; }
    }
  `
})
export class TestimonialSubmit implements OnInit {
    private _testimonials = inject(TestimonialService);
    private _toast = inject(ToastService);
    private _confirm = inject(ConfirmService);

    public service = this._testimonials;

    model: ICreateTestimonial = {
        name: '',
        role: '',
        city: '',
        quote: '',
        rating: 5
    };

    submitting: WritableSignal<boolean> = signal<boolean>(false);

    ngOnInit(): void {
        this._testimonials.loadMine();
    }

    setRating(value: number): void {
        this.model.rating = value;
    }

    isStarOn(value: number): boolean {
        return this.model.rating >= value;
    }

    submit(): void {
        if (!this.model.name.trim() || this.model.name.trim().length < 2) {
            this._toast.show('أدخل اسمك (حرفين على الأقل)', 'error');
            return;
        }

        if (!this.model.role.trim()) {
            this._toast.show('أدخل مسمّاك الوظيفي', 'error');
            return;
        }

        if (!this.model.city.trim()) {
            this._toast.show('أدخل مدينتك', 'error');
            return;
        }

        if (!this.model.quote.trim() || this.model.quote.trim().length < 20) {
            this._toast.show('الرأي لازم يكون 20 حرف على الأقل', 'error');
            return;
        }

        if (this.model.quote.length > 500) {
            this._toast.show('الرأي طويل جداً — الحد 500 حرف', 'error');
            return;
        }

        this.submitting.set(true);

        this._testimonials.create({
            name: this.model.name.trim(),
            role: this.model.role.trim(),
            city: this.model.city.trim(),
            quote: this.model.quote.trim(),
            rating: this.model.rating
        }).subscribe({
            next: (res) => {
                this._toast.show(res.message, 'success');
                this.model = { name: '', role: '', city: '', quote: '', rating: 5 };
                this.submitting.set(false);
                this._testimonials.loadMine();
            },
            error: (err) => {
                this._toast.show(err.error || 'فشل الإرسال', 'error');
                this.submitting.set(false);
            }
        });
    }

    async remove(id: number): Promise<void> {
        const ok = await this._confirm.open({
            title: 'حذف الرأي',
            message: 'هل تريد حذف هذا الرأي؟ لا يمكن التراجع.',
            confirmText: 'احذف',
            cancelText: 'إلغاء',
            tone: 'danger'
        });

        if (!ok) return;

        this._testimonials.delete(id).subscribe({
            next: (res) => {
                this._toast.show(res.message, 'success');
                this._testimonials.loadMine();
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

    quoteLength(): number {
        return this.model.quote.length;
    }
}