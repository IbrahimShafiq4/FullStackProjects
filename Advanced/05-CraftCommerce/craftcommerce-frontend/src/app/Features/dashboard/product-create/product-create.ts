import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AppShell } from '../../../shared/components/app-shell/app-shell';

@Component({
  imports: [FormsModule, RouterLink, AppShell],
  selector: 'app-product-create',
  templateUrl: './product-create.html',
  styleUrl: './product-create.css',
})
export class ProductCreate implements OnInit {
  private _products = inject(ProductsService);
  public categories = inject(CategoriesService);
  private _toast = inject(ToastService);
  private _router = inject(Router);

  name = signal('');
  description = signal('');
  price = signal<number | null>(null);
  stock = signal<number | null>(null);
  categoryId = signal<number | null>(null);

  files: WritableSignal<File[]> = signal([]);
  previews: WritableSignal<string[]> = signal([]);
  saving = signal(false);

  ngOnInit(): void { this.categories.loadCategories(); }

  onFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const list = Array.from(input.files ?? []);
    const valid = list.filter((f) => /\.(jpg|jpeg|png)$/i.test(f.name) && f.size <= 5 * 1024 * 1024);
    if (valid.length !== list.length) {
      this._toast.show('بعض الصور مرفوضة (jpg/png وأقل من 5MB).', 'error');
    }
    this.files.set(valid);
    this.previews.set(valid.map((f) => URL.createObjectURL(f)));
  }

  removeFile(i: number): void {
    const files = [...this.files()]; files.splice(i, 1);
    const previews = [...this.previews()]; previews.splice(i, 1);
    this.files.set(files);
    this.previews.set(previews);
  }

  submit(): void {
    if (!this.name() || !this.description() || !this.price() || !this.stock() || !this.categoryId()) {
      this._toast.show('املأ كل الحقول الأساسية.', 'error');
      return;
    }
    if (this.files().length === 0) {
      this._toast.show('ضيف صورة واحدة على الأقل.', 'error');
      return;
    }

    const fd = new FormData();
    fd.append('name', this.name());
    fd.append('description', this.description());
    fd.append('price', this.price()!.toString());
    fd.append('stockQuantity', this.stock()!.toString());
    fd.append('categoryId', this.categoryId()!.toString());
    this.files().forEach((f) => fd.append('images', f));

    this.saving.set(true);
    this._products.createProduct(fd).subscribe({
      next: (res) => {
        this.saving.set(false);
        this._toast.show(res.message, 'success');
        this._router.navigate(['/dashboard/products']);
      },
      error: (err) => {
        this.saving.set(false);
        this._toast.show(typeof err.error === 'string' ? err.error : 'تعذّر إنشاء المنتج.', 'error');
      },
    });
  }
}