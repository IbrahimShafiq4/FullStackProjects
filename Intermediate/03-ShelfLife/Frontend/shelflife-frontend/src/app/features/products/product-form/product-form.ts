import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { VoiceRecorder } from '../voice-recorder/voice-recorder';
import { ProductsService, ICreateProductResponse } from '../../../core/services/products.service';

@Component({
  imports: [FormsModule, VoiceRecorder],
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  styles: `
    .form-card {
      background: var(--surface);
      border: 3px solid var(--ink);
      box-shadow: 6px 6px 0 var(--ink);
      padding: 18px 16px;
      position: relative;
      direction: rtl;
    }

    .form-card::before {
      content: '';
      position: absolute;
      top: -3px;
      right: -3px;
      width: 12px;
      height: 12px;
      background: var(--orange);
      border: 3px solid var(--ink);
    }

    .form-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 3px dashed var(--ink);
    }

    .form-head-icon {
      width: 36px;
      height: 36px;
      background: var(--olive);
      color: var(--surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-pixel-en);
      font-size: 22px;
      line-height: 1;
      border: 2.5px solid var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
    }

    .form-head-title {
      font-family: var(--font-pixel-ar);
      font-size: 20px;
      font-weight: 700;
      color: var(--ink);
      margin: 0;
      line-height: 1.2;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 120px;
      gap: 10px;
      margin-bottom: 10px;
    }

    .form-grid-full {
      grid-template-columns: 1fr;
      margin-bottom: 10px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .form-label {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink-2);
      text-align: start;
    }

    .form-input {
      width: 100%;
      padding: 9px 11px;
      font-family: var(--font-pixel-ar);
      font-size: 15px;
      color: var(--ink);
      background: var(--surface-2);
      border: 2.5px solid var(--ink);
      box-shadow: inset 2px 2px 0 rgba(26, 28, 20, 0.08);
      outline: none;
      transition: all 0.1s steps(2);
      text-align: start;
    }

    .form-input:focus {
      background: var(--surface);
      box-shadow: 3px 3px 0 var(--orange);
      transform: translate(-1px, -1px);
    }

    .file-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: var(--surface-2);
      border: 2px dashed var(--ink-2);
      margin-bottom: 10px;
    }

    .file-label {
      font-family: var(--font-pixel-ar);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink-2);
      cursor: pointer;
      flex-shrink: 0;
    }

    .file-input {
      display: none;
    }

    .file-name {
      font-family: var(--font-pixel-ar);
      font-size: 13px;
      color: var(--muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .form-submit {
      width: 100%;
      padding: 12px 18px;
      margin-top: 8px;
      font-family: var(--font-pixel-ar);
      font-size: 17px;
      font-weight: 700;
      color: var(--surface);
      background: var(--olive);
      border: 2.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--ink);
      cursor: pointer;
      transition: all 0.1s steps(2);
    }

    .form-submit:hover {
      background: var(--olive-2);
      transform: translate(-1px, -1px);
      box-shadow: 5px 5px 0 var(--ink);
    }

    .form-submit:active {
      transform: translate(3px, 3px);
      box-shadow: 0 0 0 var(--ink);
    }

    .form-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: 4px 4px 0 var(--ink);
    }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `
})
export class ProductForm {
  private _products = inject(ProductsService);
  private _toast = inject(ToastService);

  productAdded: OutputEmitterRef<void> = output<void>();

  model = { name: '', quantity: 1, expiryDate: '' };
  selectedPhoto: WritableSignal<File | null> = signal<File | null>(null);
  recordedVoiceBlob: WritableSignal<Blob | null> = signal<Blob | null>(null);
  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedPhoto.set(file);
  }

  onVoiceRecorded(blob: Blob): void {
    this.recordedVoiceBlob.set(blob);
    this._toast.show('تم حفظ الملاحظة الصوتية', 'success');
  }

  onSubmit(): void {
    const { name, quantity, expiryDate } = this.model;

    if (!name.trim() || !expiryDate) {
      this._toast.show('املا الاسم والتاريخ', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('quantity', quantity.toString());
    formData.append('expiryDate', expiryDate);

    const photo = this.selectedPhoto();
    if (photo) formData.append('photo', photo, photo.name);

    this.isSubmitting.set(true);

    this._products.createProduct(formData).subscribe({
      next: (product: ICreateProductResponse) => {
        const voiceBlob = this.recordedVoiceBlob();

        if (voiceBlob) {
          this._products.uploadVoiceNote(product.id, voiceBlob).subscribe({
            next: () => this.finish(),
            error: () => {
              this._toast.show('المنتج اتضاف بس الصوت فشل', 'error');
              this.finish();
            }
          });
        } else {
          this.finish();
        }
      },
      error: () => {
        this._toast.show('فشل إضافة المنتج', 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  private finish(): void {
    this._toast.show('تم إضافة المنتج', 'success');
    this.model = { name: '', quantity: 1, expiryDate: '' };
    this.selectedPhoto.set(null);
    this.recordedVoiceBlob.set(null);
    this.isSubmitting.set(false);
    this.productAdded.emit();
  }
}