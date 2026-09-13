import { Component, inject, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { QuizService } from '../../../core/services/quiz.service';
import { ToastService } from '../../../shared/services/toast.service';

export interface IOptionText { text: string; isCorrect: boolean }
export type TChoice = 'SingleChoice' | 'MultipleChoice';

@Component({
    imports: [],
    selector: 'app-question-builder',
    templateUrl: './question-builder.html',
    styles: `
    .qb {
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 28px 24px;
      position: relative;
    }

    .qb::before {
      content: 'NEW QUESTION';
      position: absolute;
      top: -12px;
      right: 22px;
      background: var(--paper);
      padding: 0 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--blue);
      font-weight: 700;
    }

    .qb-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0 0 20px;
    }

    .field { margin-bottom: 16px; }

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
    .field-select {
      width: 100%;
      padding: 11px 13px;
      border: 2px solid var(--line);
      background: var(--paper-2);
      color: var(--ink);
      font-size: 14.5px;
      font-family: inherit;
      outline: none;
      transition: all 0.15s ease;
    }

    .field-input:focus,
    .field-select:focus {
      background: var(--paper);
      box-shadow: 4px 4px 0 var(--blue);
      transform: translate(-2px, -2px);
    }

    .row-2 {
      display: grid;
      grid-template-columns: 1fr 130px;
      gap: 10px;
    }

    .opts-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }

    .opt-row {
      display: grid;
      grid-template-columns: 42px 1fr 38px;
      gap: 8px;
      align-items: center;
    }

    .opt-check {
      width: 42px;
      height: 42px;
      border: 2px solid var(--line);
      background: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 15px;
      color: var(--ink);
      transition: all 0.15s ease;
    }

    .opt-check.active {
      background: var(--green);
      color: var(--paper);
      border-color: var(--green);
    }

    .opt-input {
      padding: 11px 13px;
      border: 2px solid var(--line);
      background: var(--paper-2);
      color: var(--ink);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      width: 100%;
    }

    .opt-input:focus {
      background: var(--paper);
      box-shadow: 3px 3px 0 var(--blue);
    }

    .opt-remove {
      width: 38px;
      height: 42px;
      border: 2px solid var(--red);
      background: transparent;
      color: var(--red);
      cursor: pointer;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 15px;
      transition: all 0.15s ease;
    }

    .opt-remove:hover {
      background: var(--red);
      color: var(--paper);
    }

    .add-opt {
      padding: 9px 14px;
      border: 2px dashed var(--line);
      background: transparent;
      color: var(--ink);
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      transition: all 0.15s ease;
    }

    .add-opt:hover { background: var(--paper-2); }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(13,13,13,0.15);
    }

    .btn {
      padding: 13px 22px;
      border: 2px solid var(--line);
      background: transparent;
      color: var(--ink);
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-primary {
      background: var(--ink);
      color: var(--paper);
      flex: 1;
    }

    .btn-primary:hover {
      background: var(--blue);
      border-color: var(--blue);
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    @media (max-width: 640px) {
      .qb { padding: 20px 16px; }
      .row-2 { grid-template-columns: 1fr; }
    }
  `
})
export class QuestionBuilder {
    private _QuizService: QuizService = inject(QuizService);
    private _ToastService: ToastService = inject(ToastService);

    quizId: InputSignal<number> = input.required<number>();
    questionAdded: OutputEmitterRef<void> = output<void>();

    text: WritableSignal<string> = signal<string>('');
    type: WritableSignal<TChoice> = signal<TChoice>('SingleChoice');
    points: WritableSignal<number> = signal<number>(1);
    options: WritableSignal<IOptionText[]> = signal<IOptionText[]>([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
    ]);

    addOption(): void {
        this.options.update((list: IOptionText[]) => [...list, { text: '', isCorrect: false }]);
    }

    removeOption(index: number): void {
        this.options.update((list: IOptionText[]) => list.filter((_, i) => i !== index));
    }

    updateOptionText(index: number, text: string): void {
        this.options.update((list: IOptionText[]) => list.map((o, i) => (i === index ? { ...o, text } : o)));
    }

    toggleCorrect(index: number): void {
        this.options.update((list) => {
            if (this.type() === 'SingleChoice') {
                return list.map((o, i) => ({ ...o, isCorrect: i === index }));
            }
            return list.map((o, i) => (i === index ? { ...o, isCorrect: !o.isCorrect } : o));
        });
    }

    onSubmit(): void {
        if (!this.text().trim() || this.options().some((o) => !o.text.trim())) {
            this._ToastService.show('لازم تملى نص السؤال وكل الخيارات', 'error');
            return;
        }

        if (!this.options().some((o) => o.isCorrect)) {
            this._ToastService.show('لازم تحدد إجابة صحيحة واحدة على الأقل', 'error');
            return;
        }

        this._QuizService.addQuestion(this.quizId(), {
            text: this.text(),
            type: this.type(),
            points: this.points(),
            options: this.options()
        }).subscribe({
            next: () => {
                this._ToastService.show('تم إضافة السؤال', 'success');
                this.text.set('');
                this.options.set([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
                this.questionAdded.emit();
            },
            error: () => this._ToastService.show('حصل خطأ', 'error')
        });
    }
}