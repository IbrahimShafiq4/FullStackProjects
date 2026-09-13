import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TestimonialService, ICreateTestimonial } from '../../../core/services/testimonial.service';
import { ToastService } from '../../../shared/services/toast.service';
import { PopupService } from '../../../shared/services/popup.service';

@Component({
    imports: [FormsModule, DatePipe],
    selector: 'app-testimonials',
    templateUrl: './testimonials.html',
    styles: `
    .tm {
      min-height: 100vh;
      background: var(--paper);
      position: relative;
      padding: 32px 20px 80px;
    }

    .tm::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .tm-in { position: relative; max-width: 1100px; margin: 0 auto; z-index: 1; }

    .tm-head {
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

    .tm-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 20px;
    }

    .panel {
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 22px;
      position: relative;
    }

    .panel::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: var(--blue);
    }

    .panel-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 16px;
      padding-bottom: 12px;
      border-bottom: 1px dashed rgba(13,13,13,0.2);
    }

    .field { margin-bottom: 12px; }

    .field-label {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 6px;
    }

    .field-input,
    .field-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid var(--line);
      background: var(--paper-2);
      color: var(--ink);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: all 0.15s ease;
    }

    .field-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

    .field-input:focus,
    .field-textarea:focus {
      background: var(--paper);
      box-shadow: 4px 4px 0 var(--blue);
      transform: translate(-2px, -2px);
    }

    .rating-row {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
    }

    .star {
      width: 34px;
      height: 34px;
      border: 2px solid var(--line);
      background: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      cursor: pointer;
      color: #ccc;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .star.active {
      background: var(--amber);
      color: var(--ink);
      border-color: var(--amber);
    }

    .btn-primary {
      width: 100%;
      padding: 12px 18px;
      background: var(--ink);
      color: var(--paper);
      border: 2px solid var(--line);
      font-family: inherit;
      font-size: 14.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      margin-top: 6px;
    }

    .btn-primary:hover {
      background: var(--blue);
      border-color: var(--blue);
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .list { display: flex; flex-direction: column; gap: 12px; }

    .card {
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 18px 20px;
      position: relative;
    }

    .card::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      background: var(--green);
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
    }

    .card-author {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      background: var(--ink);
      color: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }

    .author-name {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 14.5px;
      font-weight: 700;
    }

    .author-role {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--muted);
    }

    .card-stars {
      display: flex;
      gap: 2px;
      color: var(--amber);
      font-size: 13px;
    }

    .card-msg {
      font-size: 14.5px;
      line-height: 1.7;
      color: var(--ink-2);
      margin: 0 0 12px;
    }

    .card-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px dashed rgba(13,13,13,0.2);
    }

    .card-date {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--muted);
    }

    .btn-delete {
      padding: 6px 12px;
      border: 2px solid var(--red);
      background: transparent;
      color: var(--red);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-delete:hover {
      background: var(--red);
      color: var(--paper);
    }

    .empty {
      padding: 60px 30px;
      border: 2px dashed var(--line);
      text-align: center;
    }

    .empty-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 50px;
      font-weight: 700;
      color: rgba(13,13,13,0.1);
      display: block;
      line-height: 1;
      margin-bottom: 12px;
    }

    .empty-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 6px;
    }

    .empty-sub { font-size: 14.5px; color: var(--muted); margin: 0; }

    @media (max-width: 900px) {
      .tm-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .tm { padding: 20px 14px 60px; }
      .panel { padding: 18px; }
    }
  `
})
export class Testimonials implements OnInit {
    private _TestimonialService: TestimonialService = inject(TestimonialService);
    private _Toast: ToastService = inject(ToastService);
    private _Popup: PopupService = inject(PopupService);

    public service = this._TestimonialService;

    submitting: WritableSignal<boolean> = signal(false);

    model: ICreateTestimonial = {
        authorName: '',
        authorRole: '',
        message: '',
        rating: 5
    };

    ngOnInit(): void {
        this.service.loadMine();
    }

    setRating(value: number): void {
        this.model.rating = value;
    }

    submit(): void {
        if (!this.model.authorName.trim() || this.model.authorName.trim().length < 2) {
            this._Toast.show('أدخل اسمك', 'error');
            return;
        }
        if (!this.model.authorRole.trim()) {
            this._Toast.show('أدخل مسمّاك الوظيفي', 'error');
            return;
        }
        if (!this.model.message.trim() || this.model.message.trim().length < 20) {
            this._Toast.show('الرأي يجب أن يكون 20 حرفاً على الأقل', 'error');
            return;
        }

        this.submitting.set(true);

        this.service.create({
            authorName: this.model.authorName.trim(),
            authorRole: this.model.authorRole.trim(),
            message: this.model.message.trim(),
            rating: this.model.rating
        }).subscribe({
            next: () => {
                this._Toast.show('تم نشر رأيك ✅', 'success');
                this.model = { authorName: '', authorRole: '', message: '', rating: 5 };
                this.submitting.set(false);
                this.service.loadMine();
            },
            error: (err) => {
                this._Toast.show(typeof err.error === 'string' ? err.error : 'فشل النشر', 'error');
                this.submitting.set(false);
            }
        });
    }

    async remove(id: number): Promise<void> {
        const ok = await this._Popup.confirm({
            title: 'حذف الرأي',
            message: 'سيتم إزالة هذا الرأي من الصفحة الرئيسية. متأكد؟',
            type: 'danger',
            confirmLabel: 'احذف'
        });

        if (!ok) return;

        this.service.delete(id).subscribe({
            next: () => {
                this._Toast.show('تم الحذف', 'info');
                this.service.loadMine();
            },
            error: () => this._Toast.show('فشل الحذف', 'error')
        });
    }

    starsArray(rating: number): number[] {
        return Array(rating).fill(0);
    }

    emptyStars(rating: number): number[] {
        return Array(5 - rating).fill(0);
    }
}