import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ArtisansService } from '../../../core/services/artisans.service';
import { ProductsService } from '../../../core/services/products.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';

@Component({
  imports: [RouterLink, DecimalPipe, AppShell],
  selector: 'app-my-products',
  templateUrl: './my-products.html',
  styleUrl: './my-products.css',
})
export class MyProducts implements OnInit {
  public artisans = inject(ArtisansService);
  private _products = inject(ProductsService);
  private _popup = inject(PopupService);
  private _toast = inject(ToastService);

  deleting: WritableSignal<number | null> = signal(null);

  ngOnInit(): void { this.artisans.loadMyProducts(); }

  async remove(id: number, name: string): Promise<void> {
    const ok = await this._popup.confirm({
      title: 'حذف المنتج',
      message: `هتشيل "${name}" نهائياً من السوق.`,
      confirmLabel: 'حذف',
      cancelLabel: 'إلغاء',
      type: 'danger',
    });
    if (!ok) return;

    this.deleting.set(id);
    this._products.deleteProduct(id).subscribe({
      next: (res) => {
        this.deleting.set(null);
        this._toast.show(res.message, 'success');
        this.artisans.loadMyProducts();
      },
      error: () => {
        this.deleting.set(null);
        this._toast.show('تعذّر الحذف.', 'error');
      },
    });
  }
}