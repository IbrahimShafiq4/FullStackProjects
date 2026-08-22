import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ItemType } from '../../../models/item.model';

@Component({
  selector: 'app-create-item',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-item.html',
  styleUrl: './create-item.scss',
})
export class CreateItem {
  itemCreated = output<void>();

  title = '';
  description = '';
  category = '';
  location = '';
  type: ItemType = ItemType.Found;
  selectedFile: File | null = null;

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  private readonly apiUrl = 'https://localhost:7072/api/items';

  constructor(private http: HttpClient) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submit(): void {
    if (!this.title.trim()) {
      this.errorMessage.set('العنوان مطلوب');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = new FormData();
    formData.append('Title', this.title);
    formData.append('Description', this.description);
    formData.append('Category', this.category);
    formData.append('Location', this.location);
    formData.append('Type', this.type);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.post(this.apiUrl, formData, { withCredentials: true }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.resetForm();
        this.itemCreated.emit();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message ?? 'حصل خطأ، حاول تاني');
      }
    });
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.category = '';
    this.location = '';
    this.selectedFile = null;
  }
}
