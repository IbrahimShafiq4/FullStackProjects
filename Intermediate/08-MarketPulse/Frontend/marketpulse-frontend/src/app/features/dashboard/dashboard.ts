import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, DatePipe],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  activeTab = signal<'seller' | 'participant'>('seller');
  sellerAuctions = signal<any[]>([]);
  participantBids = signal<any[]>([]);

  ngOnInit() {
    this.http.get('https://localhost:7071/api/dashboard/seller').subscribe({
      next: (data: any) => this.sellerAuctions.set(data),
    });
    this.http.get('https://localhost:7071/api/dashboard/participant').subscribe({
      next: (data: any) => this.participantBids.set(data),
    });
  }
}