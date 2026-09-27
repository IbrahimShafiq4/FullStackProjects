import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TicketsService } from '../../core/services/tickets.service';
import { HandwrittenUnderline } from '../../shared/handwritten-underline/handwritten-underline';
import { CheckMark } from '../../shared/check-mark/check-mark';
import { IDailyCount, ITicket } from '../../core/models/ticket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, HandwrittenUnderline],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  ticketsService = inject(TicketsService);
  auth = inject(AuthService);

  recent = signal<ITicket[]>([]);

  readonly isAgent = computed(() => this.auth.currentUser()?.role === 'Agent');

  readonly greeting = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'صباح الخير';
    return 'مساء الخير';
  });

  readonly today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  ngOnInit() {
    this.ticketsService.loadStats();
    this.ticketsService.loadFiltered({ page: 1, pageSize: 6 }).subscribe({
      next: r => this.recent.set(r.items)
    });
  }

  barHeight(value: number, days: IDailyCount[]): number {
    const max = Math.max(...days.map(d => Math.max(d.created, d.resolved)), 1);
    const pct = (value / max) * 100;
    return pct < 3 && value > 0 ? 3 : pct;
  }

  priorityLabel(p: string): string {
    const map: Record<string, string> = { Low: 'منخفضة', Medium: 'متوسطة', High: 'عالية', Urget: 'عاجلة' };
    return map[p] ?? p;
  }

  statusLabel(s: string): string {
    const map: Record<string, string> = { Open: 'مفتوحة', InProgress: 'شغالة', Resolved: 'اتحلت', Closed: 'اتقفلت' };
    return map[s] ?? s;
  }

  categoryLabel(c: string): string {
    const map: Record<string, string> = { Technical: 'تقني', Billing: 'فواتير', Bug: 'خطأ', Feature: 'ميزة', Other: 'أخرى' };
    return map[c] ?? c;
  }
}