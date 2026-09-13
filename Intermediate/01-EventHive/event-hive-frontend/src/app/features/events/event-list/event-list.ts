import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { EventCard } from '../event-card/event-card';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventSerivce, IEventResponse } from '../../../core/services/event';
import { Toast } from '../../../core/services/toast';
import { AuthService } from '../../../core/services/auth';

@Component({
  imports: [EventCard, RouterLink, FormsModule],
  selector: 'app-event-list',
  styles: `
  .events-page {
    position: relative;
    min-height: 100vh;
    background: var(--bg);
    padding: 60px 32px 100px;
    overflow: hidden;
  }

  .events-bg {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 900px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.07) 0%, transparent 60%);
    filter: blur(50px);
    pointer-events: none;
  }

  .events-inner {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    z-index: 1;
  }

  .events-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 48px;
  }

  .events-kicker {
    display: inline-block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 12px;
  }

  .events-title {
    font-family: 'Reem Kufi', sans-serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1.08;
    font-weight: 600;
    letter-spacing: -1.2px;
    margin: 0 0 12px;
  }

  .events-title em {
    color: var(--accent);
    font-style: italic;
    font-weight: 700;
  }

  .events-sub {
    color: var(--muted);
    font-size: 15px;
    margin: 0;
  }

  .events-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ev-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    border-radius: 999px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.25s ease;
    white-space: nowrap;
  }

  .ev-btn-primary {
    background: var(--accent);
    color: #0a0a0b;
  }

  .ev-btn-primary:hover {
    background: var(--accent-2);
    transform: translateY(-1px);
    box-shadow: 0 12px 30px -12px var(--accent);
  }

  .ev-btn-ghost {
    background: transparent;
    color: var(--text);
    border-color: var(--border-strong);
  }

  .ev-btn-ghost:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--text);
  }

  .events-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    font-size: 13px;
    color: var(--muted);
  }

  .events-count {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .events-count-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
  }

  .events-filter {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .events-filter-label {
    color: var(--muted);
  }

  .events-filter-value {
    color: var(--text);
    font-weight: 500;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .events-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 24px;
    background: var(--surface);
    border: 1px dashed var(--border-strong);
    border-radius: 24px;
  }

  .events-empty-icon {
    font-size: 48px;
    margin-bottom: 20px;
    display: block;
    opacity: 0.5;
  }

  .events-empty h3 {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 8px;
  }

  .events-empty p {
    color: var(--muted);
    font-size: 14px;
    margin: 0 0 24px;
  }

  @media (max-width: 1024px) {
    .events-grid {
        grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .events-page {
        padding: 40px 20px 80px;
    }

    .events-head {
        margin-bottom: 32px;
    }

    .events-grid {
        grid-template-columns: 1fr;
    }

    .events-actions {
        width: 100%;
    }

    .ev-btn {
        flex: 1;
        justify-content: center;
    }
  }
  `,
  templateUrl: './event-list.html',
})
export class EventList implements OnInit {
  public _EventService: EventSerivce = inject(EventSerivce);
  private _Toast: Toast = inject(Toast);
  private _Auth: AuthService = inject(AuthService);

  showUpcoming: WritableSignal<boolean> = signal<boolean>(false);
  isOrganizer: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.loadEvents();

    const user = this._Auth.currentUser();
    this.isOrganizer.set(user?.fullName?.includes('Admin') || false);
  }

  loadEvents(): void {
    this._EventService.loadEvents(this.showUpcoming());
  }

  toggleUpcoming(): void {
    this.showUpcoming.update(v => !v);
    this.loadEvents();
  }

  onRsvp(eventId: number): void {
    this._EventService.rsvp(eventId).subscribe({
      next: () => {
        this._Toast.show('تم الحجز بنجاح ✅', 'success');
        this.loadEvents();
      },
      error: () => this._Toast.show('فشل الحجز', 'error')
    })
  }

  onCancelRsvp(eventId: number): void {
    this._EventService.cancelRsvp(eventId).subscribe({
      next: (rsvp: IEventResponse) => {
        this._Toast.show('تم إلغاء الحجز', 'info');
        this.loadEvents();
      },
      error: () => this._Toast.show('فشل الإلغاء', 'error')
    })
  }

  onDelete(eventId: number): void {
    if (!confirm('هل أنت متأكد من حذف هذه الفعالية ؟')) return;

    this._EventService.deleteEvent(eventId).subscribe({
      next: (event: IEventResponse) => {
        this._Toast.show('تم الحذف', 'success');
        this.loadEvents();
      },
      error: () => this._Toast.show('فشل الحذف', 'error')
    })
  }
}
