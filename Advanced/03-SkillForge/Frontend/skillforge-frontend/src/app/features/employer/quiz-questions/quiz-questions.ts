import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService, IQuestion } from '../../../core/services/quiz.service';
import { ToastService } from '../../../shared/services/toast.service';
import { PopupService } from '../../../shared/services/popup.service';
import { QuestionBuilder } from '../question-builder/question-builder';

@Component({
    imports: [RouterLink, QuestionBuilder],
    selector: 'app-quiz-questions',
    templateUrl: './quiz-questions.html',
    styles: `
    .qp {
      min-height: 100vh;
      background: var(--paper);
      position: relative;
      padding: 32px 20px 100px;
    }

    .qp::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .qp-in { position: relative; max-width: 960px; margin: 0 auto; z-index: 1; }

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

    .qp-head {
      padding-bottom: 24px;
      border-bottom: 2px solid var(--line);
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      align-items: end;
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

    .qp-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: clamp(1.6rem, 3.2vw, 2.4rem);
      font-weight: 700;
      letter-spacing: -1.2px;
      line-height: 1.15;
      margin: 0 0 8px;
    }

    .qp-title em { color: var(--blue); font-style: normal; }

    .qp-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      color: var(--muted);
      margin: 0;
      letter-spacing: 0.5px;
    }

    .qp-meta {
      display: flex;
      border: 2px solid var(--line);
    }

    .qp-meta-item {
      padding: 10px 16px;
      border-left: 2px solid var(--line);
      text-align: center;
    }

    .qp-meta-item:first-child { border-left: none; }

    .qp-meta-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      display: block;
      margin-bottom: 4px;
    }

    .qp-meta-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 18px;
      font-weight: 700;
      color: var(--ink);
    }

    .qp-meta-val.blue { color: var(--blue); }
    .qp-meta-val.amber { color: var(--amber); }

    .stats-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 18px;
      border: 2px solid var(--line);
      background: var(--paper-2);
      margin-bottom: 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      letter-spacing: 1px;
    }

    .stats-bar-left {
      display: flex;
      gap: 18px;
      align-items: center;
    }

    .stats-bar-dot {
      width: 8px;
      height: 8px;
      background: var(--green);
      display: inline-block;
      margin-right: 6px;
    }

    .stats-bar-key { color: var(--muted); }
    .stats-bar-val { font-weight: 700; color: var(--ink); }

    .section-tag {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--muted);
    }

    .section-tag-line {
      flex: 1;
      height: 1px;
      background: var(--line);
      opacity: 0.2;
    }

    .q-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 32px;
    }

    .q-item {
      border: 2px solid var(--line);
      background: var(--paper);
      padding: 20px;
      position: relative;
      transition: all 0.15s ease;
    }

    .q-item::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      background: var(--blue);
    }

    .q-item:hover { box-shadow: 5px 5px 0 var(--line); transform: translate(-2px, -2px); }

    .q-item-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px dashed rgba(13,13,13,0.2);
    }

    .q-item-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 2px;
      color: var(--blue);
      font-weight: 700;
      flex-shrink: 0;
    }

    .q-item-badges {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-shrink: 0;
    }

    .q-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      padding: 3px 10px;
      border: 1px solid var(--line);
      letter-spacing: 1px;
      background: var(--paper-2);
    }

    .q-badge-blue {
      background: var(--blue);
      color: var(--paper);
      border-color: var(--blue);
    }

    .q-badge-amber {
      background: var(--amber);
      color: var(--ink);
      border-color: var(--amber);
    }

    .q-item-text {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 17px;
      font-weight: 700;
      line-height: 1.5;
      letter-spacing: -0.3px;
      margin: 0 0 14px;
      color: var(--ink);
    }

    .q-item-opts {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }

    .q-item-opt {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border: 1px solid var(--line);
      background: var(--paper-2);
      font-size: 14px;
    }

    .q-item-opt-mark {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      color: var(--muted);
      width: 18px;
    }

    .q-item-foot {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px dashed rgba(13,13,13,0.2);
    }

    .q-action {
      padding: 7px 14px;
      border: 2px solid var(--line);
      background: transparent;
      color: var(--ink);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .q-action:hover { background: var(--paper-2); }

    .q-action-danger {
      color: var(--red);
      border-color: var(--red);
    }

    .q-action-danger:hover {
      background: var(--red);
      color: var(--paper);
    }

    .empty-questions {
      border: 2px dashed var(--line);
      padding: 50px 30px;
      text-align: center;
      margin-bottom: 32px;
      background: var(--paper);
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
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 6px;
    }

    .empty-sub {
      font-size: 14.5px;
      color: var(--muted);
      margin: 0;
    }

    .bottom-actions {
      display: flex;
      gap: 10px;
      padding-top: 24px;
      border-top: 2px solid var(--line);
    }

    .btn-primary {
      flex: 1;
      padding: 14px 22px;
      background: var(--ink);
      color: var(--paper);
      border: 2px solid var(--line);
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .btn-primary:hover {
      background: var(--blue);
      border-color: var(--blue);
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    .btn-ghost {
      padding: 14px 22px;
      background: transparent;
      color: var(--ink);
      border: 2px solid var(--line);
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
    }

    .btn-ghost:hover { background: var(--paper-2); }

    .btn-arrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
    }

    @media (max-width: 768px) {
      .qp { padding: 20px 14px 80px; }
      .qp-head { grid-template-columns: 1fr; }
      .qp-meta { width: 100%; }
      .qp-meta-item { flex: 1; padding: 8px 10px; }
      .bottom-actions { flex-direction: column; }
      .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
    }
  `
})
export class QuizQuestions implements OnInit {
    public _QuizService: QuizService = inject(QuizService);
    private _ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private _Router: Router = inject(Router);
    private _Toast: ToastService = inject(ToastService);
    private _Popup: PopupService = inject(PopupService);

    quizId: WritableSignal<number> = signal<number>(0);
    totalPoints: WritableSignal<number> = signal<number>(0);

    ngOnInit(): void {
        const id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
        this.quizId.set(id);
        this.reload();
    }

    reload(): void {
        this._QuizService.loadQuizWithQuestions(this.quizId());
        setTimeout(() => this.computeTotalPoints(), 400);
    }

    private computeTotalPoints(): void {
        const quiz = this._QuizService.currentQuiz();
        if (!quiz) return;
        const total = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
        this.totalPoints.set(total);
    }

    onQuestionAdded(): void {
        this._Toast.show('تم إضافة السؤال بنجاح ✅', 'success');
        this.reload();
    }

    async deleteQuestion(questionId: number): Promise<void> {
        const ok = await this._Popup.confirm({
            title: 'حذف السؤال',
            message: 'سيتم حذف السؤال وكل خياراته نهائياً. متأكد؟',
            type: 'danger',
            confirmLabel: 'احذف'
        });

        if (!ok) return;

        this._QuizService.deleteQuestion(questionId).subscribe({
            next: () => {
                this._Toast.show('تم حذف السؤال', 'success');
                this.reload();
            },
            error: () => this._Toast.show('فشل الحذف', 'error')
        });
    }

    getCorrectCount(question: IQuestion): number {
        return question.options.length;
    }
}