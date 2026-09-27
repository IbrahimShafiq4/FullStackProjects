import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

interface IEventItem {
  id: number;
  title: string;
  eventDate: string;
  basePrice: number;
  venueName: string;
}

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-event-list',
  styleUrl: './event-list.css',
  templateUrl: './event-list.html',
})
export class EventList implements OnInit {
  private _http = inject(HttpClient);
  public auth = inject(AuthService);
  public theme = inject(ThemeService);

  readonly year = new Date().getFullYear();

  events = signal<IEventItem[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this._http
      .get<IEventItem[]>('https://localhost:7133/api/events', { withCredentials: true })
      .subscribe({
        next: (d) => {
          this.events.set(d);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}