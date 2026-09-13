import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { IAttemptResult, QuizService } from '../../../core/services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    imports: [],
    selector: 'app-exam-taking',
    templateUrl: './exam-taking.html',
    styles: `
    .exam {
      min-height: 100vh;
      background: var(--paper);
      position: relative;
      padding: 20px 20px 100px;
    }

    .exam::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .exam-in { position: relative; max-width: 780px; margin: 0 auto; z-index: 1; }

    .exam-bar {
      position: sticky;
      top: 76px;
      z-index: 20;
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 16px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      box-shadow: 6px 6px 0 var(--line);
    }

    .exam-bar-left {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .exam-bar-kicker {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--blue);
    }

    .exam-bar-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .exam-timer {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border: 2px solid var(--line);
      background: var(--paper-2);
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      flex-shrink: 0;
    }

    .exam-timer.urgent {
      background: var(--red);
      color: var(--paper);
      border-color: var(--red);
    }

    .exam-timer-dot {
      width: 10px;
      height: 10px;
      background: var(--green);
      flex-shrink: 0;
    }

    .exam-timer.urgent .exam-timer-dot { background: var(--paper); }

    .progress-wrap { margin-bottom: 20px; }

    .progress-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 2px;
      color: var(--muted);
      margin-bottom: 8px;
      display: block;
    }

    .progress-bar {
      height: 6px;
      background: var(--paper-2);
      border: 1px solid var(--line);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--blue);
      transition: width 0.4s ease;
    }

    .q-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .q-card {
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 24px;
      position: relative;
    }

    .q-card::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: var(--blue);
    }

    .q-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
      padding-bottom: 14px;
      margin-bottom: 18px;
      border-bottom: 1px solid rgba(13,13,13,0.15);
    }

    .q-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 2px;
      color: var(--blue);
      font-weight: 700;
      flex-shrink: 0;
    }

    .q-type {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      padding: 3px 8px;
      border: 1px solid var(--line);
      color: var(--muted);
      letter-spacing: 1px;
    }

    .q-text {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
      letter-spacing: -0.3px;
      margin: 0 0 18px;
      color: var(--ink);
    }

    .opts {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .opt {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border: 2px solid var(--line);
      background: var(--paper);
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }

    .opt:hover { background: var(--paper-2); }

    .opt.selected {
      background: var(--ink);
      color: var(--paper);
      border-color: var(--ink);
      box-shadow: 4px 4px 0 var(--blue);
      transform: translate(-2px, -2px);
    }

    .opt-box {
      width: 22px;
      height: 22px;
      border: 2px solid var(--line);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--paper);
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 12px;
      color: var(--ink);
    }

    .opt.selected .opt-box {
      background: var(--blue);
      border-color: var(--blue);
      color: var(--paper);
    }

    .opt-box.radio { border-radius: 50%; }

    .opt-text {
      font-size: 15px;
      font-weight: 500;
      line-height: 1.5;
    }

    .submit-bar {
      margin-top: 28px;
      display: flex;
      gap: 10px;
    }

    .submit-btn {
      flex: 1;
      padding: 16px 22px;
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
      transition: all 0.15s ease;
    }

    .submit-btn:hover {
      background: var(--blue);
      border-color: var(--blue);
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    .submit-arrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
    }

    @media (max-width: 640px) {
      .exam { padding: 16px 14px 80px; }
      .exam-bar { top: 68px; padding: 12px 14px; gap: 12px; }
      .exam-bar-title { font-size: 15px; }
      .exam-timer { font-size: 16px; padding: 8px 12px; }
      .q-card { padding: 18px; }
      .q-text { font-size: 16px; }
      .opt { padding: 10px 12px; }
    }
  `
})
export class ExamTaking implements OnInit, OnDestroy {
    public _QuizService: QuizService = inject(QuizService);
    private _Router: Router = inject(Router);
    private _ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private _PopupService: PopupService = inject(PopupService);
    private _ToastService: ToastService = inject(ToastService);

    attemptId: WritableSignal<number | null> = signal<number | null>(null);
    remainingSeconds: WritableSignal<number> = signal<number>(0);
    isUrget: WritableSignal<boolean> = signal<boolean>(false);
    answers: WritableSignal<Map<number, number[]>> = signal<Map<number, number[]>>(new Map());

    private timerInterval?: ReturnType<typeof setInterval>;

    async ngOnInit() {
        const quizId: number = Number(this._ActivatedRoute.snapshot.paramMap.get("id"));

        this._QuizService.loadQuizForCandidate(quizId);

        this._QuizService.startAttempt(quizId).subscribe({
            next: (response) => {
                this.attemptId.set(response.attemptId);
                this.startCountdown(new Date(response.mustSubmitBy));
            },
            error: (err) => {
                this._ToastService.show(
                    err.status === 401 ? 'انتهت الجلسة، سجّل دخول تاني' : 'فشل بدء المحاولة',
                    'error'
                );
                this._Router.navigate(['/candidate/quizzes']);
            }
        });
    }

    private startCountdown(deadline: Date): void {
        this.timerInterval = setInterval(() => {
            const remaining = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000));
            this.remainingSeconds.set(remaining);
            this.isUrget.set(remaining <= 60);

            if (remaining === 0) {
                clearInterval(this.timerInterval);
                this.onSubmit();
            }
        }, 1000);
    }

    formatTime(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    answeredCount(): number {
        return this.answers().size;
    }

    totalQuestions(): number {
        return this._QuizService.currentQuiz()?.questions?.length ?? 0;
    }

    progressPercent(): number {
        const total = this.totalQuestions();
        if (total === 0) return 0;
        return Math.round((this.answeredCount() / total) * 100);
    }

    toggleOption(questionId: number, optionId: number, isSingle: boolean): void {
        this.answers.update((map) => {
            const newMap = new Map(map);
            const current = newMap.get(questionId) ?? [];

            if (isSingle) {
                newMap.set(questionId, [optionId]);
            } else {
                const updated = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
                newMap.set(questionId, updated);
            }
            return newMap;
        });
    }

    isSelected(questionId: number, optionId: number): boolean {
        return this.answers().get(questionId)?.includes(optionId) ?? false;
    }

    async onSubmit() {
        const confirmed = await this._PopupService.confirm({
            title: 'تسليم الاختبار',
            message: 'هل أنت متأكد من التسليم؟ لن تتمكن من التعديل بعد ذلك',
            type: 'confirm'
        });

        if (!confirmed) return;

        clearInterval(this.timerInterval);

        const answersArray = Array.from(this.answers().entries())
            .map(([questionId, selectedOptionIds]) => ({ questionId, selectedOptionIds }));

        this._QuizService.submitAttempt(this.attemptId()!, answersArray).subscribe({
            next: (result: IAttemptResult) => {
                this._ToastService.show('تم تسجيل الاختبار بنجاح', 'success');
                this._Router.navigate(['/exam-result'], { state: { result } });
            },
            error: () => this._ToastService.show('حصل خطأ أثناء التسليم', 'error'),
        });
    }

    ngOnDestroy(): void {
        clearInterval(this.timerInterval);
    }
}