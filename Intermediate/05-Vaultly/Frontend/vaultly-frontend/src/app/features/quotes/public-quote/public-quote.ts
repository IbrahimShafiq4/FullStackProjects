import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { IPublicQuote } from '../../../state/quotes/quotes.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-public-quote',
  templateUrl: './public-quote.html',
})
export class PublicQuote implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private readonly API_URL: string = 'https://localhost:7162/api/public/quotes';

  token: string = '';
  quote: WritableSignal<IPublicQuote | null> = signal<IPublicQuote | null>(null);
  loading: WritableSignal<boolean> = signal<boolean>(true);
  error: WritableSignal<string | null> = signal<string | null>(null);
  responding: WritableSignal<boolean> = signal<boolean>(false);
  responded: WritableSignal<boolean> = signal<boolean>(false);
  note: string = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';

    if (!this.token) {
      this.error.set('اللينك غير صحيح.');
      this.loading.set(false);
      return;
    }

    this.http.get<IPublicQuote>(`${this.API_URL}/${this.token}`).subscribe({
      next: (q) => {
        this.quote.set(q);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('العرض غير موجود أو منتهي الصلاحية.');
        this.loading.set(false);
      }
    });
  }

  respond(accepted: boolean) {
    this.responding.set(true);

    this.http.post<{ message: string }>(
      `${this.API_URL}/${this.token}/respond`,
      { accepted, note: this.note || null }
    ).subscribe({
      next: (res) => {
        this.responding.set(false);
        this.responded.set(true);
        this.toast.show(res.message, 'success');
        this.quote.update(q => q ? { ...q, status: accepted ? 'Accepted' : 'Rejected', clientNote: this.note || null } : q);
      },
      error: (err) => {
        this.responding.set(false);
        this.toast.show(err.error?.message || 'حصل خطأ، حاول تاني', 'error');
      }
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      Draft: 'مسودة',
      Sent: 'في انتظار قرارك',
      Accepted: 'مقبول',
      Rejected: 'مرفوض',
      Invoiced: 'مفوتر'
    };
    return labels[status] ?? status;
  }

  statusTone(status: string): string {
    switch (status) {
      case 'Sent': return 'text-nile-600 dark:text-nile-300 border-nile-500/40';
      case 'Accepted': return 'text-emerald-700 dark:text-emerald-300 border-emerald-600/40';
      case 'Rejected': return 'text-terracotta-600 dark:text-terracotta-300 border-terracotta-500/40';
      case 'Invoiced': return 'text-bronze-700 dark:text-bronze-300 border-bronze-500/40';
      default: return '';
    }
  }
}