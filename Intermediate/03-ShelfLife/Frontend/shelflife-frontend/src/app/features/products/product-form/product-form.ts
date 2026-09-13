import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { ICreateProductResponse, ProductsService } from '../../../core/services/products-service';
import { ToastService } from '../../../core/services/toast-service';
import { form, FormField } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoiceRecorder } from "../voice-recorder/voice-recorder";
import { of, switchMap } from 'rxjs';

@Component({
  imports: [CommonModule, FormsModule, FormField, VoiceRecorder],
  selector: 'app-product-form',
  styles: ``,
  templateUrl: './product-form.html',
})
export class ProductForm {
  private _ProductsService: ProductsService = inject(ProductsService);
  private _ToastService: ToastService = inject(ToastService);
  productAdded: OutputEmitterRef<void> = output<void>();
  formModel: WritableSignal<{ name: string, quantity: number, expiryDate: string }> = signal<{ name: string, quantity: number, expiryDate: string }>({ name: '', quantity: 1, expiryDate: '' });
  productForm = form(this.formModel, () => { });
  selectedPhoto: WritableSignal<File | null> = signal<File | null>(null);
  recordedVoiceBlob: WritableSignal<Blob | null> = signal<Blob | null>(null);
  createdProductId: WritableSignal<number | null> = signal<number | null>(null);
  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  onPhotoSelected(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedPhoto.set(file);
    console.log('Selected photo:', file);
  }
  onVoiceRecorded(blob: Blob): void {
    this.recordedVoiceBlob.set(blob);
    console.log('Recorded voice:', blob);
    const productId = this.createdProductId();
    if (productId) {
      this._ProductsService.uploadVoiceNote(productId, blob).subscribe({
        next: (response) => {
          console.log('Voice uploaded:', response);
          this._ToastService.show('تم حفظ الملاحظة الصوتية', 'success');
        },
        error: (error) => {
          console.error('Voice upload failed:', error);
          this._ToastService.show('فشل حفظ الملاحظة الصوتية', 'error');
        }
      });
    } else {
      this._ToastService.show('تم تسجيل الملاحظة الصوتية', 'success');
    }
  }
  onSubmit(): void {
    const { name, quantity, expiryDate } = this.formModel();
    if (!name.trim() || !expiryDate) {
      this._ToastService.show('لازم تكتب اسم المنتج وتاريخ الانتهاء', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('quantity', quantity.toString());
    formData.append('expiryDate', expiryDate);
    const photo = this.selectedPhoto();
    if (photo) {
      formData.append('photo', photo, photo.name);
    }
    console.log('Product FormData:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    this.isSubmitting.set(true);
    this._ProductsService.createProduct(formData).subscribe({
      next: (product: ICreateProductResponse) => {
        console.log('Product created:', product);
        this.createdProductId.set(product.id);
        const voiceBlob = this.recordedVoiceBlob();
        if (voiceBlob) {
          this._ProductsService.uploadVoiceNote(product.id, voiceBlob).subscribe({
            next: (voiceResponse) => {
              console.log('Voice uploaded:', voiceResponse);
              this.finishProductCreation();
            },
            error: (error) => {
              console.error('Voice upload error:', error);
              this.isSubmitting.set(false);
              this._ToastService.show('المنتج اتضاف لكن حصل خطأ في حفظ الصوت', 'error');
            }
          });
        } else {
          this.finishProductCreation();
        }
      },
      error: (error) => {
        console.error('Create product error:', error);
        this.isSubmitting.set(false);
        this._ToastService.show('حصل خطأ أثناء إضافة المنتج', 'error');
      }
    });
  }
  private finishProductCreation(): void {
    this._ToastService.show('تم إضافة المنتج بنجاح', 'success');
    this.formModel.set({ name: '', quantity: 1, expiryDate: '' });
    this.selectedPhoto.set(null);
    this.recordedVoiceBlob.set(null);
    this.createdProductId.set(null);
    this.isSubmitting.set(false);
    this.productAdded.emit();
  }
}