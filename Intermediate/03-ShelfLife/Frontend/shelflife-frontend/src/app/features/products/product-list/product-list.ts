import { Component, inject, OnInit } from '@angular/core';
import { IMessage, ProductsService } from '../../../core/services/products-service';
import { ToastService } from '../../../core/services/toast-service';
import { ProductForm } from "../product-form/product-form";
import { ProductCard } from "../product-card/product-card";

@Component({
  imports: [ProductForm, ProductCard],
  selector: 'app-product-list',
  styles: ``,
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  _ProductsService: ProductsService = inject(ProductsService);
  private _ToastService: ToastService = inject(ToastService);

  ngOnInit(): void {
    this._ProductsService.loadProducts();
  }

  onDelete(id: number): void {
    this._ProductsService.deleteProduct(id).subscribe({
      next: (product: IMessage) => {
        this._ToastService.show(product.message, 'success');
        this._ProductsService.loadProducts();
      },
      error: () => this._ToastService.show('حصل خطأ أثناء الحذف', 'error')
    })
  }
}
