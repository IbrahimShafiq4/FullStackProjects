import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipmentService } from '../../../core/services/equipment.service';
import {
  EquipmentIllustration,
  illustrationFor,
} from '../../../shared/components/equipment-illustration/equipment-illustration';

@Component({
  imports: [RouterLink, EquipmentIllustration],
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.html',
})
export class EquipmentList implements OnInit {
  equipmentService: EquipmentService = inject(EquipmentService);
  categoryFilter: WritableSignal<string> = signal<string>('');
  maxPriceFilter: WritableSignal<number | null> = signal<number | null>(null);
  protected readonly illustrationFor = illustrationFor;

  ngOnInit() {
    this.equipmentService.loadEquipments();
  }

  applyFilters() {
    this.equipmentService.loadEquipments(
      this.maxPriceFilter() ?? undefined,
      this.categoryFilter() || undefined
    );
  }
}