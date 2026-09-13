import { HttpClient } from '@angular/common/http';
import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import gsap from 'gsap';
import { FormsModule } from '@angular/forms';
import { AuctionSignalRService } from '../../../core/services/auction-signalr.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [FormField, FormsModule, CurrencyPipe, DatePipe, RouterLink],
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.html',
})
export class AuctionDetail implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  signalr = inject(AuctionSignalRService);

  private priceRef = viewChild<ElementRef<HTMLElement>>('priceEl');

  currentPrice = signal(0);
  endsAt = signal<Date | null>(null);
  remainingLabel = signal('--:--');
  auctionClosed = signal<{ winnerId: string; winnerName: string } | null>(null);
  mediaUrls = signal<string[]>([]);
  sellerId = signal<string>('');
  sellerName = signal<string>('');

  bidHistory = signal<any[]>([]);

  bidModel = signal({ amount: 0 });
  bidForm = form(this.bidModel, () => { });

  private countdownInterval?: ReturnType<typeof setInterval>;

  constructor() {
    effect(() => {
      const bid = this.signalr.latestBid();
      if (bid) {
        this.currentPrice.set(bid.amount);
        const newBid = {
          id: Date.now(),
          amount: bid.amount,
          placedAt: new Date().toISOString(),
          bidderName: bid.bidderName,
          bidderAvatarUrl: bid.bidderAvatarUrl || null,
        };
        this.bidHistory.update(history => [newBid, ...history]);
        this.toast.show(`مزايدة جديدة من ${bid.bidderName}`, 'info');

        const el = this.priceRef()?.nativeElement;
        if (el) {
          gsap.timeline()
            .to(el, { scale: 1.3, color: '#22c55e', duration: 0.2, ease: 'power2.out' })
            .to(el, { scale: 1, color: 'inherit', duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        }
      }
    });

    effect(() => {
      const closed = this.signalr.auctionClosed();
      if (closed) {
        this.auctionClosed.set(closed);
        clearInterval(this.countdownInterval);
        this.remainingLabel.set('انتهى المزاد');
        this.toast.show(`المزاد انتهى، الفائز: ${closed.winnerName}`, 'success');
      }
    });
  }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`https://localhost:7071/api/auctions/${id}`).subscribe({
      next: (auction) => {
        this.currentPrice.set(auction.currentHighestBid);
        this.endsAt.set(new Date(auction.endsAt));
        this.mediaUrls.set(auction.mediaUrls || []);
        this.sellerId.set(auction.sellerId || '');
        this.sellerName.set(auction.sellerName || '');
        if (auction.status === 2 && auction.winnerName) {
          this.auctionClosed.set({ winnerId: auction.winnerId, winnerName: auction.winnerName });
          this.remainingLabel.set('انتهى المزاد');
        } else {
          this.startCountdown();
        }
      },
      error: () => this.toast.show('تعذر تحميل المزاد', 'error'),
    });

    this.http.get<any[]>(`https://localhost:7071/api/auctions/${id}/bids`).subscribe({
      next: (bids) => {
        this.bidHistory.set(bids);
      },
      error: () => this.toast.show('تعذر تحميل تاريخ المزايدات', 'error'),
    });

    await this.signalr.connect(id);
  }

  private startCountdown() {
    this.countdownInterval = setInterval(() => {
      const end = this.endsAt();
      if (!end) return;
      const diffMs = end.getTime() - Date.now();
      if (diffMs <= 0) {
        this.remainingLabel.set('انتهى المزاد');
        clearInterval(this.countdownInterval);
        return;
      }
      const mins = Math.floor(diffMs / 60000);
      const secs = Math.floor((diffMs % 60000) / 1000);
      this.remainingLabel.set(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.countdownInterval);
    this.signalr.disconnect();
  }

  placeBid() {
    const { amount } = this.bidModel();
    if (amount <= 0) {
      this.toast.show('أدخل مبلغاً صحيحاً', 'error');
      return;
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.post(`https://localhost:7071/api/auctions/${id}/bid`, { amount }).subscribe({
      next: () => {
        this.toast.show('تم تسجيل مزايدتك بنجاح', 'success');
        this.bidModel.set({ amount: 0 });
      },
      error: (err) => this.toast.show(err.error || 'فشلت المزايدة', 'error'),
    });
  }
}