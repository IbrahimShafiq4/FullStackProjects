import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { selectAllQuotes, selectQuotesLoading, selectTotalRevenue } from '../../../state/quotes/quotes.selectors';
import { QuotesActions } from '../../../state/quotes/quotes.actions';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuoteGlyph } from '../../../shared/components/quote-glyph/quote-glyph';
import { getQuoteIdentity } from '../../../utils/quote-identity';

@Component({
  imports: [RouterLink, CommonModule, QuoteGlyph],
  selector: 'app-quote-list',
  styles: ``,
  templateUrl: './quote-list.html',
})
export class QuoteList implements OnInit {
  private store: Store = inject(Store);
  private popup: PopupService = inject(PopupService);
  private toast: ToastService = inject(ToastService);

  quotes = this.store.selectSignal(selectAllQuotes);
  loading = this.store.selectSignal(selectQuotesLoading);
  totalRevenue = this.store.selectSignal(selectTotalRevenue);

  ngOnInit(): void {
    this.store.dispatch(QuotesActions.loadQuotes());
  }

  identity(id: number) {
    return getQuoteIdentity(id);
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      Draft: 'مسودة',
      Sent: 'مُرسل',
      Accepted: 'مقبول',
      Rejected: 'مرفوض',
      Invoiced: 'مفوتر'
    };
    return labels[status] ?? status;
  }

  statusTone(status: string): string {
    switch (status) {
      case 'Draft': return 'text-basalt-400 dark:text-papyrus-200/60 border-basalt-300/30 dark:border-papyrus-200/20';
      case 'Sent': return 'text-nile-600 dark:text-nile-300 border-nile-500/30';
      case 'Accepted': return 'text-emerald-700 dark:text-emerald-300 border-emerald-600/30';
      case 'Rejected': return 'text-terracotta-600 dark:text-terracotta-300 border-terracotta-500/30';
      case 'Invoiced': return 'text-bronze-700 dark:text-bronze-300 border-bronze-500/40';
      default: return '';
    }
  }

  async onSendClick(quoteId: number) {
    const confirmed = await this.popup.confirm({
      title: 'إرسال العرض',
      message: 'هيتم توليد لينك عام تقدر تبعته للعميل. متأكد؟',
      confirmLabels: 'أرسل',
      cancelLabels: 'رجوع'
    });

    if (confirmed) {
      this.store.dispatch(QuotesActions.sendQuote({ quoteId }));
    }
  }

  async copyLink(token: string) {
    const url = `${window.location.origin}/q/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      this.toast.show('تم نسخ اللينك', 'success');
    } catch {
      this.toast.show('تعذّر نسخ اللينك', 'error');
    }
  }

  openLink(token: string) {
    window.open(`/q/${token}`, '_blank');
  }

  async onDeleteClick(quoteId: number) {
    const confirmed = await this.popup.confirm({
      title: 'حذف العرض',
      message: 'متأكد إنك عايز تحذف العرض ده؟ الخطوة دي مش هترجع.',
      type: 'danger',
      confirmLabels: 'احذف',
      cancelLabels: 'رجوع'
    })

    if (confirmed) {
      this.store.dispatch(QuotesActions.deleteQuote({ quoteId }))
    }
  }
}