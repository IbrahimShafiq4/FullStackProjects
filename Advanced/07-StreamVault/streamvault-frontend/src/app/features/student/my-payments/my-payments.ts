import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PaymentsService } from '../../../core/services/payments.service';
import { ToastService } from '../../../shared/services/toast.service';
import { IPayment } from '../../../core/models';

@Component({
  selector: 'app-my-payments',
  imports: [DatePipe],
  templateUrl: './my-payments.html',
  styleUrl: './my-payments.css'
})
export class MyPayments implements OnInit {
  public readonly _PaymentsService: PaymentsService = inject(PaymentsService);
  public readonly _ToastService: ToastService = inject(ToastService);

  public payments: WritableSignal<IPayment[]> = signal<IPayment[]>([]);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public selectedPayment: WritableSignal<IPayment | null> = signal<IPayment | null>(null);
  public totalSpent: number = 0;
  public successCount: number = 0;
  public pendingCount: number = 0;

  public ngOnInit(): void {
    this._PaymentsService.getMyPayments().subscribe({
      next: (data: IPayment[]) => {
        this.payments.set(data);
        this._calculateStats(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this._ToastService.show('تعذر تحميل المدفوعات', 'error');
      }
    });
  }

  private _calculateStats(data: IPayment[]): void {
    this.totalSpent = data.filter((p) => p.status === 2).reduce((sum, p) => sum + p.amount, 0);
    this.successCount = data.filter((p) => p.status === 2).length;
    this.pendingCount = data.filter((p) => p.status === 1).length;
  }

  public onSelectPayment(payment: IPayment): void {
    this.selectedPayment.set(this.selectedPayment()?.id === payment.id ? null : payment);
  }

  public getPurposeLabel(purpose: number): string {
    if (purpose === 1) return 'اشتراك';
    if (purpose === 2) return 'كورس';
    if (purpose === 3) return 'مذكرة';
    return 'غير محدد';
  }

  public getStatusLabel(status: number): string {
    if (status === 1) return 'معلّق';
    if (status === 2) return 'مكتمل';
    if (status === 3) return 'فاشل';
    if (status === 4) return 'مسترد';
    return 'غير معروف';
  }
}