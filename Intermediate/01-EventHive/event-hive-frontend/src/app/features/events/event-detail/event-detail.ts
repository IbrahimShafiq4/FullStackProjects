import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { EventSerivce } from '../../../core/services/event';
import { Toast } from '../../../core/services/toast';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-event-detail',
  styles: `
  .detail-page {
    position: relative;
    min-height: 100vh;
    background: var(--bg);
    padding: 40px 32px 100px;
    overflow: hidden;
  }

  .detail-bg {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 900px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%);
    filter: blur(50px);
    pointer-events: none;
  }

  .detail-inner {
    position: relative;
    max-width: 1100px;
    margin: 0 auto;
    z-index: 1;
  }

  .detail-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--muted);
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 40px;
    padding: 8px 14px;
    border-radius: 999px;
    transition: all 0.25s ease;
  }

  .detail-back:hover {
    color: var(--accent);
    background: rgba(255, 255, 255, 0.04);
  }

  .detail-hero {
    padding: 48px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 28px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
  }

  .detail-hero::before {
    content: '';
    position: absolute;
    top: -100px;
    left: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%);
    filter: blur(30px);
    pointer-events: none;
  }

  .detail-hero-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
  }

  .detail-kicker {
    display: inline-block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--accent);
    font-weight: 600;
  }

  .detail-status {
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
  }

  .detail-status-active {
    color: var(--success);
  }

  .detail-status-inactive {
    color: var(--danger);
  }

  .detail-title {
    font-family: 'Reem Kufi', sans-serif;
    font-size: clamp(2rem, 4.5vw, 3.5rem);
    line-height: 1.1;
    font-weight: 600;
    letter-spacing: -1.2px;
    margin: 0 0 20px;
    color: var(--text);
    position: relative;
  }

  .detail-desc {
    font-size: 16px;
    line-height: 1.8;
    color: var(--text-dim);
    max-width: 720px;
    margin: 0 0 40px;
    position: relative;
  }

  .detail-hero-meta {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding-top: 32px;
    border-top: 1px solid var(--border);
    position: relative;
  }

  .detail-meta-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .detail-meta-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .detail-meta-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
    margin-bottom: 6px;
    font-weight: 600;
  }

  .detail-meta-value {
    font-size: 14px;
    color: var(--text);
    line-height: 1.5;
    font-weight: 500;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 24px;
  }

  .detail-side {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .detail-capacity-card {
    padding: 32px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
  }

  .detail-capacity-num {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 48px;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
    letter-spacing: -2px;
    margin: 16px 0 20px;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .detail-capacity-num small {
    font-size: 18px;
    color: var(--muted);
    font-weight: 400;
    letter-spacing: 0;
  }

  .detail-capacity-bar {
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.05);
    overflow: hidden;
    margin-bottom: 12px;
  }

  .detail-capacity-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    border-radius: 999px;
    transition: width 0.6s ease;
  }

  .detail-capacity-hint {
    font-size: 12px;
    color: var(--muted);
    margin: 0;
  }

  .detail-actions-card {
    padding: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .detail-btn {
    padding: 14px 20px;
    border-radius: 14px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1px solid transparent;
    text-align: center;
    text-decoration: none;
    display: block;
  }

  .detail-btn-primary {
    background: var(--accent);
    color: #0a0a0b;
  }

  .detail-btn-primary:hover {
    background: var(--accent-2);
    box-shadow: 0 16px 40px -16px var(--accent);
    transform: translateY(-1px);
  }

  .detail-btn-ghost {
    background: transparent;
    color: var(--text);
    border-color: var(--border-strong);
  }

  .detail-btn-ghost:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--text);
  }

  .detail-btn-outline {
    background: transparent;
    color: var(--accent);
    border-color: var(--accent);
  }

  .detail-btn-outline:hover {
    background: var(--accent-soft);
  }

  .detail-btn-danger {
    background: transparent;
    color: var(--danger);
    border-color: rgba(229, 72, 77, 0.4);
  }

  .detail-btn-danger:hover {
    background: rgba(229, 72, 77, 0.1);
    border-color: var(--danger);
  }

  .detail-rsvps {
    padding: 32px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
  }

  .detail-rsvps-head {
    margin-bottom: 24px;
  }

  .detail-rsvps-title {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -1px;
    margin: 8px 0 0;
  }

  .detail-rsvps-title em {
    color: var(--accent);
    font-style: italic;
    font-weight: 700;
  }

  .detail-rsvps-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .detail-rsvp {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.25s ease;
  }

  .detail-rsvp:hover {
    border-color: var(--border-strong);
  }

  .detail-rsvp-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    color: #0a0a0b;
    font-family: 'Reem Kufi', sans-serif;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .detail-rsvp-body {
    flex: 1;
    min-width: 0;
  }

  .detail-rsvp-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .detail-rsvp-time {
    font-size: 12px;
    color: var(--muted);
    margin-top: 2px;
  }

  .detail-rsvp-badge {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--success);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .detail-rsvps-empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--muted);
  }

  .detail-rsvps-empty span {
    font-size: 40px;
    display: block;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .detail-rsvps-empty p {
    margin: 0;
    font-size: 14px;
  }

  @media (max-width: 900px) {
    .detail-hero {
        padding: 32px 24px;
    }

    .detail-hero-meta {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .detail-rsvps-grid {
        grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .detail-page {
        padding: 24px 20px 80px;
    }

    .detail-hero-meta {
        grid-template-columns: 1fr;
    }

    .detail-rsvps {
        padding: 24px 20px;
    }
  }
  `,
  templateUrl: './event-detail.html',
})
export class EventDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventSerivce);
  private toast = inject(Toast);
  private auth = inject(AuthService);

  event = signal<any>(null);
  isOrganizer = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event.set(data);
        const user = this.auth.currentUser();
        this.isOrganizer.set(user?.fullName?.includes('Admin') || false);
      },
      error: () => this.toast.show('فشل تحميل التفاصيل', 'error')
    });
  }

  getFilledPercent(): number {
    const ev = this.event();
    if (!ev || !ev.capcity) return 0;
    const filled = ev.capcity - ev.availableSpots;
    return Math.min(100, Math.max(0, (filled / ev.capcity) * 100));
  }

  onRsvp() {
    const eventId = this.event().id;
    this.eventService.rsvp(eventId).subscribe({
      next: () => {
        this.toast.show('تم الحجز ✅', 'success');
        this.ngOnInit();
      },
      error: () => this.toast.show('فشل الحجز', 'error')
    });
  }

  onCancelRsvp() {
    const eventId = this.event().id;
    this.eventService.cancelRsvp(eventId).subscribe({
      next: () => {
        this.toast.show('تم الإلغاء', 'info');
        this.ngOnInit();
      },
      error: () => this.toast.show('فشل الإلغاء', 'error')
    });
  }

  onDelete() {
    if (!confirm('حذف الفعالية؟')) return;
    const eventId = this.event().id;
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.toast.show('تم الحذف', 'success');
        this.router.navigate(['/events']);
      },
      error: () => this.toast.show('فشل الحذف', 'error')
    });
  }
}