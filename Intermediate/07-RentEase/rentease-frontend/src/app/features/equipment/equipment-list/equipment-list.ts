import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipmentService } from '../../../core/services/equipment.service';
import { EquipmentForm } from "../equipment-form/equipment-form";

@Component({
  imports: [RouterLink, EquipmentForm],
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.html',
})
export class EquipmentList implements OnInit {
  equipmentService: EquipmentService = inject(EquipmentService);
  categoryFilter: WritableSignal<string> = signal<string>('');
  maxPriceFilter: WritableSignal<number | null> = signal<number | null>(null);
  ngOnInit() {
    this.equipmentService.loadEquipments();
  }
  applyFilters() {
    this.equipmentService.loadEquipments(
      this.maxPriceFilter() ?? undefined,
      this.categoryFilter() || undefined);
  }
}
