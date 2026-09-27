import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService, IInvoice } from '../../../core/services/billing.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-invoice-detail',
  imports: [RouterLink, DatePipe, DecimalPipe, FormsModule],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.css',
})
export class InvoiceDetail implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  readonly _billing = inject(BillingService);
  private readonly _toast = inject(ToastService);

  invoice = signal<IInvoice | null>(null);
  loading = signal(true);

  showPayForm = signal(false);
  payMethod = signal('Card');
  paying = signal(false);

  readonly methods = [
    { value: 'Card', label: 'بطاقة بنكية', desc: 'Visa / Mastercard' },
    { value: 'OnlineWallet', label: 'محفظة إلكترونية', desc: 'Vodafone Cash / Etisalat' },
    { value: 'BankTransfer', label: 'تحويل بنكي', desc: 'InstaPay / Bank Transfer' },
    { value: 'Cash', label: 'دفع عند الدكتور', desc: 'نقدي في العيادة' },
  ];

  ngOnInit(): void {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    if (!id) return;

    this._billing.getInvoice(id).subscribe({
      next: (i) => {
        this.invoice.set(i);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  statusLabel(s: string): string {
    switch (s) {
      case 'Paid': return 'مدفوعة بالكامل';
      case 'Unpaid': return 'غير مدفوعة';
      case 'PartiallyPaid': return 'مدفوعة جزئياً';
      case 'Cancelled': return 'ملغاة';
      default: return s;
    }
  }

  methodLabel(m: string): string {
    const f = this.methods.find((x) => x.value === m);
    return f ? f.label : m;
  }

  openPayForm(): void {
    this.showPayForm.set(true);
  }

  closePayForm(): void {
    this.showPayForm.set(false);
  }

  onPay(): void {
    const inv = this.invoice();
    if (!inv) return;
    if (inv.remainingAmount <= 0) {
      this._toast.show('الفاتورة مدفوعة بالكامل', 'info');
      return;
    }

    this.paying.set(true);
    this._billing.pay({
      invoiceId: inv.id,
      amount: inv.remainingAmount,
      method: this.payMethod(),
      notes: 'دفع إلكتروني',
    }).subscribe({
      next: (res) => {
        this._toast.show(`تم الدفع — ${res.transactionRef}`, 'success');
        this._billing.getInvoice(inv.id).subscribe({
          next: (updated) => {
            this.invoice.set(updated);
            this.showPayForm.set(false);
            this.paying.set(false);
          },
        });
      },
      error: () => {
        this._toast.show('تعذر إتمام الدفع', 'error');
        this.paying.set(false);
      },
    });
  }
}