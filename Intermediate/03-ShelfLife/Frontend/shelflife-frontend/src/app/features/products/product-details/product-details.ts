import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProductsService, IProduct } from '../../../core/services/products.service';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmService } from '../../../shared/services/confirm.service';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-product-details',
  templateUrl: './product-details.html',
  styles: `
    .pd-page {
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

    .pd-inner { max-width: 900px; margin: 0 auto; }

    .pd-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
      text-decoration: none;
      margin-bottom: 16px;
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .pd-back:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .pd-back:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .pd-card {
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 8px 8px 0 var(--ink);
      overflow: hidden;
      position: relative;
    }

    .pd-card::before {
      content: '';
      position: absolute;
      top: -3px;
      right: -3px;
      width: 14px;
      height: 14px;
      background: var(--orange);
      border: 3px solid var(--ink);
      z-index: 2;
    }

    .pd-hero {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 0;
    }

    .pd-photo {
      background: var(--surface-2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 96px;
      font-family: var(--font-pixel-ar);
      font-weight: 700;
      color: var(--muted);
      border-left: 3px solid var(--ink);
      min-height: 320px;
      position: relative;
      overflow: hidden;
    }

    .pd-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      image-rendering: pixelated;
    }

    .pd-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 5px 12px;
      font-family: var(--font-pixel-en);
      font-size: 15px;
      line-height: 1.3;
      border: 2.5px solid var(--ink);
      letter-spacing: 1px;
      z-index: 1;
    }

    .badge-fresh { background: var(--olive-soft); color: var(--olive-2); }
    .badge-soon { background: var(--orange-soft); color: var(--orange-2); }
    .badge-expired { background: var(--danger-soft); color: var(--danger); }

    .pd-body {
      padding: 24px 22px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pd-kicker {
      font-family: var(--font-pixel-en);
      font-size: 15px;
      color: var(--muted);
      letter-spacing: 1.5px;
      line-height: 1.3;
    }

    .pd-name {
      font-family: var(--font-pixel-ar);
      font-size: 32px;
      font-weight: 700;
      color: var(--ink);
      margin: 0;
      text-align: start;
      line-height: 1.25;
    }

    .pd-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding-top: 12px;
      border-top: 3px dashed var(--ink);
    }

    .pd-meta-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 12px;
      background: var(--surface-2);
      border: 2px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
    }

    .pd-meta-label {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      font-weight: 700;
      color: var(--muted);
      line-height: 1.3;
      text-align: start;
    }

    .pd-meta-value {
      font-family: var(--font-pixel-ar);
      font-size: 18px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1.3;
      text-align: start;
    }

    .pd-audio {
      width: 100%;
      margin-top: 4px;
      height: 40px;
    }

    .pd-actions {
      display: flex;
      gap: 10px;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    .pd-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      background: var(--surface);
      color: var(--ink);
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      transition: all 0.1s steps(2);
      line-height: 1.2;
    }

    .pd-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--ink);
    }

    .pd-btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .pd-btn-solid {
      background: var(--ink);
      color: var(--surface);
    }

    .pd-btn-solid:hover {
      background: var(--olive);
      box-shadow: 4px 4px 0 var(--olive);
    }

    .pd-btn-danger {
      background: var(--danger);
      color: var(--surface);
    }

    .pd-btn-danger:hover {
      background: #8a2f24;
      box-shadow: 4px 4px 0 var(--ink);
    }

    .pd-loading {
      padding: 60px 20px;
      text-align: center;
      font-family: var(--font-pixel-ar);
      font-size: 18px;
      color: var(--muted);
      line-height: 1.6;
    }

    .pd-loading-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: var(--orange);
      margin: 0 3px;
      animation: pixel-blink 1s steps(2) infinite;
    }

    .pd-loading-dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .pd-loading-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @media (max-width: 768px) {
      .pd-page { padding: 16px 14px 40px; }
      .pd-hero { grid-template-columns: 1fr; }
      .pd-photo {
        border-left: none;
        border-bottom: 3px solid var(--ink);
        min-height: 220px;
      }
      .pd-name { font-size: 24px; }
      .pd-meta { grid-template-columns: 1fr; }
      .pd-actions { flex-direction: column; }
      .pd-btn { justify-content: center; }
    }
  `
})
export class ProductDetails implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _products = inject(ProductsService);
  private _toast = inject(ToastService);
  private _confirm = inject(ConfirmService);

  product: WritableSignal<IProduct | null> = signal<IProduct | null>(null);
  loading: WritableSignal<boolean> = signal<boolean>(true);

  get productId(): number {
    return Number(this._route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this._products.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => {
        this._toast.show('المنتج مش موجود', 'error');
        this._router.navigate(['/products']);
      }
    });
  }

  photoUrl(): string | null {
    const p = this.product();
    if (!p) return null;
    const url = p.photoUrl || p.thumbnailUrl;
    return url ? this._products.getFullUrl(url) : null;
  }

  voiceUrl(): string | null {
    const p = this.product();
    if (!p || !p.voiceNoteUrl) return null;
    return this._products.getFullUrl(p.voiceNoteUrl);
  }

  badgeTone(): string {
    const freshness = this.product()?.freshness;
    if (freshness === 'Fresh') return 'badge-fresh';
    if (freshness === 'ExpiringSoon') return 'badge-soon';
    return 'badge-expired';
  }

  badgeLabel(): string {
    const freshness = this.product()?.freshness;
    if (freshness === 'Fresh') return 'FRESH';
    if (freshness === 'ExpiringSoon') return 'URGENT';
    return 'EXPIRED';
  }

  async onDelete(): Promise<void> {
    const name = this.product()?.name ?? 'هذا المنتج';

    const ok = await this._confirm.open({
      title: 'حذف المنتج',
      message: `هل تريد حذف "${name}" نهائياً؟ سيتم حذف الصورة والملاحظة الصوتية كذلك.`,
      confirmText: 'احذف',
      cancelText: 'إلغاء',
      tone: 'danger'
    });

    if (!ok) return;

    this._products.deleteProduct(this.productId).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this._router.navigate(['/products']);
      },
      error: () => this._toast.show('فشل الحذف', 'error')
    });
  }
}