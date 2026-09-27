import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsService, IReview } from '../../../core/services/reviews.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';
import { CaseStrip } from '../../../shared/components/case-strip/case-strip';

@Component({
  imports: [RouterLink, DatePipe, FormsModule, AppShell, CaseStrip],
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.html',
  styleUrl: './my-reviews.css',
})
export class MyReviews implements OnInit {
  public reviews = inject(ReviewsService);
  private _popup = inject(PopupService);
  private _toast = inject(ToastService);

  editing: WritableSignal<IReview | null> = signal(null);
  editRating = signal(5);
  editComment = signal('');
  saving = signal(false);

  ngOnInit(): void { this.reviews.loadMyReviews(); }

  openEdit(r: IReview): void {
    this.editing.set(r);
    this.editRating.set(r.rating);
    this.editComment.set(r.comment);
  }

  closeEdit(): void { this.editing.set(null); }

  setEditRating(v: number): void { this.editRating.set(v); }

  saveEdit(): void {
    const r = this.editing();
    if (!r) return;

    if (this.editRating() < 1 || this.editRating() > 5 || !this.editComment().trim()) {
      this._toast.show('راجع التقييم والتعليق.', 'error');
      return;
    }

    this.saving.set(true);
    this.reviews.updateReview(r.productId, r.id, this.editRating(), this.editComment()).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(null);
        this._toast.show('تم تعديل التقييم.', 'success');
        this.reviews.loadMyReviews();
      },
      error: () => {
        this.saving.set(false);
        this._toast.show('تعذّر التعديل.', 'error');
      },
    });
  }

  async remove(r: IReview): Promise<void> {
    const confirmed = await this._popup.confirm({
      title: 'حذف التقييم',
      message: 'هل تريد حذف هذا التقييم نهائياً؟',
      confirmLabel: 'حذف',
      cancelLabel: 'إلغاء',
      type: 'danger',
    });
    if (!confirmed) return;

    this.reviews.deleteReview(r.productId, r.id).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this.reviews.loadMyReviews();
      },
    });
  }
}