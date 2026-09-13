import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IEvent } from '../../../core/services/event';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-event-card',
  styles: `
  .event-card {
    position: relative;
    padding: 26px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    overflow: hidden;
  }

  .event-card::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .event-card:hover {
    transform: translateY(-5px);
    border-color: var(--border-strong);
    background: var(--surface-2);
    box-shadow: 0 24px 60px -30px rgba(0, 0, 0, 0.8);
  }

  .event-card:hover::before {
    opacity: 1;
  }

  .event-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .event-card-cat {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--accent);
    font-weight: 600;
  }

  .event-card-cat-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
  }

  .event-card-status {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
  }

  .event-card-status-active {
    color: var(--success);
  }

  .event-card-status-inactive {
    color: var(--danger);
  }

  .event-card-title {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.5px;
    margin: 0;
    color: var(--text);
  }

  .event-card-desc {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .event-card-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .event-card-meta-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-dim);
  }

  .event-card-meta-icon {
    font-size: 13px;
    opacity: 0.7;
  }

  .event-card-capacity {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .event-card-capacity-bar {
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.05);
    overflow: hidden;
  }

  .event-card-capacity-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    border-radius: 999px;
    transition: width 0.6s ease;
  }

  .event-card-capacity-text {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--muted);
  }

  .event-card-capacity-text span:first-child {
    color: var(--accent);
    font-weight: 600;
  }

  .event-card-actions {
    display: flex;
    gap: 10px;
    margin-top: 4px;
  }

  .event-card-btn {
    flex: 1;
    padding: 11px 16px;
    border-radius: 12px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.25s ease;
  }

  .event-card-btn-primary {
    background: var(--accent);
    color: #0a0a0b;
    border: none;
  }

  .event-card-btn-primary:hover {
    background: var(--accent-2);
    box-shadow: 0 12px 30px -12px var(--accent);
  }

  .event-card-btn-ghost {
    background: transparent;
    color: var(--text);
    border-color: var(--border-strong);
  }

  .event-card-btn-ghost:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--text);
  }

  .event-card-canceled {
    flex: 1;
    text-align: center;
    font-size: 13px;
    color: var(--danger);
    padding: 11px 16px;
    font-weight: 600;
  }
  `,
  templateUrl: './event-card.html',
})
export class EventCard {
  event:        InputSignal<IEvent>       = input.required<IEvent>();
  onRsvp:       OutputEmitterRef<number>  = output<number>();
  onCancelRsvp: OutputEmitterRef<number>  = output<number>();
  onDelete:     OutputEmitterRef<number>  = output<number>();

  getCapacityPercent(): number {
    const ev = this.event();
    if (!ev.capcity || ev.capcity === 0) return 0;
    const filled = ev.capcity - ev.availableSpots;
    return Math.min(100, Math.max(0, (filled / ev.capcity) * 100));
  }
}
