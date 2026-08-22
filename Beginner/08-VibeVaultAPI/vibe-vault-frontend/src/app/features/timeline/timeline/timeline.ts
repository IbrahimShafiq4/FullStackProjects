import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Toast } from '../../../core/services/toast';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
interface IVibe {
  id: number;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: string;
  tag: string;
  tagEmoji: string;
  capturedAt: string;
}
@Component({
  selector: 'app-timeline',
  imports: [FormsModule, DatePipe],
  templateUrl: './timeline.html',
  styles: ``,
})
export class Timeline {
  private http = inject(HttpClient);
  private toast = inject(Toast);
  private readonly API_URL = 'https://localhost:7292/api/vibes';
  SERVER_BASE = 'https://localhost:7292'

  vibes = signal<IVibe[]>([]);
  selectedTag = signal<string | null>(null);
  isLoading = signal(false);

  // نموذج الإضافة
  newVibe = {
    title: '',
    description: '',
    capturedAt: new Date().toISOString().slice(0, 10),
    tag: 'Cozy',
    file: null as File | null
  };

  tags = [
    { value: 'Cozy', emoji: '🌿' },
    { value: 'Chaotic', emoji: '🔥' },
    { value: 'Nostalgic', emoji: '🌌' },
    { value: 'Futuristic', emoji: '🚀' },
    { value: 'Calm', emoji: '🌊' },
    { value: 'MindBlown', emoji: '🤯' }
  ];

  ngOnInit() { this.loadVibes(); }

  loadVibes(tag?: string) {
    this.isLoading.set(true);
    const url = tag ? `${this.API_URL}?tag=${tag}` : this.API_URL;
    this.http.get<IVibe[]>(url).subscribe({
      next: (data) => { this.vibes.set(data); this.isLoading.set(false); },
      error: () => { this.toast.show('فشل تحميل الـ Vibes', 'error'); this.isLoading.set(false); }
    });
  }

  filterByTag(tag: string | null) {
    this.selectedTag.set(tag);
    this.loadVibes(tag ?? undefined);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.newVibe.file = file;
  }

  createVibe() {
    if (!this.newVibe.file) {
      this.toast.show('اختر صورة أو فيديو', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('Title', this.newVibe.title);
    formData.append('Description', this.newVibe.description || '');
    formData.append('CapturedAt', new Date(this.newVibe.capturedAt).toISOString());
    formData.append('Tag', this.newVibe.tag);
    formData.append('file', this.newVibe.file);

    this.http.post(this.API_URL, formData).subscribe({
      next: () => {
        this.toast.show('تم إضافة الـ Vibe بنجاح ✨', 'success');
        this.newVibe = { title: '', description: '', capturedAt: new Date().toISOString().slice(0, 10), tag: 'Cozy', file: null };
        this.loadVibes(this.selectedTag() ?? undefined);
        // reset file input
        const input = document.getElementById('fileInput') as HTMLInputElement;
        if (input) input.value = '';
      },
      error: (err) => this.toast.show(err.error || 'فشل الرفع', 'error')
    });
  }

  deleteVibe(id: number) {
    if (!confirm('تحذف الـ Vibe دي؟')) return;
    this.http.delete(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        this.toast.show('تم الحذف', 'info');
        this.vibes.update(list => list.filter(v => v.id !== id));
      },
      error: () => this.toast.show('فشل الحذف', 'error')
    });
  }
}
