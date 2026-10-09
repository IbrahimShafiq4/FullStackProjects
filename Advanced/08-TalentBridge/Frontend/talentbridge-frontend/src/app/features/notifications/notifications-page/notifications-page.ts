import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, AppNotification } from '../../../core/services/notifications.service';
import { ToastService } from '../../../shared/services/toast.service';

interface Bucket {
  label: string;
  items: AppNotification[];
}

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.css',
})
export class NotificationsPage implements OnInit {
  public svc = inject(NotificationsService);
  private toast = inject(ToastService);

  readonly showUnreadOnly = signal(false);

  readonly visible = computed(() => {
    const all = this.svc.items();
    return this.showUnreadOnly() ? all.filter((n) => !n.isRead) : all;
  });

  readonly buckets = computed<Bucket[]>(() => {
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startYesterday = startToday - 86_400_000;

    const today: AppNotification[] = [];
    const yesterday: AppNotification[] = [];
    const earlier: AppNotification[] = [];

    for (const n of this.visible()) {
      const t = new Date(n.createdAt).getTime();
      if (t >= startToday) today.push(n);
      else if (t >= startYesterday) yesterday.push(n);
      else earlier.push(n);
    }

    const out: Bucket[] = [];
    if (today.length) out.push({ label: 'اليوم', items: today });
    if (yesterday.length) out.push({ label: 'أمس', items: yesterday });
    if (earlier.length) out.push({ label: 'أقدم', items: earlier });
    return out;
  });

  async ngOnInit(): Promise<void> {
    await this.svc.load();
  }

  async markOne(n: AppNotification): Promise<void> {
    if (n.isRead) return;
    try {
      await this.svc.markAsRead(n.id);
    } catch {
      this.toast.show('تعذّر تحديث الإشعار.', 'error');
    }
  }

  async markAll(): Promise<void> {
    if (this.svc.unreadCount() === 0) return;
    try {
      await this.svc.markAllAsRead();
      this.toast.show('تم تعليم الكل كمقروء.', 'success');
    } catch {
      this.toast.show('تعذّر تعليم الكل.', 'error');
    }
  }

  trackById(_: number, n: AppNotification): number { return n.id; }
}