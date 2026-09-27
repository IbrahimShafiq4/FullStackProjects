import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductsService } from '../../../core/services/products.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';
import { CaseStrip } from '../../../shared/components/case-strip/case-strip';

@Component({
  imports: [RouterLink, DecimalPipe, AppShell, CaseStrip],
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  public products = inject(ProductsService);
  public categories = inject(CategoriesService);
  public auth = inject(AuthService);
  private _cart = inject(CartService);
  private _toast = inject(ToastService);
  private _route = inject(ActivatedRoute);

  searchTerm: WritableSignal<string> = signal('');
  categoryId: WritableSignal<number | undefined> = signal(undefined);
  adding: WritableSignal<number | null> = signal(null);

  ngOnInit(): void {
    const qp = this._route.snapshot.queryParamMap.get('categoryId');
    if (qp) this.categoryId.set(Number(qp));
    this.products.loadProducts(this.categoryId());
    this.categories.loadCategories();
  }

  onSearch(): void { this.products.loadProducts(this.categoryId(), this.searchTerm()); }

  selectCategory(id?: number): void {
    this.categoryId.set(id);
    this.products.loadProducts(id, this.searchTerm());
  }

  onQuickAdd(productId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.auth.currentUser()) {
      this._toast.show('سجّل دخولك الأول عشان تضيف للعربة.', 'error');
      return;
    }

    this.adding.set(productId);
    this._cart.addToCart(productId, 1).subscribe({
      next: (res) => { this.adding.set(null); this._toast.show(res.message, 'success'); },
      error: () => { this.adding.set(null); this._toast.show('تعذّر الإضافة للعربة.', 'error'); },
    });
  }
}