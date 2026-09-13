import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../../core/services/quiz.service';
import { CompanyService } from '../../../core/services/company.service';
import { ToastService } from '../../../shared/services/toast.service';
import { PopupService } from '../../../shared/services/popup.service';

interface IMetric { label: string; value: string; delta: string; tone: 'blue' | 'amber' | 'green' | 'red'; }

@Component({
    imports: [RouterLink, FormsModule],
    selector: 'app-quiz-dashboard',
    templateUrl: './quiz-dashboard.html',
    styles: `
    .dash {
      min-height: 100vh;
      background: var(--paper);
      position: relative;
      padding: 32px 20px 80px;
    }

    .dash::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(13,13,13,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(13,13,13,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .dash-in { position: relative; max-width: 1240px; margin: 0 auto; z-index: 1; }

    .dash-head {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: end;
      gap: 24px;
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
      line-height: 1.1;
    }

    .title em { color: var(--blue); font-style: normal; }

    .sub { font-size: 15px; color: var(--muted); margin: 0; }

    .company-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border: 1px solid var(--line);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 1px;
      background: var(--paper-2);
      margin-top: 10px;
    }

    .company-badge-dot {
      width: 6px;
      height: 6px;
      background: var(--green);
    }

    .head-actions { display: flex; gap: 10px; }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border: 2px solid var(--line);
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      background: transparent;
      color: var(--ink);
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .btn-solid { background: var(--ink); color: var(--paper); }

    .btn-solid:hover {
      background: var(--blue);
      border-color: var(--blue);
      box-shadow: 4px 4px 0 var(--line);
      transform: translate(-2px, -2px);
    }

    .btn-ghost:hover { background: var(--paper-2); }

    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border: 2px solid var(--line);
      margin-bottom: 24px;
      background: var(--paper);
    }

    .metric {
      padding: 20px 18px;
      border-left: 2px solid var(--line);
    }

    .metric:last-child { border-left: none; }

    .metric-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      display: block;
      margin-bottom: 10px;
    }

    .metric-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -1.5px;
      display: block;
      line-height: 1;
      margin-bottom: 8px;
    }

    .metric-value.tone-blue { color: var(--blue); }
    .metric-value.tone-amber { color: var(--amber); }
    .metric-value.tone-green { color: var(--green); }
    .metric-value.tone-red { color: var(--red); }

    .metric-delta {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--muted);
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(13,13,13,0.15);
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: var(--muted);
    }

    .toolbar-dot { width: 8px; height: 8px; background: var(--green); display: inline-block; }

    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

    .card {
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 22px;
      position: relative;
      transition: all 0.15s ease;
      display: flex;
      flex-direction: column;
      min-height: 240px;
    }

    .card::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: var(--blue);
    }

    .card::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: -2px;
      width: 12px;
      height: 12px;
      background: var(--line);
    }

    .card:hover { box-shadow: 6px 6px 0 var(--line); transform: translate(-3px, -3px); }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      margin-bottom: 14px;
      border-bottom: 1px solid rgba(13,13,13,0.15);
    }

    .card-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      color: var(--muted);
      text-transform: uppercase;
    }

    .card-status {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      padding: 3px 8px;
      background: var(--green);
      color: var(--paper);
      letter-spacing: 1px;
    }

    .card-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 14px;
      line-height: 1.3;
      letter-spacing: -0.5px;
    }

    .card-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid var(--line);
      margin-bottom: 16px;
    }

    .card-stat { padding: 10px; border-left: 1px solid var(--line); }
    .card-stat:last-child { border-left: none; }

    .card-stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 1px;
      color: var(--muted);
      display: block;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .card-stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 700;
      color: var(--ink);
    }

    .card-actions { display: flex; gap: 8px; margin-top: auto; }

    .card-action {
      flex: 1;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 700;
      border: 2px solid var(--line);
      background: transparent;
      cursor: pointer;
      font-family: inherit;
      text-align: center;
      text-decoration: none;
      color: var(--ink);
      transition: all 0.15s ease;
    }

    .card-action-primary { background: var(--ink); color: var(--paper); }

    .card-action-primary:hover { background: var(--blue); border-color: var(--blue); }

    .card-action-danger { color: var(--red); border-color: var(--red); flex: 0 0 44px; }

    .card-action-danger:hover { background: var(--red); color: var(--paper); }

    .card-action-ghost:hover { background: var(--paper-2); }

    .empty {
      grid-column: 1 / -1;
      padding: 60px 30px;
      border: 2px dashed var(--line);
      text-align: center;
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
      font-size: 21px;
      font-weight: 700;
      margin: 0 0 6px;
    }

    .empty-sub { font-size: 14.5px; color: var(--muted); margin: 0 0 20px; }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(13,13,13,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 20px;
    }

    .modal {
      background: var(--paper);
      border: 2px solid var(--line);
      padding: 28px;
      width: 100%;
      max-width: 460px;
      box-shadow: 8px 8px 0 var(--line);
    }

    .modal-head { margin-bottom: 20px; }

    .modal-title {
      font-family: 'Noto Kufi Arabic', sans-serif;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 4px 0 0;
    }

    .modal-field { margin-bottom: 14px; }

    .modal-label {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 6px;
    }

    .modal-input {
      width: 100%;
      padding: 11px 13px;
      border: 2px solid var(--line);
      background: var(--paper-2);
      color: var(--ink);
      font-size: 14.5px;
      outline: none;
    }

    .modal-input:focus {
      background: var(--paper);
      box-shadow: 4px 4px 0 var(--blue);
      transform: translate(-2px, -2px);
    }

    .modal-actions { display: flex; gap: 10px; margin-top: 20px; }

    @media (max-width: 1024px) {
      .metrics { grid-template-columns: repeat(2, 1fr); }
      .metric:nth-child(2) { border-left: none; }
      .metric:nth-child(3) { border-top: 2px solid var(--line); border-left: none; }
      .metric:nth-child(4) { border-top: 2px solid var(--line); }
      .grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 640px) {
      .dash { padding: 20px 14px 60px; }
      .dash-head { grid-template-columns: 1fr; }
      .grid { grid-template-columns: 1fr; }
      .metrics { grid-template-columns: 1fr; }
      .metric { border-left: none; border-top: 2px solid var(--line); }
      .metric:first-child { border-top: none; }
      .modal { padding: 22px; }
    }
  `
})
export class QuizDashboard implements OnInit {
    public _QuizService: QuizService = inject(QuizService);
    public _CompanyService: CompanyService = inject(CompanyService);
    private _Toast: ToastService = inject(ToastService);
    private _Popup: PopupService = inject(PopupService);
    private _Router: Router = inject(Router);

    metrics: WritableSignal<IMetric[]> = signal<IMetric[]>([
        { label: 'إجمالي الاختبارات', value: '12', delta: '+3 هذا الشهر', tone: 'blue' },
        { label: 'محاولات مكتملة', value: '1,248', delta: '+18% عن الشهر الماضي', tone: 'green' },
        { label: 'متوسط الدرجات', value: '76%', delta: '+4.2 نقطة', tone: 'amber' },
        { label: 'قيد التقدم', value: '9', delta: 'محاولات نشطة', tone: 'red' }
    ]);

    showCreateModal: WritableSignal<boolean> = signal(false);
    newQuizTitle = '';
    newQuizDuration = 30;

    ngOnInit(): void {
        this._CompanyService.loadMine().subscribe({
            next: (company) => {
                this.loadQuizzes(company.id);
            },
            error: (err) => {
                if (err.status === 404) {
                    this._Toast.show('لم يتم العثور على شركتك، جاري التحويل...', 'info');
                    setTimeout(() => this._Router.navigate(['/company-setup']), 700);
                } else if (err.status === 401) {
                    this._Router.navigate(['/login']);
                } else {
                    this._Toast.show('تعذّر الاتصال بالخادم', 'error');
                }
            }
        });
    }

    loadQuizzes(companyId: number): void {
        this._QuizService.loadCompanyQuizzes(companyId);
    }

    openCreate(): void {
        this.newQuizTitle = '';
        this.newQuizDuration = 30;
        this.showCreateModal.set(true);
    }

    closeCreate(): void { this.showCreateModal.set(false); }

    submitCreate(): void {
        const companyId = this._CompanyService.company()?.id;
        if (!companyId) {
            this._Toast.show('لم يتم العثور على الشركة', 'error');
            return;
        }

        if (!this.newQuizTitle.trim() || this.newQuizDuration < 1) {
            this._Toast.show('أدخل بيانات صحيحة', 'error');
            return;
        }

        this._QuizService.createQuiz(companyId, this.newQuizTitle, this.newQuizDuration).subscribe({
            next: () => {
                this._Toast.show('تم إنشاء الاختبار', 'success');
                this.closeCreate();
                this.loadQuizzes(companyId);
            },
            error: () => this._Toast.show('فشل الإنشاء', 'error')
        });
    }

    async deleteQuiz(id: number): Promise<void> {
        const companyId = this._CompanyService.company()?.id;
        if (!companyId) return;

        const ok = await this._Popup.confirm({
            title: 'حذف الاختبار',
            message: 'سيتم حذف الاختبار وكل أسئلته نهائياً. متأكد؟',
            type: 'danger',
            confirmLabel: 'احذف'
        });

        if (!ok) return;

        this._QuizService.deleteQuiz(id, companyId).subscribe({
            next: () => {
                this._Toast.show('تم الحذف', 'info');
                this.loadQuizzes(companyId);
            },
            error: () => this._Toast.show('فشل الحذف', 'error')
        });
    }
}