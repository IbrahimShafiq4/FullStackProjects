import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipmentService, IEquipment } from '../../core/services/equipment.service';
import { PopupService } from '../../shared/services/popup.service';
import { ToastService } from '../../shared/services/toast.service';
import {
  EquipmentIllustration,
  illustrationFor,
} from '../../shared/components/equipment-illustration/equipment-illustration';

@Component({
  selector: 'app-my-equipment',
  imports: [RouterLink, EquipmentIllustration],
  templateUrl: './my-equipment.html',
})
export class MyEquipment implements OnInit {
  protected readonly equipment = inject(EquipmentService);
  private readonly _popup = inject(PopupService);
  private readonly _toast = inject(ToastService);

  protected readonly illustrationFor = illustrationFor;
  protected readonly busyId: WritableSignal<number | null> = signal(null);

  ngOnInit(): void {
    this.equipment.loadMyEquipment();
  }

  protected async onToggleAvailability(item: IEquipment): Promise<void> {
    this.busyId.set(item.id);
    this.equipment.setAvailability(item.id, !item.isAvailable).subscribe({
      next: () => {
        this.equipment.loadMyEquipment();
        this._toast.show(`Asset is now ${!item.isAvailable ? 'available' : 'unavailable'}.`, 'success');
        this.busyId.set(null);
      },
      error: (err) => {
        this._toast.show(typeof err.error === 'string' ? err.error : 'Failed to update availability.', 'error');
        this.busyId.set(null);
      },
    });
  }

  protected async onDelete(item: IEquipment): Promise<void> {
    const confirmed = await this._popup.confirm({
      title: 'DELETE ASSET',
      message: `"${item.name}" will be delisted from the exchange. This cannot be undone.`,
      type: 'danger',
      confirmLabel: 'Delete asset',
      cancelLabel: 'Keep it',
    });
    if (!confirmed) return;

    this.equipment.deleteEquipment(item.id).subscribe({
      next: () => {
        this._toast.show('Asset deleted.', 'success');
        this.equipment.loadMyEquipment();
      },
      error: () => this._toast.show('Failed to delete asset.', 'error'),
    });
  }
}