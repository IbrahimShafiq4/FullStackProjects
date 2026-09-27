import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';
import { CaseStrip } from '../../../shared/components/case-strip/case-strip';

@Component({
  imports: [RouterLink, AppShell, CaseStrip],
  selector: 'app-cart-page',
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage implements OnInit {
  public cart = inject(CartService);
  private _popup = inject(PopupService);
  private _toast = inject(ToastService);

  removing: WritableSignal<number | null> = signal(null);

  ngOnInit(): void { this.cart.loadCart(); }

  async onRemove(id: number): Promise<void> {
    const confirmed = await this._popup.confirm({
      title: 'إزالة من العربة',
      message: 'هل تريد إزالة هذا المنتج من العربة؟',
      confirmLabel: 'إزالة', cancelLabel: 'خليه', type: 'confirm',
    });
    if (!confirmed) return;

    this.removing.set(id);
    this.cart.removeFromCart(id).subscribe({
      next: () => {
        this.removing.set(null);
        this._toast.show('تمت الإزالة.', 'success');
        this.cart.loadCart();
      },
      error: () => { this.removing.set(null); this._toast.show('تعذّر الإزالة.', 'error'); },
    });
  }
}