import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { IProperty, PropertiesService } from '../../../core/services/properties.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-property-card',
  templateUrl: './property-card.html',
})
export class PropertyCard {
  private _PropertiesService = inject(PropertiesService);
  private _ToastService = inject(ToastService);
  private _Router = inject(Router);

  property = input.required<IProperty>();
  activeImageIndex = signal<number>(0);
  scheduledDate = signal<string>('');
  viewingId = signal<number | null>(null);

  nextImage(): void {
    const total = this.property().images.length;
    this.activeImageIndex.update((i: number) => (i + 1) % total);
  }

  prevImage(): void {
    const total = this.property().images.length;
    this.activeImageIndex.update((i: number) => (i - 1 + total) % total);
  }

  getCurrentImageUrl(): string | null {
    const images = this.property().images;
    if (images.length === 0) return null;
    return this._PropertiesService.getFullUrl(images[this.activeImageIndex()].url);
  }

  onSchedule() {
    if (!this.scheduledDate()) {
      this._ToastService.show('اختر موعد المعاينة الأول', 'error');
      return;
    }

    this._PropertiesService.scheduleViewing(this.property().id, this.scheduledDate()).subscribe({
      next: (response: any) => {
        this._ToastService.show('تم حجز موعد المعاينة بنجاح', 'success');
        this.viewingId.set(response.viewingId);
      },
      error: (err) => this._ToastService.show(err.error ?? 'حصل خطأ', 'error')
    });
  }

  goToVideoCall() {
    if (this.viewingId()) {
      this._Router.navigate(['/video-call', this.viewingId()]);
    }
  }

  getFullVideo(): string {
    return this._PropertiesService.getFullUrl(`${this.property().tourVideoUrl}`);
  }
}