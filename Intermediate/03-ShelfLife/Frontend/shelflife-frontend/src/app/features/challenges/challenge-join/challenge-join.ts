import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChallengeService, IChallenge } from '../../../core/services/challenge.service';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmService } from '../../../shared/services/confirm.service';

@Component({
    imports: [FormsModule, DatePipe, RouterLink],
    selector: 'app-challenge-join',
    templateUrl: './challenge-join.html',
    styles: `
    .cj-page {
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

    .cj-inner { max-width: 780px; margin: 0 auto; }

    .cj-back {
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

    .cj-back:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .cj-back:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .cj-card {
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 8px 8px 0 var(--ink);
      padding: 24px 22px;
      position: relative;
    }

    .cj-card::before {
      content: '';
      position: absolute;
      top: -3px;
      right: -3px;
      width: 14px;
      height: 14px;
      background: var(--orange);
      border: 3px solid var(--ink);
    }

    .cj-kicker {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: var(--olive-soft);
      border: 2px solid var(--ink);
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: var(--olive-2);
      letter-spacing: 1.5px;
      line-height: 1;
      margin-bottom: 12px;
    }

    .cj-kicker-dot {
      width: 6px;
      height: 6px;
      background: var(--olive);
      animation: pixel-blink 1.4s steps(2) infinite;
    }

    .cj-title {
      font-family: var(--font-pixel-ar);
      font-size: 28px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 10px;
      line-height: 1.25;
      text-align: start;
    }

    .cj-desc {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      line-height: 1.85;
      color: var(--ink-2);
      margin: 0 0 18px;
      text-align: start;
    }

    .cj-meta {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      padding-top: 14px;
      margin-bottom: 16px;
      border-top: 3px dashed var(--ink);
    }

    .cj-meta-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--surface-2);
      border: 2px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      font-family: var(--font-pixel-en);
      font-size: 14px;
      color: var(--ink-2);
      line-height: 1.4;
    }

    .cj-reward {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--ink);
      border: 2.5px solid var(--gold);
      font-family: var(--font-pixel-en);
      font-size: 16px;
      color: var(--gold);
      letter-spacing: 1px;
      line-height: 1;
      margin-bottom: 22px;
    }

    .cj-success {
      background: var(--olive);
      color: var(--surface);
      padding: 26px 22px 22px;
      border: 3px solid var(--ink);
      box-shadow: 6px 6px 0 var(--ink);
      position: relative;
    }

    .cj-success::before {
      content: '✓';
      position: absolute;
      top: -18px;
      right: 20px;
      width: 36px;
      height: 36px;
      background: var(--gold);
      color: var(--ink);
      border: 3px solid var(--ink);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 24px;
      line-height: 1;
    }

    .cj-success-title {
      font-family: var(--font-pixel-ar);
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 8px;
      line-height: 1.2;
    }

    .cj-success-sub {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
      margin: 0 0 18px;
      line-height: 1.6;
    }

    .cj-photo-preview {
      width: 100%;
      max-height: 340px;
      object-fit: cover;
      border: 3px solid var(--ink);
      image-rendering: pixelated;
      margin-bottom: 16px;
      background: var(--surface);
    }

    .cj-caption {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      line-height: 1.75;
      background: rgba(0, 0, 0, 0.2);
      padding: 12px 14px;
      border: 2px dashed rgba(255, 255, 255, 0.3);
      color: var(--surface);
      margin: 0 0 16px;
      text-align: start;
    }

    .cj-rank {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--gold);
      color: var(--ink);
      border: 2.5px solid var(--ink);
      font-family: var(--font-pixel-en);
      font-size: 18px;
      letter-spacing: 1.5px;
      line-height: 1;
      margin-bottom: 16px;
    }

    .cj-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cj-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .cj-label {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--ink-2);
      text-align: start;
      line-height: 1.4;
    }

    .cj-label-hint {
      font-family: var(--font-pixel-en);
      font-size: 13px;
      color: var(--muted);
      font-weight: 400;
    }

    .cj-textarea {
      width: 100%;
      padding: 10px 12px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      color: var(--ink);
      background: var(--surface-2);
      border: 2.5px solid var(--ink);
      box-shadow: inset 2px 2px 0 rgba(26, 28, 20, 0.08);
      outline: none;
      text-align: start;
      resize: vertical;
      min-height: 100px;
      line-height: 1.7;
      transition: all 0.1s steps(2);
    }

    .cj-textarea:focus {
      background: var(--surface);
      box-shadow: 3px 3px 0 var(--orange);
      transform: translate(-1px, -1px);
    }

    .cj-textarea::placeholder {
      color: var(--muted-2);
      opacity: 0.7;
    }

    .cj-file {
      display: none;
    }

    .cj-file-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 28px 16px;
      background: var(--surface-2);
      border: 3px dashed var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      color: var(--ink-2);
      text-align: center;
      line-height: 1.4;
    }

    .cj-file-label:hover {
      background: var(--olive-soft);
      border-color: var(--olive);
      color: var(--olive-2);
      border-style: solid;
    }

    .cj-file-label-icon {
      font-size: 28px;
      line-height: 1;
    }

    .cj-preview-wrap {
      position: relative;
      margin-bottom: 12px;
    }

    .cj-preview {
      width: 100%;
      max-height: 340px;
      object-fit: cover;
      border: 3px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      image-rendering: pixelated;
      background: var(--surface);
      display: block;
    }

    .cj-preview-remove {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 18px;
      color: var(--surface);
      background: var(--danger);
      border: 2.5px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1;
    }

    .cj-preview-remove:hover {
      background: #8a2f24;
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .cj-submit {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 15px 22px;
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
    }

    .cj-submit:hover {
      background: var(--olive-2);
      transform: translate(-1px, -1px);
      box-shadow: 6px 6px 0 var(--ink);
    }

    .cj-submit:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .cj-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 5px 5px 0 var(--ink);
    }

    .cj-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      font-family: var(--font-pixel-ar);
      font-size: 14px;
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

    .cj-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .cj-btn-danger {
      background: var(--danger);
      color: var(--surface);
    }

    .cj-btn-danger:hover {
      background: #8a2f24;
    }

    .cj-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .cj-loading {
      padding: 60px 20px;
      text-align: center;
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      color: var(--muted);
      line-height: 1.6;
    }

    .cj-empty {
      padding: 50px 24px;
      text-align: center;
      border: 3px dashed var(--ink);
      background: var(--surface);
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      color: var(--muted);
      line-height: 1.7;
    }

    .cj-empty-icon {
      font-size: 52px;
      display: block;
      margin-bottom: 14px;
      line-height: 1;
    }

    @media (max-width: 640px) {
      .cj-page { padding: 16px 14px 40px; }
      .cj-card { padding: 18px 14px; }
      .cj-title { font-size: 22px; }
      .cj-actions { flex-direction: column; }
      .cj-btn { justify-content: center; }
      .cj-success { padding: 22px 16px; }
    }
  `
})
export class ChallengeJoin implements OnInit {
    private _route = inject(ActivatedRoute);
    private _challenges = inject(ChallengeService);
    private _toast = inject(ToastService);
    private _confirm = inject(ConfirmService);

    public service = this._challenges;

    challenge: WritableSignal<IChallenge | null> = signal<IChallenge | null>(null);
    selectedPhoto: WritableSignal<File | null> = signal<File | null>(null);
    previewUrl: WritableSignal<string | null> = signal<string | null>(null);
    caption = '';
    submitting: WritableSignal<boolean> = signal<boolean>(false);

    get challengeId(): number {
        return Number(this._route.snapshot.paramMap.get('id'));
    }

    ngOnInit(): void {
        this._challenges.loadActive();
        this._challenges.loadMyParticipation(this.challengeId);

        setTimeout(() => {
            const active = this._challenges.active();
            if (active && active.id === this.challengeId) {
                this.challenge.set(active);
            }
        }, 300);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        if (!file) return;

        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            this._toast.show('الملف لازم يكون صورة JPG أو PNG', 'error');
            input.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this._toast.show('حجم الصورة لازم يكون أقل من 5 ميجا', 'error');
            input.value = '';
            return;
        }

        this.selectedPhoto.set(file);

        const reader = new FileReader();
        reader.onload = () => this.previewUrl.set(reader.result as string);
        reader.readAsDataURL(file);
    }

    removePhoto(): void {
        this.selectedPhoto.set(null);
        this.previewUrl.set(null);
        const input = document.getElementById('photo-input') as HTMLInputElement | null;
        if (input) input.value = '';
    }

    submit(): void {
        const photo = this.selectedPhoto();

        if (!photo) {
            this._toast.show('ارفع صورة مشاركتك', 'error');
            return;
        }

        if (this.caption.length > 300) {
            this._toast.show('التعليق طويل جداً — الحد 300 حرف', 'error');
            return;
        }

        this.submitting.set(true);

        this._challenges.submitParticipation(this.challengeId, this.caption, photo).subscribe({
            next: (res) => {
                this._toast.show(res.message, 'success');
                this.submitting.set(false);
                this.selectedPhoto.set(null);
                this.previewUrl.set(null);
                this.caption = '';
                this._challenges.loadMyParticipation(this.challengeId);
            },
            error: (err) => {
                this._toast.show(err.error?.message || 'فشل الإرسال', 'error');
                this.submitting.set(false);
            }
        });
    }

    async deleteMyParticipation(): Promise<void> {
        const p = this.service.myParticipation();
        if (!p) return;

        const ok = await this._confirm.open({
            title: 'حذف المشاركة',
            message: 'هل تريد حذف مشاركتك؟ لا يمكن التراجع عن هذا الإجراء.',
            confirmText: 'احذف',
            cancelText: 'إلغاء',
            tone: 'danger'
        });

        if (!ok) return;

        this._challenges.deleteMyParticipation(p.id).subscribe({
            next: (res) => {
                this._toast.show(res.message, 'success');
                this._challenges.loadMyParticipation(this.challengeId);
            },
            error: (err) => this._toast.show(err.error?.message || 'فشل الحذف', 'error')
        });
    }

    rankLabel(rank: number): string {
        if (rank === 1) return '🥇 المركز الأول';
        if (rank === 2) return '🥈 المركز الثاني';
        if (rank === 3) return '🥉 المركز الثالث';
        return '';
    }
}