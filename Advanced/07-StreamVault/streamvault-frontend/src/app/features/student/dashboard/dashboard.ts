import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { PaymentsService } from '../../../core/services/payments.service';
import { SubscriptionsService } from '../../../core/services/subscriptions.service';
import { CoursesService } from '../../../core/services/courses.service';
import { AuthService } from '../../../core/services/auth.service';
import { IPayment, ISubscriptionStatus, ICourse } from '../../../core/models';

@Component({
  selector: 'app-student-dashboard',
  imports: [RouterLink, SlicePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class StudentDashboard implements OnInit {
  public readonly _PaymentsService: PaymentsService = inject(PaymentsService);
  public readonly _SubscriptionsService: SubscriptionsService = inject(SubscriptionsService);
  public readonly _CoursesService: CoursesService = inject(CoursesService);
  public readonly _AuthService: AuthService = inject(AuthService);

  public recentPayments: WritableSignal<IPayment[]> = signal<IPayment[]>([]);
  public subscription: WritableSignal<ISubscriptionStatus> = signal<ISubscriptionStatus>({ isActive: false, expiresAt: null });
  public courses: WritableSignal<ICourse[]> = signal<ICourse[]>([]);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);

  public ngOnInit(): void {
    this._PaymentsService.getMyPayments().subscribe({
      next: (data: IPayment[]) => this.recentPayments.set(data.slice(0, 3))
    });
    this._SubscriptionsService.getStatus().subscribe({
      next: (data: ISubscriptionStatus) => {
        this.subscription.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
    this._CoursesService.getCourses().subscribe({
      next: (data: ICourse[]) => this.courses.set(data.slice(0, 4))
    });
  }

  public getBookColor(index: number): string {
    const palette: string[] = ['#4a5c4e', '#5f3d1c', '#1e2836', '#8b5a2b'];
    return palette[index % palette.length];
  }

  public getPaymentStatusLabel(status: number): string {
    if (status === 1) return 'معلّق';
    if (status === 2) return 'مكتمل';
    if (status === 3) return 'فاشل';
    if (status === 4) return 'مسترد';
    return 'غير معروف';
  }

  public getGreeting(): string {
    const hour: number = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'نهارك سعيد';
    return 'مساء الخير';
  }
}