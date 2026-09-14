import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChallengeService, IChallenge, ICreateChallenge } from '../../../core/services/challenge.service';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmService } from '../../../shared/services/confirm.service';

@Component({
  imports: [FormsModule, DatePipe, RouterLink],
  selector: 'app-admin-challenges',
  templateUrl: './challenges.html',
  styles: `
    .ac-page {
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

    .ac-inner { max-width: 900px; margin: 0 auto; }

    .ac-head {
      padding-bottom: 14px;
      margin-bottom: 20px;
      border-bottom: 3px solid var(--ink);
    }

    .ac-title {
      font-family: var(--font-pixel-ar);
      font-size: 28px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 4px;
      line-height: 1.2;
    }

    .ac-sub {
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      color: var(--muted);
      margin: 0;
      line-height: 1.6;
    }

    .ac-form {
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 6px 6px 0 var(--ink);
      padding: 20px;
      margin-bottom: 24px;
      position: relative;
    }

    .ac-form::before {
      content: '';
      position: absolute;
      top: -3px;
      right: -3px;
      width: 14px;
      height: 14px;
      background: var(--orange);
      border: 3px solid var(--ink);
    }

    .ac-form-title {
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 14px;
      color: var(--ink);
      line-height: 1.2;
      padding-bottom: 10px;
      border-bottom: 3px dashed var(--ink);
    }

    .ac-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-bottom: 12px;
    }

    .ac-label {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink-2);
      text-align: start;
      line-height: 1.4;
    }

    .ac-input, .ac-textarea {
      width: 100%;
      padding: 9px 12px;
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

    .ac-textarea {
      resize: vertical;
      min-height: 80px;
      line-height: 1.7;
    }

    .ac-input::placeholder,
    .ac-textarea::placeholder {
      color: var(--muted-2);
      opacity: 0.7;
    }

    .ac-input:focus, .ac-textarea:focus {
      background: var(--surface);
      box-shadow: 3px 3px 0 var(--orange);
      transform: translate(-1px, -1px);
    }

    .ac-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .ac-submit {
      width: 100%;
      padding: 12px 18px;
      margin-top: 8px;
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      font-weight: 700;
      color: var(--surface);
      background: var(--olive);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .ac-submit:hover {
      background: var(--olive-2);
      transform: translate(-1px, -1px);
      box-shadow: 5px 5px 0 var(--ink);
    }

    .ac-submit:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .ac-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: 4px 4px 0 var(--ink);
    }

    .ac-list-title {
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

    .ac-list-title::before {
      content: '';
      width: 10px;
      height: 10px;
      background: var(--orange);
      border: 2px solid var(--ink);
    }

    .ac-list { display: flex; flex-direction: column; gap: 12px; }

    .ac-card {
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      padding: 16px;
      position: relative;
      transition: all 0.1s steps(2);
    }

    .ac-card:hover {
      transform: translate(-1px, -1px);
      box-shadow: 5px 5px 0 var(--ink);
    }

    .ac-card-active {
      border-color: var(--olive);
      box-shadow: 4px 4px 0 var(--olive);
    }

    .ac-card-active::before {
      content: 'ACTIVE';
      position: absolute;
      top: -12px;
      right: 14px;
      padding: 2px 8px;
      background: var(--olive);
      color: var(--surface);
      font-family: var(--font-pixel-en);
      font-size: 14px;
      letter-spacing: 1.5px;
      line-height: 1.3;
      border: 2.5px solid var(--ink);
    }

    .ac-card-title {
      font-family: var(--font-pixel-ar);
      font-size: 18px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 6px;
      line-height: 1.3;
    }

    .ac-card-desc {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      color: var(--muted);
      line-height: 1.75;
      margin: 0 0 12px;
      text-align: start;
    }

    .ac-card-meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      font-family: var(--font-pixel-en);
      font-size: 14px;
      color: var(--ink-2);
      padding-top: 10px;
      border-top: 2px dashed var(--ink);
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .ac-card-meta span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .ac-card-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .ac-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 7px 14px;
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
      background: var(--surface);
      border: 2px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
      line-height: 1.2;
      text-decoration: none;
    }

    .ac-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .ac-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 0 0 0 var(--ink);
    }

    .ac-btn-activate {
      background: var(--olive);
      color: var(--surface);
    }

    .ac-btn-activate:hover {
      background: var(--olive-2);
    }

    .ac-btn-submissions {
      background: var(--gold);
      color: var(--ink);
      font-weight: 700;
    }

    .ac-btn-submissions:hover {
      background: #d8a838;
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .ac-btn-danger {
      background: var(--danger);
      color: var(--surface);
    }

    .ac-btn-danger:hover {
      background: #8a2f24;
    }

    .ac-empty {
      padding: 40px 20px;
      text-align: center;
      border: 3px dashed var(--ink);
      font-family: var(--font-pixel-ar);
      font-size: 16px;
      color: var(--muted);
      background: var(--surface);
      line-height: 1.6;
    }

    @media (max-width: 640px) {
      .ac-page { padding: 16px 14px 40px; }
      .ac-row { grid-template-columns: 1fr; }
      .ac-form { padding: 16px; }
      .ac-title { font-size: 22px; }
      .ac-card-actions { width: 100%; }
      .ac-btn { flex: 1; }
    }
  `
})
export class Challenges implements OnInit {
  private _challenges = inject(ChallengeService);
  private _toast = inject(ToastService);
  private _confirm = inject(ConfirmService);

  public service = this._challenges;

  model: ICreateChallenge = {
    title: '',
    description: '',
    reward: '',
    days: 5,
    target: 5
  };

  submitting: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this._challenges.loadAll();
  }

  submit(): void {
    if (!this.model.title.trim() || !this.model.description.trim() || !this.model.reward.trim()) {
      this._toast.show('املا كل الحقول', 'error');
      return;
    }

    if (this.model.days < 1 || this.model.target < 1) {
      this._toast.show('الأيام والهدف لازم يكونوا أكبر من صفر', 'error');
      return;
    }

    this.submitting.set(true);

    this._challenges.create({
      title: this.model.title.trim(),
      description: this.model.description.trim(),
      reward: this.model.reward.trim(),
      days: this.model.days,
      target: this.model.target
    }).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this.model = { title: '', description: '', reward: '', days: 5, target: 5 };
        this.submitting.set(false);
        this._challenges.loadAll();
      },
      error: (err) => {
        this._toast.show(err.error || 'فشل الإنشاء', 'error');
        this.submitting.set(false);
      }
    });
  }

  activate(id: number): void {
    this._challenges.activate(id).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this._challenges.loadAll();
      },
      error: () => this._toast.show('فشل التفعيل', 'error')
    });
  }

  async remove(id: number): Promise<void> {
    const ok = await this._confirm.open({
      title: 'حذف التحدي',
      message: 'هل تريد حذف هذا التحدي نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      confirmText: 'احذف',
      cancelText: 'إلغاء',
      tone: 'danger'
    });

    if (!ok) return;

    this._challenges.delete(id).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this._challenges.loadAll();
      },
      error: () => this._toast.show('فشل الحذف', 'error')
    });
  }
}