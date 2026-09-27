import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Store } from '@ngrx/store';
import { QuotesActions } from '../../../state/quotes/quotes.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LineItem {
  description: string;
  unitPrice: number;
  quantity: number;
}

@Component({
  imports: [FormField, CommonModule, FormsModule, RouterLink],
  selector: 'app-quote-form',
  styles: ``,
  templateUrl: './quote-form.html',
})
export class QuoteForm {
  private store = inject(Store);
  private toast = inject(ToastService);
  private popup = inject(PopupService);
  private router = inject(Router);

  formModel = signal({
    clientName: '',
    clientEmail: '',
    taxType: '2',
    lineItems: [] as LineItem[]
  });

  quoteForm = form(this.formModel, () => { });

  constructor() {
    this.addLineItem();
  }

  lineItemsCount = computed(() => this.formModel().lineItems.length);

  addLineItem() {
    this.formModel.update(model => ({
      ...model,
      lineItems: [...model.lineItems, { description: '', unitPrice: 0, quantity: 1 }]
    }));
  }

  removeLineItem(index: number) {
    if (this.lineItemsCount() <= 1) {
      this.toast.show('لازم يبقى فيه بند واحد على الأقل', 'error');
      return;
    }

    this.popup.confirm({
      title: 'حذف البند',
      message: 'متأكد إنك عايز تحذف البند ده؟',
      type: 'danger',
      confirmLabels: 'احذف',
      cancelLabels: 'رجوع'
    }).then(confirmed => {
      if (confirmed) {
        this.formModel.update(model => ({
          ...model,
          lineItems: model.lineItems.filter((_, i) => i !== index)
        }));
      }
    });
  }

  lineSubtotals = computed(() => {
    return this.formModel().lineItems.map(item => item.unitPrice * item.quantity);
  });

  totalSubtotal = computed(() => {
    return this.lineSubtotals().reduce((sum, val) => sum + val, 0);
  });

  onSubmit() {
    const model = this.formModel();

    const quoteData = {
      ...model,
      taxType: Number(model.taxType)
    };

    if (!model.clientName.trim() || !model.clientEmail.trim()) {
      this.toast.show('اسم العميل والبريد الإلكتروني مطلوبين', 'error');
      return;
    }

    const hasValidItems = model.lineItems.every(
      item => item.description.trim() && item.unitPrice > 0 && item.quantity > 0
    );
    if (!hasValidItems) {
      this.toast.show('تأكد من ملء جميع البنود بشكل صحيح', 'error');
      return;
    }

    this.store.dispatch(
      QuotesActions.createQuote({ quoteData })
    );
    setTimeout(() => {
      this.router.navigate(['/quotes']);
    }, 500);
  }
}