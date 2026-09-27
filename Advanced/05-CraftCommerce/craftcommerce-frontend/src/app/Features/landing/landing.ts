import {
  afterNextRender, Component, computed, ElementRef, inject, OnInit, signal, viewChild, WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { animate } from 'motion';
import { ProductsService, IProduct } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { AppShell } from '../../shared/components/app-shell/app-shell';

@Component({
  imports: [RouterLink, DecimalPipe, AppShell],
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  public productsService = inject(ProductsService);
  public categoriesService = inject(CategoriesService);

  private gpuRef = viewChild<ElementRef<HTMLElement>>('gpu');

  readonly booted: WritableSignal<boolean> = signal<boolean>(false);
  readonly bootStep: WritableSignal<number> = signal<number>(0);

  readonly bootLines: string[] = [
    'POST · CRAFTCOMMERCE BIOS v01',
    'MEM · OK · 32768 MB',
    'CPU · ARTISAN-CORE · OK',
    'GPU · RELIC-DISPLAY-01 · OK',
    'NVME · MARKET-ARCHIVE · OK',
    'NET · CAIRO-NODE · LINKED',
    'AUTH · SESSION · READY',
  ];

  readonly ramModules = computed(() => this.categoriesService.categories().slice(0, 4));

  readonly featured = computed<IProduct[]>(() => {
    const all = this.productsService.products();
    return [...all].sort((a, b) => b.avgRating - a.avgRating).slice(0, 4);
  });

  readonly totalProducts = computed(() => this.productsService.products().length);
  readonly totalCategories = computed(() => this.categoriesService.categories().length);
  readonly totalArtisans = computed(() => {
    const set = new Set(this.productsService.products().map((p) => p.artisanName));
    return set.size;
  });

  constructor() {
    afterNextRender(() => this.runBoot());
  }

  ngOnInit(): void {
    this.productsService.loadProducts();
    this.categoriesService.loadCategories();
  }

  private runBoot(): void {
    let i = 0;
    const tick = () => {
      this.bootStep.set(i);
      i++;
      if (i <= this.bootLines.length) {
        setTimeout(tick, 180);
      } else {
        setTimeout(() => {
          this.booted.set(true);
          const gpu = this.gpuRef()?.nativeElement;
          if (gpu) {
            animate(gpu, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
          }
        }, 250);
      }
    };
    setTimeout(tick, 150);
  }

  pad(n: number, len: number): string { return n.toString().padStart(len, '0'); }
}