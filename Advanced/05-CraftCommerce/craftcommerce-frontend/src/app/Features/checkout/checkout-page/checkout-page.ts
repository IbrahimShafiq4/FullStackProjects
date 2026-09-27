import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrdersService } from '../../../core/services/orders.service';
import { AddressesService, IAddress } from '../../../core/services/addresses.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';
import { CaseStrip } from '../../../shared/components/case-strip/case-strip';

@Component({
  imports: [FormsModule, RouterLink, AppShell, CaseStrip],
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {
  public addresses = inject(AddressesService);
  public cart = inject(CartService);
  private _orders = inject(OrdersService);
  private _toast = inject(ToastService);
  private _router = inject(Router);

  selectedId: WritableSignal<number | null> = signal(null);
  loading: WritableSignal<boolean> = signal(false);

  showForm = signal(false);
  formCity = signal('');
  formCountry = signal('');
  formFull = signal('');
  formZone = signal('SameCity');
  savingAddr = signal(false);

  ngOnInit(): void {
    this.addresses.loadAddresses();
    this.cart.loadCart();
  }

  select(id: number): void { this.selectedId.set(id); }

  saveAddress(): void {
    if (!this.formCity() || !this.formCountry() || !this.formFull()) {
      this._toast.show('املأ كل الحقول.', 'error');
      return;
    }

    this.savingAddr.set(true);
    this.addresses.createAddress(this.formCity(), this.formCountry(), this.formFull(), this.formZone())
      .subscribe({
        next: (res) => {
          this.savingAddr.set(false);
          this.showForm.set(false);
          this.formCity.set(''); this.formCountry.set(''); this.formFull.set('');
          this.selectedId.set(res.id);
          this._toast.show('تم حفظ العنوان.', 'success');
          this.addresses.loadAddresses();
        },
        error: () => { this.savingAddr.set(false); this._toast.show('تعذّر حفظ العنوان.', 'error'); },
      });
  }

  confirmOrder(): void {
    if (!this.selectedId()) { this._toast.show('اختار عنوان الشحن الأول.', 'error'); return; }

    this.loading.set(true);
    this._orders.checkout(this.selectedId()!).subscribe({
      next: () => {
        this._toast.show('تم تأكيد الطلب بنجاح 🎉', 'success');
        this._router.navigate(['/orders']);
      },
      error: (err) => { this.loading.set(false); this._toast.show(err.error ?? 'فشل إتمام الطلب.', 'error'); },
    });
  }
}