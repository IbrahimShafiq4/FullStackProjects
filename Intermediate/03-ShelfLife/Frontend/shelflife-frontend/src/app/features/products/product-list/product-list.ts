import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';
import { ProductForm } from '../product-form/product-form';
import { ProductCard } from '../product-card/product-card';
import { ProductsService, IMessage } from '../../../core/services/products.service';


@Component({
    imports: [ProductForm, ProductCard],
    selector: 'app-product-list',
    templateUrl: './product-list.html',
    styles: `
    .pl-page {
      min-height: 100vh;
      padding: 24px 20px 60px;
      direction: rtl;
      background: var(--bg);
      background-image:
        linear-gradient(45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(-45deg, var(--bg-2) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--bg-2) 75%),
        linear-gradient(-45deg, transparent 75%, var(--bg-2) 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    }

    .pl-inner {
      max-width: 1100px;
      margin: 0 auto;
    }

    .pl-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 14px;
      margin-bottom: 20px;
      border-bottom: 3px solid var(--ink);
      flex-wrap: wrap;
    }

    .pl-title-block {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .pl-title-icon {
      width: 46px;
      height: 46px;
      background: var(--olive);
      color: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 28px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .pl-title {
      font-family: var(--font-pixel-ar);
      font-size: 26px;
      font-weight: 700;
      color: var(--ink);
      margin: 0;
      line-height: 1.2;
      text-align: start;
    }

    .pl-sub {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      color: var(--muted);
      margin: 2px 0 0;
      text-align: start;
    }

    .pl-count {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--ink);
      color: var(--surface);
      font-family: var(--font-pixel-en);
      font-size: 18px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--orange);
      letter-spacing: 1px;
    }

    .pl-count-num {
      color: var(--gold);
      font-weight: 700;
    }

    .pl-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 20px;
    }

    .pl-empty {
      grid-column: 1 / -1;
      padding: 40px 20px;
      text-align: center;
      background: var(--surface);
      border: 3px dashed var(--ink);
    }

    .pl-empty-icon {
      font-size: 48px;
      line-height: 1;
      margin-bottom: 12px;
    }

    .pl-empty-title {
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      color: var(--ink);
      margin: 0 0 6px;
    }

    .pl-empty-sub {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      color: var(--muted);
      margin: 0;
    }

    @media (max-width: 1024px) {
      .pl-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 640px) {
      .pl-page { padding: 16px 14px 40px; }
      .pl-grid { grid-template-columns: 1fr; }
      .pl-title { font-size: 20px; }
    }
  `
})
export class ProductList implements OnInit {
    _products = inject(ProductsService);
    private _toast = inject(ToastService);

    ngOnInit(): void {
        this._products.loadProducts();
    }

    onDelete(id: number): void {
        this._products.deleteProduct(id).subscribe({
            next: (res: IMessage) => {
                this._toast.show(res.message, 'success');
                this._products.loadProducts();
            },
            error: () => this._toast.show('فشل الحذف', 'error')
        });
    }
}