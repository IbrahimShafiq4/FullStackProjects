import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PropertiesService, IProperty } from '../../core/services/properties.service';
import { PropertyCard } from '../properties/property-card/property-card';

@Component({
  imports: [RouterLink, PropertyCard, FormsModule],
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
})
export class LandingPage implements OnInit {
  _AuthService = inject(AuthService);
  _PropertiesService = inject(PropertiesService);

  searchTerm = '';
  filteredProperties = signal<IProperty[]>([]);

  constructor() {
    effect(() => {
      const all = this._PropertiesService.properties();
      const term = this.searchTerm.trim().toLowerCase();
      if (!term) {
        this.filteredProperties.set(all);
      } else {
        const filtered = all.filter(p =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.ownerName.toLowerCase().includes(term)
        );
        this.filteredProperties.set(filtered);
      }
    });
  }

  ngOnInit() {
    this._PropertiesService.loadProperties();
  }

  searchProperties() {
    this.filteredProperties.set([]);
    setTimeout(() => {
      const all = this._PropertiesService.properties();
      const term = this.searchTerm.trim().toLowerCase();
      if (!term) {
        this.filteredProperties.set(all);
      } else {
        this.filteredProperties.set(all.filter(p =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.ownerName.toLowerCase().includes(term)
        ));
      }
    });
  }
}