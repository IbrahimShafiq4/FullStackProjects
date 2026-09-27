import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-subscriptions',
  styleUrl: './subscriptions.css',
  templateUrl: './subscriptions.html',
})
export class Subscriptions implements OnInit {
  private _HttpClient: HttpClient = inject(HttpClient);
  private _ToastService: ToastService = inject(ToastService);

  status: WritableSignal<{ isActive: boolean; expiresAt: string | null }> = signal<{ isActive: boolean; expiresAt: string | null }>({ isActive: false, expiresAt: null });

  ngOnInit(): void { this.loadStatus(); }

  loadStatus(): void {
    this._HttpClient.get<any>('https://localhost:7178/api/subscriptions/status').subscribe({
      next: (subscibtions: any) => this.status.set(subscibtions),
      error: (error: HttpErrorResponse) => this._ToastService.show(error.error, 'error'),
    });
  }

  onSubscribe(): void {
    this._HttpClient.post('https://localhost:7178/api/subscriptions/subscribe', {}).subscribe({
      next: () => {
        this._ToastService.show('تم الإشتراك بنجاح', 'success');
        this.loadStatus();
      }
    })
  }
}