import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService, INotification } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationSoundService } from '../../../core/services/notification-sound.service';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
})
export class NotificationBell implements OnInit, OnDestroy {
  private readonly _notif = inject(NotificationService);
  private readonly _sound = inject(NotificationSoundService);
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  open = signal(false);
  highlightedId = signal<number | null>(null);

  readonly notifications = computed(() => this._notif.notifications());
  readonly unread = computed(() => this._notif.unreadCount());
  readonly lastArrivedId = computed(() => this._notif.lastArrived()?.id ?? null);

  ngOnInit(): void {
    const user = this._auth.currentUser();
    if (!user) return;
    this._notif.load();
    this._notif.connect(user.id);
  }

  ngOnDestroy(): void {
    this._notif.disconnect();
  }

  toggle(): void {
    this._sound.unlock();
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  onRead(n: INotification): void {
    this._sound.unlock();

    if (!n.isRead) {
      this._notif.markRead(n.id).subscribe();
    }

    this.highlightedId.set(n.id);

    const url = this.buildUrl(n);
    if (url) {
      this._router.navigateByUrl(url);
    }

    this.close();

    setTimeout(() => this.highlightedId.set(null), 3000);
  }

  onMarkAllRead(): void {
    this._notif.markAllRead().subscribe();
  }

  private buildUrl(n: INotification): string | null {
    if (!n.link) return null;

    if (n.type === 'InvoiceIssued' || n.type === 'PaymentSuccess' || n.type === 'PaymentFailed') {
      return n.link.includes('?') ? `${n.link}&pay=1` : `${n.link}?pay=1`;
    }

    return n.link;
  }

  isNew(id: number): boolean {
    return this.lastArrivedId() === id;
  }

  typeLabel(type: string): string {
    switch (type) {
      case 'QueueCalled': return 'دورك';
      case 'QueueNext': return 'استعد';
      case 'AppointmentSoon': return 'قريب';
      case 'AppointmentNew': return 'حجز';
      case 'RadiologyReady': return 'أشعة';
      case 'InvoiceIssued': return 'فاتورة';
      case 'PaymentSuccess': return 'دفع';
      case 'PaymentFailed': return 'فشل';
      case 'TreatmentStage': return 'علاج';
      default: return 'إشعار';
    }
  }

  typeIcon(type: string): string {
    switch (type) {
      case 'QueueCalled':
      case 'QueueNext': return '!';
      case 'RadiologyReady': return '◎';
      case 'InvoiceIssued': return '$';
      case 'PaymentSuccess': return '✓';
      case 'PaymentFailed': return '✕';
      case 'AppointmentSoon':
      case 'AppointmentNew': return '◷';
      case 'TreatmentStage': return '≡';
      default: return '•';
    }
  }

  typeColor(type: string): string {
    switch (type) {
      case 'QueueCalled': return 'red';
      case 'QueueNext': return 'orange';
      case 'PaymentFailed': return 'red';
      case 'PaymentSuccess': return 'green';
      case 'InvoiceIssued': return 'blue';
      case 'RadiologyReady': return 'orange';
      default: return 'blue';
    }
  }
}