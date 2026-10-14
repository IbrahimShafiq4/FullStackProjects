import {
  Component, computed, effect, ElementRef, inject, OnDestroy, OnInit,
  signal, viewChild, untracked
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionSignalRService } from '../../../core/services/auction-signalr.service';
import { AuctionsService } from '../../../core/services/auctions.service';
import { ToastService } from '../../../shared/services/toast.service';

export interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  imports: [FormField, FormsModule, CurrencyPipe, DatePipe, RouterLink],
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.html',
  styleUrl: './auction-detail.css'
})
export class AuctionDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private auctions = inject(AuctionsService);
  private toast = inject(ToastService);
  signalr = inject(AuctionSignalRService);

  private priceRef = viewChild<ElementRef<HTMLElement>>('priceEl');

  loading = signal(true);
  title = signal('');
  currentPrice = signal(0);
  endsAt = signal<Date | null>(null);
  remainingLabel = signal('--:--');
  timeParts = signal<TimeParts>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  timedOut = signal(false);
  closed = signal<{ winnerId: string; winnerName: string } | null>(null);
  mediaUrls = signal<string[]>([]);
  sellerId = signal('');
  sellerName = signal('');
  history = signal<any[]>([]);
  placing = signal(false);

  isEnded = computed(() => this.closed() !== null || this.timedOut());
  showDays = computed(() => this.timeParts().days > 0);

  bidModel = signal({ amount: 0 });
  bidForm = form(this.bidModel, () => { });

  private countdown?: ReturnType<typeof setInterval>;
  private auctionId = 0;

  constructor() {
    effect(() => {
      const bid = this.signalr.latestBid();
      if (!bid) return;
      untracked(() => {
        this.currentPrice.set(bid.amount);
        this.history.update(h => [{
          id: Date.now(),
          amount: bid.amount,
          placedAt: new Date().toISOString(),
          bidderName: bid.bidderName,
          bidderAvatarUrl: bid.bidderAvatarUrl ?? null,
        }, ...h]);

        const el = this.priceRef()?.nativeElement;
        if (el) {
          el.classList.remove('bid-pulse');
          void el.offsetWidth;
          el.classList.add('bid-pulse');
        }
      });
    });

    effect(() => {
      const c = this.signalr.auctionClosed();
      if (!c) return;
      untracked(() => {
        this.closed.set({ winnerId: c.winnerId ?? '', winnerName: c.winnerName });
        this.stopCountdown();
        this.timeParts.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        this.remainingLabel.set('انتهى المزاد');
        this.toast.show(`المزاد انتهى. الفائز: ${c.winnerName}`, 'success');
      });
    });
  }

  async ngOnInit() {
    this.auctionId = Number(this.route.snapshot.paramMap.get('id'));

    this.auctions.detail(this.auctionId).subscribe({
      next: (a) => {
        this.title.set(a.title ?? '');
        this.currentPrice.set(a.currentHighestBid);
        this.endsAt.set(new Date(a.endsAt));
        this.mediaUrls.set(a.mediaUrls ?? []);
        this.sellerId.set(a.sellerId ?? '');
        this.sellerName.set(a.sellerName ?? '');
        this.loading.set(false);

        const alreadyClosed =
          (a.status === 'Closed' || a.status === 2) && a.winnerName;

        if (alreadyClosed) {
          this.closed.set({ winnerId: a.winnerId, winnerName: a.winnerName });
          this.remainingLabel.set('انتهى المزاد');
          return;
        }

        const end = new Date(a.endsAt).getTime();
        if (Number.isFinite(end) && end - Date.now() <= 0) {
          this.timedOut.set(true);
          this.remainingLabel.set('انتهى المزاد');
          return;
        }

        this.startCountdown();
      },
      error: () => {
        this.loading.set(false);
        this.toast.show('تعذر تحميل المزاد', 'error');
      }
    });

    this.auctions.bids(this.auctionId).subscribe({
      next: list => this.history.set(list ?? [])
    });

    await this.signalr.connect(this.auctionId);
  }

  isVideo(url: string) { return /\.(mp4|webm|mov)$/i.test(url); }

  liveLabel() {
    switch (this.signalr.state()) {
      case 'online': return 'مباشر';
      case 'reconnecting': return 'إعادة اتصال…';
      case 'connecting': return 'اتصال…';
      default: return 'غير متصل';
    }
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : String(n);
  }

  addAmount(n: number) {
    if (this.isEnded()) return;
    this.bidModel.update(v => ({ amount: v.amount + n }));
  }

  private startCountdown() {
    this.tick();
    this.countdown = setInterval(() => this.tick(), 1000);
  }

  private stopCountdown() {
    if (this.countdown) {
      clearInterval(this.countdown);
      this.countdown = undefined;
    }
  }

  private tick() {
    const end = this.endsAt();
    if (!end) return;

    const diff = end.getTime() - Date.now();

    if (diff <= 0) {
      this.timeParts.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      this.timedOut.set(true);
      this.remainingLabel.set('انتهى المزاد');
      this.stopCountdown();
      return;
    }

    const total = Math.floor(diff / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    this.timeParts.set({ days, hours, minutes, seconds });

    const label = days > 0
      ? `${days}ي ${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
      : hours > 0
        ? `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
        : `${this.pad(minutes)}:${this.pad(seconds)}`;

    this.remainingLabel.set(label);
  }

  ngOnDestroy() {
    this.stopCountdown();
    this.signalr.disconnect();
  }

  placeBid() {
    if (this.placing() || this.isEnded()) return;
    const { amount } = this.bidModel();

    if (!amount || amount <= 0) {
      this.toast.show('أدخل مبلغًا صحيحًا', 'error');
      return;
    }

    this.placing.set(true);
    this.auctions.placeBid(this.auctionId, amount).subscribe({
      next: () => {
        this.toast.show('تم تسجيل مزايدتك', 'success');
        this.bidModel.set({ amount: 0 });
        this.placing.set(false);
      },
      error: (err) => {
        this.placing.set(false);
        this.toast.show(err?.error?.message ?? 'فشلت المزايدة', 'error');
      }
    });
  }
}