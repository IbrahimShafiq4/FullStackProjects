import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EquipmentService, IEquipment } from '../../../core/services/equipment.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { BookingForm } from '../booking-form/booking-form';
import {
  EquipmentIllustration,
  illustrationFor,
} from '../../../shared/components/equipment-illustration/equipment-illustration';

@Component({
  imports: [BookingForm, RouterLink, EquipmentIllustration],
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.html',
})
export class EquipmentDetails implements OnInit {
  private readonly _EquipmentService = inject(EquipmentService);
  private readonly _PopupService     = inject(PopupService);
  private readonly _ToastService     = inject(ToastService);
  private readonly _ActivatedRoute   = inject(ActivatedRoute);
  private readonly _Router           = inject(Router);

  protected readonly auth = inject(AuthService);
  protected readonly illustrationFor = illustrationFor;

  // ✅ signals, not plain properties
  readonly equipment = signal<IEquipment | null>(null);
  readonly imageUrl  = signal<string | null>(null);
  readonly loading   = signal(true);

  private equipmentId!: number;

  ngOnInit(): void {
    const id = this._ActivatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }
    this.equipmentId = Number(id);
    this.onGetEquipmentDetails(this.equipmentId);
  }

  onGetEquipmentDetails(id: number): void {
    this.loading.set(true);
    this._EquipmentService.getDetails(id).subscribe({
      next: (res) => {
        this.equipment.set(res);
        this.imageUrl.set(res.imageUrl ? this._EquipmentService.getFullUrl(res.imageUrl) : null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this._ToastService.show('Failed to load asset record.', 'error');
      },
    });
  }

  async onDelete(): Promise<void> {
    const confirmed = await this._PopupService.confirm({
      title: 'DELETE ASSET',
      message: 'This will delist the equipment from the exchange. It cannot be undone.',
      type: 'danger',
      confirmLabel: 'Delete asset',
      cancelLabel: 'Keep it',
    });
    if (confirmed) this.onDeleteEquip();
  }

  onDeleteEquip(): void {
    this._EquipmentService.deleteEquipment(this.equipmentId).subscribe({
      next: () => {
        this._ToastService.show('Asset deleted.', 'success');
        this._Router.navigate(['/equipment']);
      },
      error: () => this._ToastService.show('Failed to delete asset.', 'error'),
    });
  }
}