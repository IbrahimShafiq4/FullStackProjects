import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { LedgerService } from '../../../core/services/ledger.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, FormField],
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.html',
})
export class TransactionForm implements OnInit {
  public  _LedgerService: LedgerService = inject(LedgerService);
  private _ToastService : ToastService  = inject(ToastService);
  private _Router       : Router        = inject(Router);

  formModel: WritableSignal<{categoryId: string, amount: number, description: string, isExpense: boolean}>
    = signal<{categoryId: string, amount: number, description: string, isExpense: boolean}>({
      categoryId  : '',
      amount      : 0,
      description : '',
      isExpense   : true
    })

  transactionForm = form(this.formModel, () => {});

  ngOnInit(): void { this._LedgerService.loadCategories(); }

  onSubmit(): void {
    const { categoryId, amount, description, isExpense } = this.formModel();
    const finalAmount = isExpense ? -Math.abs(amount) : Math.abs(amount);
    
    this._LedgerService.recordTransaction(Number(categoryId), finalAmount, description).subscribe({
      next: () => {
        this._ToastService.show('تم تسجيل الحركة', 'success');
        this._Router.navigate(['/dashboard'])
      },
      error: () => this._ToastService.show('حصل خطأ', 'error'),
    })
  }
}
