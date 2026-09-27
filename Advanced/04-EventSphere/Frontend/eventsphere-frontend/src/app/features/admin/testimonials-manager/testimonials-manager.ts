import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';

interface ITestimonial {
  id: number;
  name: string;
  role: string;
  city: string;
  message: string;
  hieroglyph: string;
  rating: number;
  isPublished: boolean;
  createdAt: string;
}

interface ITestimonialInput {
  name: string;
  role: string;
  city: string;
  message: string;
  hieroglyph: string;
  rating: number;
  isPublished: boolean;
}

@Component({
  selector: 'app-testimonials-manager',
  imports: [FormsModule, RouterLink],
  templateUrl: './testimonials-manager.html',
  styleUrl: './testimonials-manager.css',
})
export class TestimonialsManager implements OnInit {
  private _http = inject(HttpClient);
  private _toast = inject(ToastService);
  private _popup = inject(PopupService);
  public auth = inject(AuthService);
  public theme = inject(ThemeService);

  private readonly API = 'https://localhost:7133/api/testimonials';

  readonly year = new Date().getFullYear();

  items = signal<ITestimonial[]>([]);
  editingId = signal<number | null>(null);
  showForm = signal(false);
  loading = signal(true);
  saving = signal(false);

  form: ITestimonialInput = this.emptyForm();

  ngOnInit(): void {
    this.load();
  }

  private emptyForm(): ITestimonialInput {
    return {
      name: '',
      role: '',
      city: '',
      message: '',
      hieroglyph: '𓂀',
      rating: 5,
      isPublished: true,
    };
  }

  load(): void {
    this.loading.set(true);
    this._http
      .get<ITestimonial[]>(`${this.API}?onlyPublished=false`, { withCredentials: true })
      .subscribe({
        next: (d) => {
          this.items.set(d);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  openCreate(): void {
    this.form = this.emptyForm();
    this.editingId.set(null);
    this.showForm.set(true);
  }

  openEdit(item: ITestimonial): void {
    this.form = {
      name: item.name,
      role: item.role,
      city: item.city,
      message: item.message,
      hieroglyph: item.hieroglyph,
      rating: item.rating,
      isPublished: item.isPublished,
    };
    this.editingId.set(item.id);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  save(): void {
    if (!this.form.name || !this.form.message) {
      this._toast.show('الاسم والرسالة مطلوبان.', 'error');
      return;
    }

    this.saving.set(true);
    const id = this.editingId();

    const req = id
      ? this._http.put<ITestimonial>(`${this.API}/${id}`, this.form, { withCredentials: true })
      : this._http.post<ITestimonial>(this.API, this.form, { withCredentials: true });

    req.subscribe({
      next: () => {
        this.saving.set(false);
        this._toast.show(id ? 'تم تعديل الرأي.' : 'تم إضافة الرأي.', 'success');
        this.closeForm();
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this._toast.show('تعذّر الحفظ.', 'error');
      },
    });
  }

  async remove(item: ITestimonial): Promise<void> {
    const ok = await this._popup.confirm({
      title: 'حذف الرأي',
      message: `سيتم حذف رأي "${item.name}" نهائياً.`,
      confirmLabel: 'حذف',
      cancelLabel: 'إلغاء',
    });
    if (!ok) return;

    this._http.delete(`${this.API}/${item.id}`, { withCredentials: true }).subscribe({
      next: () => {
        this._toast.show('تم الحذف.', 'success');
        this.load();
      },
      error: () => this._toast.show('تعذّر الحذف.', 'error'),
    });
  }
}