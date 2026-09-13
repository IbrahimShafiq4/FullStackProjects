import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { LedgerService, TCategoryType } from '../../../core/services/ledger.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-category-manager',
  templateUrl: './category-manager.html',
})
export class CategoryManager implements OnInit {
  public _LedgerService: LedgerService = inject(LedgerService);
  private _PopupService: PopupService = inject(PopupService);
  private _ToastService: ToastService = inject(ToastService);

  newName: WritableSignal<string> = signal<string>('');
  newType: WritableSignal<TCategoryType> = signal<TCategoryType>('Expense');

  ngOnInit(): void { this._LedgerService.loadCategories(); }

  onCreate(): void {
    if (!this.newName().trim()) return;

    this._LedgerService.createCategory(this.newName(), this.newType()).subscribe({
      next: () => {
        this._ToastService.show('تمت الإضافة', 'success');
        this.newName.set('');
        this._LedgerService.loadCategories();
      }
    })
  }

  async onDelete(id: number) {
    const confirmed = await this._PopupService.confirm({ title: 'حذف الفئة', message: 'هل أنت متأكد؟', type: 'danger' });
    if (confirmed) {
      this._LedgerService.deleteCategory(id).subscribe({
        next: () => {
          this._ToastService.show('تم الحذف', 'success');
          this._LedgerService.loadCategories();
        }
      });
    }
  }
}