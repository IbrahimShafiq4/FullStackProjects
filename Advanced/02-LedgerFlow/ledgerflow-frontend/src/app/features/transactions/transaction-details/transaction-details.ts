import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [DatePipe],
  selector: 'app-transaction-details',
  styles: ``,
  templateUrl: './transaction-details.html',
})
export class TransactionDetails implements OnInit {
  private _HttpClient     : HttpClient          = inject(HttpClient);
  private _ActivatedRoute : ActivatedRoute      = inject(ActivatedRoute);

  transaction             : WritableSignal<any> = signal<any>(null);

  ngOnInit(): void {
    const id = this._ActivatedRoute.snapshot.paramMap.get('id');
    this._HttpClient.get(`https://localhost:7106/api/transactions/${id}/details`).subscribe({
      next: (details) => this.transaction.set(details),
    })
  }
}
