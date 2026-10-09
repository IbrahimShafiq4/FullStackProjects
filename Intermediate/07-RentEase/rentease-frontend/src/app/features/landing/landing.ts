import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipmentService } from '../../core/services/equipment.service';
import { AuthService } from '../../core/services/auth.service';
import {
  EquipmentIllustration,
  illustrationFor,
} from '../../shared/components/equipment-illustration/equipment-illustration';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, EquipmentIllustration],
  templateUrl: './landing.html',
})
export class Landing implements OnInit {
  protected readonly equipment = inject(EquipmentService);
  protected readonly auth = inject(AuthService);
  protected readonly illustrationFor = illustrationFor;

  protected readonly categories = [
    { code: 'CAM', label: 'Camera' },
    { code: 'AUD', label: 'Audio' },
    { code: 'LGT', label: 'Lighting' },
    { code: 'TLS', label: 'Tools' },
    { code: 'SPT', label: 'Sports' },
    { code: 'CMP', label: 'Camping' },
    { code: 'EVT', label: 'Events' },
    { code: 'ELC', label: 'Electronics' },
  ];

  protected readonly timeline = [
    { date: 'OCT 08', state: 'available', label: 'Available' },
    { date: 'OCT 12', state: 'booked', label: 'Booked by Mohamed' },
    { date: 'OCT 16', state: 'available', label: 'Available again' },
    { date: 'OCT 22', state: 'available', label: 'Available' },
  ];

  ngOnInit(): void {
    if (this.auth.currentUser()) this.equipment.loadEquipments();
  }
}