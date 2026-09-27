import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

interface IAnalytics {
  totalSeats: number;
  bookedSeats: number;
  occupancyRate: number;
  revenue: number;
}

@Component({
  imports: [DecimalPipe, RouterLink],
  selector: 'app-event-analytics',
  styleUrl: './event-analytics.css',
  templateUrl: './event-analytics.html',
})
export class EventAnalytics implements OnInit {
  private _http = inject(HttpClient);
  private _route = inject(ActivatedRoute);
  public theme = inject(ThemeService);

  readonly year = new Date().getFullYear();

  eventId!: number;
  stats = signal<IAnalytics | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.eventId = Number(this._route.snapshot.paramMap.get('id'));
    this._http
      .get<IAnalytics>(`https://localhost:7133/api/analytics/event/${this.eventId}`, { withCredentials: true })
      .subscribe({
        next: (d) => {
          this.stats.set(d);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}