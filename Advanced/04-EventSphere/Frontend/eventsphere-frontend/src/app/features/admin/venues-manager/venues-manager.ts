import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';

interface IVenue {
  id: number;
  name: string;
  address: string;
  totalRows: number;
  seatsPerRow: number;
}

interface IVenueInput {
  name: string;
  address: string;
  totalRows: number;
  seatsPerRow: number;
}

@Component({
  selector: 'app-venues-manager',
  imports: [FormsModule, RouterLink],
  templateUrl: './venues-manager.html',
  styleUrl: './venues-manager.css',
})
export class VenuesManager implements OnInit {
  private _http = inject(HttpClient);
  private _toast = inject(ToastService);
  private _popup = inject(PopupService);
  public auth = inject(AuthService);
  public theme = inject(ThemeService);

  private readonly API = 'https://localhost:7133/api/venues';

  readonly year = new Date().getFullYear();

  items = signal<IVenue[]>([]);
  showForm = signal(false);
  loading = signal(true);
  saving = signal(false);

  form: IVenueInput = this.emptyForm();

  ngOnInit(): void {
    this.load();
  }

  private emptyForm(): IVenueInput {
    return { name: '', address: '', totalRows: 10, seatsPerRow: 12 };
  }

  load(): void {
    this.loading.set(true);
    this._http.get<IVenue[]>(this.API, { withCredentials: true }).subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.form = this.emptyForm();
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  save(): void {
    if (!this.form.name || !this.form.address) {
      this._toast.show('الاسم والعنوان مطلوبان.', 'error');
      return;
    }
    if (this.form.totalRows < 1 || this.form.seatsPerRow < 1) {
      this._toast.show('عدد الصفوف والمقاعد لازم 1 على الأقل.', 'error');
      return;
    }

    this.saving.set(true);
    this._http.post<{ id: number }>(this.API, this.form, { withCredentials: true }).subscribe({
      next: () => {
        this.saving.set(false);
        this._toast.show('تم إضافة المكان.', 'success');
        this.closeForm();
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this._toast.show('تعذّر الحفظ.', 'error');
      },
    });
  }

  async remove(item: IVenue): Promise<void> {
    const ok = await this._popup.confirm({
      title: 'حذف المكان',
      message: `سيتم حذف "${item.name}" وكل الفعاليات المرتبطة به.`,
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

  capacity(v: IVenue): number {
    return v.totalRows * v.seatsPerRow;
  }
}