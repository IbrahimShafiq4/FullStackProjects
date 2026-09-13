import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { PropertiesService } from '../../core/services/properties.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  imports: [FormsModule],
  selector: 'app-add-property',
  styles: ``,
  templateUrl: './add-property.html',
})
export class AddProperty {
  private _PropertiesService = inject(PropertiesService);
  private _ToastService = inject(ToastService);
  private _Router = inject(Router);

  isSubmitting = false;

  propertyData = {
    title: '',
    description: '',
    price: 0,
    listingType: 'Sale'
  };

  imageFiles: File[] = [];
  videoFile: File | null = null;

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.imageFiles = Array.from(input.files);
    }
  }

  onVideoSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0];
    }
  }

  async onSubmit() {
    if (!this.propertyData.title || this.propertyData.price <= 0) {
      this._ToastService.show('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    this.isSubmitting = true;

    try {
      const property = await firstValueFrom(
        this._PropertiesService.createProperty(this.propertyData)
      );

      const propertyId = property.id;

      if (this.imageFiles.length > 0) {
        await firstValueFrom(
          this._PropertiesService.uploadImages(propertyId, this.imageFiles)
        );
      }

      if (this.videoFile) {
        await firstValueFrom(
          this._PropertiesService.uploadTourVideo(propertyId, this.videoFile)
        );
      }

      this._PropertiesService.loadProperties();

      this._ToastService.show('تم إضافة العقار بنجاح', 'success');

      this._Router.navigate(['/']);
    } catch (error: any) {
      console.error(error);

      const msg =
        error.error?.message ||
        error.error?.title ||
        error.message ||
        'حدث خطأ أثناء الإضافة';

      this._ToastService.show(msg, 'error');
    } finally {
      this.isSubmitting = false;
    }
  }
}