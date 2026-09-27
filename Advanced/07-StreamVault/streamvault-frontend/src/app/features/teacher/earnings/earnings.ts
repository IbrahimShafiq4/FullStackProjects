import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PaymentsService } from '../../../core/services/payments.service';
import { IPayment, ITeacherStatistics } from '../../../core/models';

@Component({
  selector: 'app-earnings',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './earnings.html',
  styleUrl: './earnings.css'
})
export class Earnings implements OnInit {
  public readonly _PaymentsService: PaymentsService = inject(PaymentsService);

  public payments: WritableSignal<IPayment[]> = signal<IPayment[]>([]);
  public stats: WritableSignal<ITeacherStatistics | null> = signal<ITeacherStatistics | null>(null);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public filterMonth: string = 'all';
  public filterPurpose: number = 0;

  public months: { value: string; label: string }[] = [
    { value: 'all', label: 'كل الشهور' },
    { value: '2026-01', label: 'يناير ٢٠٢٦' },
    { value: '2026-02', label: 'فبراير ٢٠٢٦' },
    { value: '2026-03', label: 'مارس ٢٠٢٦' }
  ];

  public ngOnInit(): void {
    this._PaymentsService.getReceivedPayments().subscribe({
      next: (data: IPayment[]) => {
        this.payments.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
    this._PaymentsService.getTeacherStatistics().subscribe({
      next: (data: ITeacherStatistics) => this.stats.set(data)
    });
  }

  public getFilteredPayments(): IPayment[] {
    return this.payments().filter((p) => {
      if (this.filterPurpose > 0 && p.purpose !== this.filterPurpose) return false;
      return true;
    });
  }

  public getTotalFiltered(): number {
    return this.getFilteredPayments().reduce((sum, p) => sum + p.amount, 0);
  }

  public getBarHeight(amount: number, maxAmount: number): string {
    if (!maxAmount) return '0%';
    return `${Math.round((amount / maxAmount) * 100)}%`;
  }

  public getMaxMonthlyEarning(): number {
    const months = this.stats()?.monthlyEarnings ?? [];
    if (months.length === 0) return 1;
    return Math.max(...months.map((m) => m.amount), 1);
  }

  public getMonthLabel(monthKey: string): string {
    const parts = monthKey.split('-');
    const monthIndex = Number(parts[1]) - 1;
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return monthNames[monthIndex] ?? monthKey;
  }
}