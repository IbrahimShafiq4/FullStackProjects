import {
  afterNextRender, Component, ElementRef, inject, signal,
  viewChild, WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { animate } from 'motion';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { CartService } from '../../core/services/cart.service';
import { CpuZone } from './zones/cpu-zone/cpu-zone';

export type TZone =
  | 'overview'
  | 'cpu' | 'ram' | 'gpu' | 'nvme'
  | 'psu' | 'chipset' | 'cooling' | 'io';

interface IZoneBounds { x: number; y: number; w: number; h: number; }

@Component({
  selector: 'app-workstation',
  imports: [CommonModule, CpuZone],
  templateUrl: './workstation.html',
  styleUrl: './workstation.css',
})
export class Workstation {
  public theme = inject(ThemeService);
  public auth = inject(AuthService);
  public products = inject(ProductsService);
  public categories = inject(CategoriesService);
  public cart = inject(CartService);
  private _router = inject(Router);

  private svgRef = viewChild<ElementRef<SVGSVGElement>>('caseSvg');

  readonly OVERVIEW_BOUNDS: IZoneBounds = { x: 0, y: 0, w: 1400, h: 900 };

  readonly ZONE_BOUNDS: Record<TZone, IZoneBounds> = {
    overview: this.OVERVIEW_BOUNDS,
    cpu: { x: 420, y: 180, w: 340, h: 320 },
    ram: { x: 780, y: 180, w: 260, h: 340 },
    gpu: { x: 240, y: 460, w: 800, h: 240 },
    nvme: { x: 240, y: 380, w: 500, h: 70 },
    psu: { x: 240, y: 720, w: 800, h: 130 },
    chipset: { x: 980, y: 620, w: 160, h: 90 },
    cooling: { x: 1080, y: 100, w: 220, h: 500 },
    io: { x: 60, y: 100, w: 180, h: 500 },
  };

  readonly ZONE_LABEL: Record<TZone, string> = {
    overview: 'OVERVIEW',
    cpu: 'CPU · IDENTITY',
    ram: 'RAM · CHAMBERS',
    gpu: 'GPU · MARKET',
    nvme: 'NVME · ARCHIVE',
    psu: 'PSU · SHIPPING',
    chipset: 'CHIPSET · TELEMETRY',
    cooling: 'COOLING · CATEGORIES',
    io: 'I/O · PORTS',
  };

  activeZone: WritableSignal<TZone> = signal<TZone>('overview');
  hoverZone: WritableSignal<TZone | null> = signal<TZone | null>(null);
  transitioning: WritableSignal<boolean> = signal(false);

  constructor() {
    afterNextRender(() => {
      this.products.loadProducts();
      this.categories.loadCategories();
    });
  }

  onZoneEnter(zone: TZone): void {
    if (this.transitioning()) return;
    this.hoverZone.set(zone);
  }

  onZoneLeave(): void { this.hoverZone.set(null); }

  onZoneClick(zone: TZone): void {
    if (this.transitioning() || this.activeZone() === zone) return;
    this.zoomTo(zone);
  }

  backToOverview(): void {
    if (this.transitioning() || this.activeZone() === 'overview') return;
    this.zoomTo('overview');
  }

  private zoomTo(zone: TZone): void {
    const svg = this.svgRef()?.nativeElement;
    if (!svg) return;

    const from = this.ZONE_BOUNDS[this.activeZone()];
    const to = this.ZONE_BOUNDS[zone];

    this.transitioning.set(true);
    this.activeZone.set(zone);

    animate(
      { x: from.x, y: from.y, w: from.w, h: from.h },
      { x: to.x, y: to.y, w: to.w, h: to.h },
      {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v: { x: number; y: number; w: number; h: number }) => {
          svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
        },
      },
    ).finished.then(() => this.transitioning.set(false));
  }

  goTo(path: string): void { this._router.navigate([path]); }
}