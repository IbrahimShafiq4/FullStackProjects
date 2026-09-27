import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from '../../core/services/payments.service';
import { WalletsService } from '../../core/services/wallets.service';
import { ToastService } from '../../shared/services/toast.service';
import { IPaymentDetail, ITeacherWallet } from '../../core/models';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  public readonly _PaymentsService: PaymentsService = inject(PaymentsService);
  public readonly _WalletsService: WalletsService = inject(WalletsService);
  public readonly _ToastService: ToastService = inject(ToastService);
  private readonly _Route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _Router: Router = inject(Router);

  public paymentId: number = 0;
  public payment: WritableSignal<IPaymentDetail | null> = signal<IPaymentDetail | null>(null);
  public wallets: WritableSignal<ITeacherWallet[]> = signal<ITeacherWallet[]>([]);
  public selectedWallet: WritableSignal<ITeacherWallet | null> = signal<ITeacherWallet | null>(null);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public isProcessing: WritableSignal<boolean> = signal<boolean>(false);
  public isSuccess: WritableSignal<boolean> = signal<boolean>(false);
  public errorMessage: WritableSignal<string> = signal<string>('');

  public ngOnInit(): void {
    this.paymentId = Number(this._Route.snapshot.paramMap.get('paymentId'));
    this._loadPayment();
  }

  private _loadPayment(): void {
    this._PaymentsService.getPayment(this.paymentId).subscribe({
      next: (data: IPaymentDetail) => {
        this.payment.set(data);
        if (data.teacherId) {
          this._WalletsService.getTeacherWallets(data.teacherId).subscribe({
            next: (wallets: ITeacherWallet[]) => {
              this.wallets.set(wallets);
              if (wallets.length > 0) {
                const def = wallets.find((w) => w.isDefault);
                this.selectedWallet.set(def ?? wallets[0]);
              }
              this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
          });
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.errorMessage.set('مش قادرين نجيب الفاتورة، جرب تاني');
        this.isLoading.set(false);
      }
    });
  }

  public selectWallet(w: ITeacherWallet): void {
    this.selectedWallet.set(w);
  }

  public onConfirm(): void {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);
    this._PaymentsService.confirm(this.paymentId).subscribe({
      next: () => {
        this.isSuccess.set(true);
        setTimeout(() => {
          this._Router.navigate(['/checkout/success', this.paymentId]);
        }, 1400);
      },
      error: () => {
        this.isProcessing.set(false);
        this._ToastService.show('فشلت عملية الدفع، حاول تاني', 'error');
      }
    });
  }

  public onCancel(): void {
    this._Router.navigate(['/student/subscription']);
  }

  public getPurposeLabel(purpose: number): string {
    if (purpose === 1) return 'اشتراك شهري';
    if (purpose === 2) return 'شراء كورس';
    if (purpose === 3) return 'شراء مذكرة';
    return 'دفع';
  }

  public getProviderIcon(provider: string): string {
    const map: Record<string, string> = {
      'فودافون كاش': '📱',
      'إنستاباي': '💳',
      'اتصالات كاش': '📞',
      'أورنج كاش': '🧡',
      'وي باي': '👛',
      'تحويل بنكي': '🏦'
    };
    return map[provider] ?? '💰';
  }
}