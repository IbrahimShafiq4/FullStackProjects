import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BillingService, IInvoice } from '../../core/services/billing.service';
import { ToastService } from '../../shared/services/toast.service';

type TPaymentState = 'idle' | 'processing' | 'success' | 'error';

@Component({
  selector: 'app-payment',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class PaymentPage implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _billing = inject(BillingService);
  private readonly _toast = inject(ToastService);

  invoice = signal<IInvoice | null>(null);
  loading = signal(true);

  state = signal<TPaymentState>('idle');
  errorMessage = signal('');

  cardNumber = signal('');
  cardHolder = signal('');
  cardExpiry = signal('');
  cardCvv = signal('');
  method = signal<'Card' | 'OnlineWallet' | 'BankTransfer' | 'Cash'>('Card');

  readonly formattedCardNumber = computed(() => {
    const raw = this.cardNumber().replace(/\D/g, '').slice(0, 16);
    return raw.replace(/(\d{4})(?=\d)/g, '$1 ');
  });

  readonly cardBrand = computed(() => {
    const n = this.cardNumber().replace(/\D/g, '');
    if (n.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'MASTERCARD';
    if (n.startsWith('34') || n.startsWith('37')) return 'AMEX';
    if (n.startsWith('6')) return 'DISCOVER';
    return 'CARD';
  });

  readonly canSubmit = computed(() => {
    if (!this.invoice()) return false;
    if (this.state() !== 'idle') return false;

    if (this.method() === 'Card') {
      return (
        this.cardNumber().replace(/\D/g, '').length >= 15 &&
        this.cardHolder().trim().length >= 3 &&
        this.cardExpiry().length === 5 &&
        this.cardCvv().length >= 3
      );
    }
    return true;
  });

  readonly remaining = computed(() => this.invoice()?.remainingAmount ?? 0);
  readonly currency = computed(() => this.invoice()?.currency ?? 'EGP');

  ngOnInit(): void {
    const id = Number(this._route.snapshot.paramMap.get('invoiceId'));
    if (!id) {
      this._router.navigate(['/invoices']);
      return;
    }

    this._billing.getInvoice(id).subscribe({
      next: (inv) => {
        this.invoice.set(inv);
        this.loading.set(false);
      },
      error: () => {
        this._toast.show('الفاتورة غير موجودة', 'error');
        this._router.navigate(['/invoices']);
      },
    });
  }

  onCardNumberInput(value: string): void {
    const raw = value.replace(/\D/g, '').slice(0, 16);
    this.cardNumber.set(raw);
  }

  onExpiryInput(value: string): void {
    const raw = value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      this.cardExpiry.set(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      this.cardExpiry.set(raw);
    }
  }

  onCvvInput(value: string): void {
    this.cardCvv.set(value.replace(/\D/g, '').slice(0, 4));
  }

  selectMethod(m: 'Card' | 'OnlineWallet' | 'BankTransfer' | 'Cash'): void {
    this.method.set(m);
  }

  onPay(): void {
    const inv = this.invoice();
    if (!inv) return;
    if (!this.canSubmit()) return;

    this.state.set('processing');
    this.errorMessage.set('');

    // Fake processing delay for realism
    setTimeout(() => {
      this._billing
        .pay({
          invoiceId: inv.id,
          amount: inv.remainingAmount,
          method: this.method(),
          notes: 'دفع إلكتروني',
        })
        .subscribe({
          next: (res) => {
            this.state.set('success');

            setTimeout(() => {
              this._router.navigate(['/invoices', inv.id], {
                queryParams: { success: '1', ref: res.transactionRef },
              });
            }, 1800);
          },
          error: (err) => {
            this.state.set('error');
            const m = err.error;
            this.errorMessage.set(
              typeof m === 'string' ? m : 'تعذر إتمام الدفع، حاول مرة أخرى',
            );
          },
        });
    }, 2200);
  }

  retry(): void {
    this.state.set('idle');
    this.errorMessage.set('');
  }

  goBack(): void {
    const inv = this.invoice();
    if (inv) {
      this._router.navigate(['/invoices', inv.id]);
    } else {
      this._router.navigate(['/invoices']);
    }
  }
}