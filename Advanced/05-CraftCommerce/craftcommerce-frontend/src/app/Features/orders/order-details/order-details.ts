import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IOrderSummary, OrdersService } from '../../../core/services/orders.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';
import { CaseStrip } from '../../../shared/components/case-strip/case-strip';

@Component({
  imports: [RouterLink, DatePipe, AppShell, CaseStrip],
  selector: 'app-order-details',
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  private _orders = inject(OrdersService);
  private _route  = inject(ActivatedRoute);

  order  : WritableSignal<IOrderSummary | null> = signal(null);
  loading: WritableSignal<boolean> = signal(true);
  error  : WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this._orders.getOrderDetails(id).subscribe({
      next: (o) => { this.order.set(o); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set(true); },
    });
  }

  statusLabel(s: string): string {
    switch (s) {
      case 'Pending':   return 'قيد الانتظار';
      case 'Shipped':   return 'تم الشحن';
      case 'Delivered': return 'تم التسليم';
      case 'Cancelled': return 'ملغي';
      default:          return s;
    }
  }
}