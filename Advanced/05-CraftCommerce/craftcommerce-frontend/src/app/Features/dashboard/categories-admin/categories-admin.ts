import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriesService, ICategory } from '../../../core/services/categories.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';

@Component({
  imports: [FormsModule, RouterLink, AppShell],
  selector: 'app-categories-admin',
  templateUrl: './categories-admin.html',
  styleUrl: './categories-admin.css',
})
export class CategoriesAdmin implements OnInit {
  public categories = inject(CategoriesService);
  private _popup = inject(PopupService);
  private _toast = inject(ToastService);

  editing: WritableSignal<ICategory | null> = signal(null);
  newName = signal('');
  editName = signal('');
  saving = signal(false);

  ngOnInit(): void { this.categories.loadCategories(); }

  create(): void {
    if (!this.newName().trim()) {
      this._toast.show('اكتب اسم الفئة.', 'error');
      return;
    }
    this.saving.set(true);
    this.categories.createCategory(this.newName()).subscribe({
      next: () => {
        this.saving.set(false);
        this.newName.set('');
        this._toast.show('تم إضافة الفئة.', 'success');
        this.categories.loadCategories();
      },
      error: () => {
        this.saving.set(false);
        this._toast.show('تعذّر الإضافة.', 'error');
      },
    });
  }

  openEdit(c: ICategory): void {
    this.editing.set(c);
    this.editName.set(c.name);
  }

  saveEdit(): void {
    const c = this.editing();
    if (!c) return;
    if (!this.editName().trim()) {
      this._toast.show('اكتب اسم الفئة.', 'error');
      return;
    }
    this.saving.set(true);
    this.categories.updateCategory(c.id, this.editName()).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.editing.set(null);
        this._toast.show(res.message, 'success');
        this.categories.loadCategories();
      },
      error: () => {
        this.saving.set(false);
        this._toast.show('تعذّر التعديل.', 'error');
      },
    });
  }

  async remove(c: ICategory): Promise<void> {
    const ok = await this._popup.confirm({
      title: 'حذف الفئة',
      message: `هتشيل "${c.name}" نهائياً.`,
      confirmLabel: 'حذف',
      cancelLabel: 'إلغاء',
      type: 'danger',
    });
    if (!ok) return;

    this.categories.deleteCategory(c.id).subscribe({
      next: (res) => {
        this._toast.show(res.message, 'success');
        this.categories.loadCategories();
      },
    });
  }

  cancel(): void { this.editing.set(null); }
}