import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../../core/services/products.service';

@Component({
    imports: [DatePipe, RouterLink],
    selector: 'app-product-card',
    templateUrl: './product-card.html',
    styles: `
    .p-card {
      background: var(--surface);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      transition: all 0.1s steps(2);
    }

    .p-card:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 var(--ink);
    }

    .p-card-photo {
      height: 140px;
      background: var(--surface-2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 56px;
      font-family: var(--font-pixel-ar);
      font-weight: 700;
      color: var(--muted);
      border-bottom: 2.5px solid var(--ink);
      position: relative;
      overflow: hidden;
    }

    .p-card-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      image-rendering: pixelated;
    }

    .p-card-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 3px 8px;
      font-family: var(--font-pixel-en);
      font-size: 13px;
      line-height: 1.3;
      border: 2px solid var(--ink);
      letter-spacing: 0.5px;
    }

    .badge-fresh { background: var(--olive-soft); color: var(--olive-2); }
    .badge-soon { background: var(--orange-soft); color: var(--orange-2); }
    .badge-expired { background: var(--danger-soft); color: var(--danger); }

    .p-card-body {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .p-card-name {
      font-family: var(--font-pixel-ar);
      font-size: 18px;
      font-weight: 700;
      color: var(--ink);
      margin: 0;
      text-align: start;
      line-height: 1.3;
    }

    .p-card-info {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      color: var(--muted);
      line-height: 1.7;
      text-align: start;
      margin: 0;
    }

    .p-card-info strong {
      color: var(--ink-2);
      font-weight: 700;
    }

    .p-card-audio {
      width: 100%;
      margin-top: 6px;
      height: 32px;
    }

    .p-card-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-top: 10px;
      margin-top: auto;
      border-top: 2px dashed var(--ink);
    }

    .p-card-id {
      font-family: var(--font-pixel-en);
      font-size: 14px;
      color: var(--muted-2);
      line-height: 1;
    }

    .p-card-actions {
      display: flex;
      gap: 6px;
    }

    .p-card-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      font-weight: 700;
      color: var(--ink);
      background: var(--surface);
      border: 2px solid var(--ink);
      box-shadow: 2px 2px 0 var(--ink);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.1s steps(2);
      line-height: 1;
    }

    .p-card-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .p-card-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 0 0 0 var(--ink);
    }

    .p-card-btn-view {
      background: var(--olive);
      color: var(--surface);
    }

    .p-card-btn-view:hover {
      background: var(--olive-2);
    }

    .p-card-btn-delete {
      background: var(--danger);
      color: var(--surface);
    }

    .p-card-btn-delete:hover {
      background: #8a2f24;
    }
  `
})
export class ProductCard {
    product: InputSignal<IProduct> = input.required<IProduct>();
    photoUrl: InputSignal<string | null> = input.required<string | null>();
    voiceUrl: InputSignal<string | null> = input.required<string | null>();

    onDelete: OutputEmitterRef<number> = output<number>();

    badgeTone(): string {
        const freshness = this.product().freshness;

        if (freshness === 'Fresh') return 'badge-fresh';
        if (freshness === 'ExpiringSoon') return 'badge-soon';
        return 'badge-expired';
    }

    badgeLabel(): string {
        const freshness = this.product().freshness;

        if (freshness === 'Fresh') return 'FRESH';
        if (freshness === 'ExpiringSoon') return 'URGENT';
        return 'EXPIRED';
    }

    onDeleteClick(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.onDelete.emit(this.product().id);
    }
}