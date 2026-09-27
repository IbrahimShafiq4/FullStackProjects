import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IProduct, ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';
import { ReviewsService, IReview } from '../../../core/services/reviews.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';
import { CaseStrip } from '../../../shared/components/case-strip/case-strip';

@Component({
  imports: [DecimalPipe, DatePipe, FormsModule, RouterLink, AppShell, CaseStrip],
  selector: 'app-product-details',
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  public products = inject(ProductsService);
  public auth = inject(AuthService);
  private _reviews = inject(ReviewsService);
  private _cart = inject(CartService);
  private _popup = inject(PopupService);
  private _toast = inject(ToastService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  product: WritableSignal<IProduct | null> = signal<IProduct | null>(null);
  reviews: WritableSignal<IReview[]> = signal<IReview[]>([]);
  quantity: WritableSignal<number> = signal(1);
  loading: WritableSignal<boolean> = signal(true);
  adding: WritableSignal<boolean> = signal(false);

  reviewRating = signal(5);
  reviewComment = signal('');
  reviewSaving = signal(false);

  productId!: number;

  ngOnInit(): void {
    this.productId = Number(this._route.snapshot.paramMap.get('id'));
    this.loadProduct();
    this.loadReviews();
  }

  loadProduct(): void {
    this.loading.set(true);
    this.products.getDetails(this.productId).subscribe({
      next: (p) => { this.product.set(p); this.loading.set(false); },
      error: () => { this.loading.set(false); this._toast.show('المنتج غير موجود.', 'error'); },
    });
  }

  loadReviews(): void {
    this._reviews.getProductReviews(this.productId).subscribe({
      next: (list) => this.reviews.set(list),
    });
  }

  step(delta: number): void {
    const next = this.quantity() + delta;
    if (next >= 1 && next <= (this.product()?.stockQuantity ?? 99)) this.quantity.set(next);
  }

  onAddToCart(): void {
    if (!this.auth.currentUser()) {
      this._toast.show('سجّل دخولك الأول.', 'error');
      this._router.navigate(['/login']);
      return;
    }

    this.adding.set(true);
    this._cart.addToCart(this.productId, this.quantity()).subscribe({
      next: (res) => { this.adding.set(false); this._toast.show(res.message, 'success'); },
      error: () => { this.adding.set(false); this._toast.show('تعذّر الإضافة.', 'error'); },
    });
  }

  async onDelete(): Promise<void> {
    const confirmed = await this._popup.confirm({
      title: 'حذف المنتج',
      message: 'هل أنت متأكد؟ القطعة هتتشال نهائياً من السوق.',
      confirmLabel: 'حذف', cancelLabel: 'إلغاء', type: 'danger',
    });
    if (!confirmed) return;

    this.products.deleteProduct(this.productId).subscribe({
      next: (res) => { this._toast.show(res.message, 'success'); this._router.navigate(['/products']); },
    });
  }

  submitReview(): void {
    if (!this.auth.currentUser()) { this._toast.show('سجّل دخولك الأول.', 'error'); return; }
    if (this.reviewRating() < 1 || this.reviewRating() > 5) { this._toast.show('التقييم من 1 لـ 5.', 'error'); return; }
    if (!this.reviewComment().trim()) { this._toast.show('اكتب تعليق.', 'error'); return; }

    this.reviewSaving.set(true);
    this._reviews.addReview(this.productId, this.reviewRating(), this.reviewComment()).subscribe({
      next: () => {
        this.reviewSaving.set(false);
        this.reviewComment.set('');
        this.reviewRating.set(5);
        this._toast.show('تم إضافة تقييمك.', 'success');
        this.loadReviews();
        this.loadProduct();
      },
      error: (err) => {
        this.reviewSaving.set(false);
        this._toast.show(err.error ?? 'تعذّر إضافة التقييم.', 'error');
      },
    });
  }

  setRating(v: number): void { this.reviewRating.set(v); }
}