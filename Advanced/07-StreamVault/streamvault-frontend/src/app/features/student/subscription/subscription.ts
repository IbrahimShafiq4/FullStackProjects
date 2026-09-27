import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionsService } from '../../../core/services/subscriptions.service';
import { PaymentsService } from '../../../core/services/payments.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ISubscriptionStatus } from '../../../core/models';

@Component({
  selector: 'app-subscription',
  imports: [DatePipe],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css'
})
export class Subscription implements OnInit {
  public readonly _SubscriptionsService: SubscriptionsService = inject(SubscriptionsService);
  public readonly _PaymentsService: PaymentsService = inject(PaymentsService);
  public readonly _ToastService: ToastService = inject(ToastService);
  private readonly _Router: Router = inject(Router);

  public status: WritableSignal<ISubscriptionStatus> = signal<ISubscriptionStatus>({ isActive: false, expiresAt: null });
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public isProcessing: WritableSignal<boolean> = signal<boolean>(false);

  public ngOnInit(): void {
    this._loadStatus();
  }

  private _loadStatus(): void {
    this._SubscriptionsService.getStatus().subscribe({
      next: (data: ISubscriptionStatus) => {
        this.status.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  public onSubscribe(): void {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);

    this._PaymentsService.checkout({ purpose: 1, courseId: null, studyFileId: null }).subscribe({
      next: (res) => {
        this.isProcessing.set(false);
        this._Router.navigate(['/checkout', res.paymentId]);
      },
      error: () => {
        this.isProcessing.set(false);
        this._ToastService.show('تعذر بدء عملية الدفع', 'error');
      }
    });
  }
}