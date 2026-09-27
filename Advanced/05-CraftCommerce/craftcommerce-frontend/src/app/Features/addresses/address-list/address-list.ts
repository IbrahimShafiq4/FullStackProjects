import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddressesService, IAddress } from '../../../core/services/addresses.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';

@Component({
  imports: [RouterLink, FormsModule, AppShell],
  selector: 'app-address-list',
  templateUrl: './address-list.html',
  styleUrl: './address-list.css',
})
export class AddressList implements OnInit {
  public addresses = inject(AddressesService);
  private _popup = inject(PopupService);
  private _toast = inject(ToastService);

  showForm = signal(false);
  editing: WritableSignal<IAddress | null> = signal(null);

  formCity = signal('');
  formCountry = signal('');
  formFull = signal('');
  formZone = signal('SameCity');

  saving: WritableSignal<boolean> = signal(false);

  ngOnInit(): void { this.addresses.loadAddresses(); }

  openCreate(): void {
    this.editing.set(null);
    this.formCity.set(''); this.formCountry.set(''); this.formFull.set(''); this.formZone.set('SameCity');
    this.showForm.set(true);
  }

  openEdit(a: IAddress): void {
    this.editing.set(a);
    this.formCity.set(a.city);
    this.formCountry.set(a.country);
    this.formFull.set(a.fullAddress);
    this.formZone.set(a.zone);
    this.showForm.set(true);
  }

  save(): void {
    if (!this.formCity() || !this.formCountry() || !this.formFull()) {
      this._toast.show('املأ كل الحقول.', 'error');
      return;
    }

    this.saving.set(true);

    const editing = this.editing();
    if (editing) {
      this.addresses.updateAddress(editing.id, {
        id: editing.id,
        city: this.formCity(),
        country: this.formCountry(),
        fullAddress: this.formFull(),
        zone: this.formZone(),
      }).subscribe({
        next: (res) => {
          this.saving.set(false);
          this.showForm.set(false);
          this._toast.show(res.message, 'success');
          this.addresses.loadAddresses();
        },
        error: () => {
          this.saving.set(false);
          this._toast.show('تعذّر التعديل.', 'error');
        },
      });
    } else {
      this.addresses.createAddress(this.formCity(), this.formCountry(), this.formFull(), this.formZone())
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.showForm.set(false);
            this._toast.show('تم حفظ العنوان.', 'success');
            this.addresses.loadAddresses();
          },
          error: () => {
            this.saving.set(false);
            this._toast.show('تعذّر الحفظ.', 'error');
          },
        });
    }
  }

  async remove(a: IAddress): Promise<void> {
    const confirmed = await this._popup.confirm({
      title: 'حذف العنوان',
      message: `هتشيل "${a.fullAddress}" نهائياً.`,
      confirmLabel: 'حذف',
      cancelLabel: 'إلغاء',
      type: 'danger',
    });
    if (!confirmed) return;

    this.addresses.deleteAddress(a.id).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this.addresses.loadAddresses();
      },
    });
  }

  cancelForm(): void { this.showForm.set(false); }
}