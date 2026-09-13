import { Component, inject, OnInit } from '@angular/core';
import { PropertiesService } from '../../../core/services/properties.service';
import { PropertyCard } from "../property-card/property-card";

@Component({
  imports: [PropertyCard],
  selector: 'app-property-list',
  templateUrl: './property-list.html',
})
export class PropertyList implements OnInit {
  _PropertiesService: PropertiesService = inject(PropertiesService);
  ngOnInit() { this._PropertiesService.loadProperties(); }
}