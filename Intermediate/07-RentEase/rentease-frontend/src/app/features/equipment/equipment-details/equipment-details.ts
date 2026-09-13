import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentService, IEquipment } from '../../../core/services/equipment.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { BookingForm } from '../booking-form/booking-form';

@Component({
  imports: [BookingForm],
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.html',
})
export class EquipmentDetails implements OnInit {
  private _EquipmentService = inject(EquipmentService);
  private _PopupService     = inject(PopupService);
  private _ToastService     = inject(ToastService);
  private _ActivatedRoute   = inject(ActivatedRoute);
  private _Router           = inject(Router);

  equipment: IEquipment | null = null;
  imageUrl: string | null = null;
  equipmentId!: number;

  ngOnInit(): void {
    const id = this._ActivatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.equipmentId = Number(id);
    this.onGetEquipmentDetails(this.equipmentId);
  }

  onGetEquipmentDetails(id: number): void {
    this._EquipmentService.getDetails(id).subscribe({
      next: (equipRes: IEquipment) => {
        this.equipment = equipRes;
        this.imageUrl = equipRes.imageUrl
          ? this._EquipmentService.getFullUrl(equipRes.imageUrl)
          : null;
      },
      error: (err) => {
        this._ToastService.show('فشل تحميل بيانات المعدة', 'error');
      }
    });
  }

  async onDelete(): Promise<void> {
    const confirmed = await this._PopupService.confirm({
      title: 'حذف المعدة',
      message: 'هل انت متاكد من الحذف ؟',
      type: 'danger'
    });

    if (confirmed) {
      this.onDeleteEquip();
    }
  }

  onDeleteEquip(): void {
    this._EquipmentService.deleteEquipment(this.equipmentId).subscribe({
      next: () => {
        this._ToastService.show('تم الحذف بنجاح', 'success');
        this._Router.navigate(['/equipment'])
      },
      error: (err) => {
        this._ToastService.show('فشل حذف المعدة', 'error');
      }
    });
  }
}