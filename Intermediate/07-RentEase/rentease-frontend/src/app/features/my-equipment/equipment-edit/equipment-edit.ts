import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, schema, required, min } from '@angular/forms/signals';
import { EquipmentService } from '../../../core/services/equipment.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-equipment-edit',
  imports: [FormField, RouterLink],
  templateUrl: './equipment-edit.html',
})
export class EquipmentEdit implements OnInit {
  private readonly _equipment = inject(EquipmentService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);

  protected readonly loading = signal(true);
  protected readonly submitting: WritableSignal<boolean> = signal(false);
  protected equipmentId!: number;

  protected formModel: WritableSignal<{ name: string; category: string; pricePerDay: number }> =
    signal({ name: '', category: '', pricePerDay: 0 });

  protected equipmentForm = form(this.formModel, (path) => {
    required(path.name, { message: 'Name is required' });
    required(path.category, { message: 'Category is required' });
    min(path.pricePerDay, 1, { message: 'Daily rate must be greater than zero' });
  });

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) {
      this._router.navigate(['/my-equipment']);
      return;
    }
    this.equipmentId = Number(id);

    this._equipment.getDetails(this.equipmentId).subscribe({
      next: (e) => {
        this.formModel.set({
          name: e.name,
          category: e.category,
          pricePerDay: e.pricePerDay,
        });
        this.loading.set(false);
      },
      error: () => {
        this._toast.show('Failed to load asset.', 'error');
        this._router.navigate(['/my-equipment']);
      },
    });
  }

  protected onSubmit(): void {
    if (this.equipmentForm().invalid()) {
      this._toast.show('Please fix the errors before saving.', 'error');
      return;
    }

    const { name, category, pricePerDay } = this.formModel();
    this.submitting.set(true);

    this._equipment.updateEquipment(this.equipmentId, { name, category, pricePerDay }).subscribe({
      next: () => {
        this._toast.show('Asset updated.', 'success');
        this._router.navigate(['/my-equipment']);
      },
      error: (err) => {
        this._toast.show(typeof err.error === 'string' ? err.error : 'Failed to update asset.', 'error');
        this.submitting.set(false);
      },
    });
  }
}