import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  tab = signal<'seller' | 'participant'>('seller');
  seller = signal<any[]>([]);
  participant = signal<any[]>([]);
  loading = signal(true);

  activeCount = computed(() =>
    this.seller().filter(a => a.status === 'Active' || a.status === 1).length
  );

  ngOnInit() {
    let pending = 2;
    const done = () => { if (--pending === 0) this.loading.set(false); };

    this.http.get<any[]>('https://localhost:7071/api/dashboard/seller').subscribe({
      next: d => { this.seller.set(d ?? []); done(); },
      error: () => done()
    });
    this.http.get<any[]>('https://localhost:7071/api/dashboard/participant').subscribe({
      next: d => { this.participant.set(d ?? []); done(); },
      error: () => done()
    });
  }
}