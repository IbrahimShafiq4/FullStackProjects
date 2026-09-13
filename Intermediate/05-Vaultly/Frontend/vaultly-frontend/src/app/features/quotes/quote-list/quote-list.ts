import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupService } from '../../../shared/services/popup.service';
import { selectAllQuotes, selectQuotesLoading, selectTotalRevenue } from '../../../state/quotes/quotes.selectors';
import { QuotesActions } from '../../../state/quotes/quotes.actions';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-quote-list',
  styles: ``,
  templateUrl: './quote-list.html',
})
export class QuoteList implements OnInit {
  private store: Store = inject(Store);
  private popup: PopupService = inject(PopupService);

  quotes = this.store.selectSignal(selectAllQuotes);
  loading = this.store.selectSignal(selectQuotesLoading);
  totalRevenue = this.store.selectSignal(selectTotalRevenue);

  ngOnInit(): void {
    this.store.dispatch(QuotesActions.loadQuotes());
  }

  async onDeleteClick(quoteId: number) {
    const confirmed = await this.popup.confirm({
      title: 'حذف العرض',
      message: 'هل انت متأكد من حذف هذا العرض ؟',
      type: 'danger'
    })

    if(confirmed) {
      this.store.dispatch(
        QuotesActions.deleteQuote({ quoteId })
      )
    }
  }
}
