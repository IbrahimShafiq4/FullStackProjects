import { Component, inject, OnInit } from '@angular/core';
import { LedgerService } from '../../core/services/ledger.service';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  public _LedgerService: LedgerService = inject(LedgerService);

  ngOnInit(): void {
    this._LedgerService.loadBalance();
    this._LedgerService.loadTransactions();
  }
}
