import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { BillingService } from '../../../core/services/billing.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-invoices-list',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './invoices-list.html',
  styleUrl: './invoices-list.css',
})
export class InvoicesList implements OnInit {
  readonly _billing = inject(BillingService);
  readonly _auth = inject(AuthService);

  ngOnInit(): void {
    this._billing.loadMyInvoices();
  }

  statusLabel(s: string): string {
    switch (s) {
      case 'Paid': return 'مدفوعة';
      case 'Unpaid': return 'غير مدفوعة';
      case 'PartiallyPaid': return 'مدفوعة جزئياً';
      case 'Cancelled': return 'ملغاة';
      default: return s;
    }
  }
}