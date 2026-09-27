import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OrdersService } from '../../../core/services/orders.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';
import { CaseStrip } from '../../../shared/components/case-strip/case-strip';

@Component({
  imports: [RouterLink, DatePipe, AppShell, CaseStrip],
  selector: 'app-order-list',
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList implements OnInit {
  public orders = inject(OrdersService);
  ngOnInit(): void { this.orders.loadMyOrders(); }

  statusLabel(s: string): string {
    switch (s) {
      case 'Pending':   return 'قيد الانتظار';
      case 'Shipped':   return 'تم الشحن';
      case 'Delivered': return 'تم التسليم';
      case 'Cancelled': return 'ملغي';
      default:          return s;
    }
  }

  statusClass(s: string): string {
    switch (s) {
      case 'Pending':   return 'is-pending';
      case 'Shipped':   return 'is-shipped';
      case 'Delivered': return 'is-delivered';
      case 'Cancelled': return 'is-cancelled';
      default:          return '';
    }
  }
}