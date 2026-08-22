import { Component, inject, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IMemory, Memories } from '../../core/Services/memories';
import { Toast } from '../../core/Services/toast';
import { form, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-memory-upload-form',
  imports: [FormsModule, FormField],
  template: `
    <form (ngSubmit)="onSubmit()"
      class="bg-white rounded-2xl p-6 shadow-md border border-[#E8DFD3] space-y-4"
    >
      <h2>ذكرى جديدة</h2>

      <input [formField]="memoryForm.title" type="text" placeholder="عنوان الذكرى" 
        class="w-full border border-[#E8DFD3] rounded-lg px-4 py-2.5 text-[#3D3226] focus:outline-none focus:ring-2 focus:ring-[#C16E4C] transition" />

      <textarea [formField]="memoryForm.description" rows="2" placeholder="احكيلي عنها..."
            class="w-full border border-[#E8DFD3] rounded-lg px-4 py-2.5 text-[#3D3226]
                  focus:outline-none focus:ring-2 focus:ring-[#C16E4C] transition"></textarea>

      <input [formField]="memoryForm.memoryDate" type="date" 
        class="w-full border border-[#E8DFD3] rounded-lg px-4 py-2.5 text-[#3D3226] focus:outline-none focus:ring-2 focus:ring-[#C16E4C] transition" />

      <input type="file" accept=".jpg,.jpeg,.png,.mp4,.webm" (change)="onFileSelected($event)" 
        class="w-full text-sm text-[#3D3226]" />

        <button type="submit" [disabled]="isSubmitting()"
          class="w-full bg-[#C16E4C] text-white py-3 rounded-lg font-medium
                  hover:bg-[#A85B3D] transition disabled:opacity-50">
          {{ isSubmitting() ? 'جاري الرفع...' : 'حفظ الذكرى' }}
        </button>
    </form>
  `,
  styles: ``,
})
export class MemoryUploadFormComponent {
  private _Memory: Memories = inject(Memories);
  private _Toast: Toast = inject(Toast);

  memorySaved = output<void>();

  formModel: WritableSignal<{ title: string; description: string; memoryDate: string; }> = signal({ title: '', description: '', memoryDate: '' });
  memoryForm = form(this.formModel, () => { })

  selectedFile: WritableSignal<File | null> = signal<File | null>(null);
  isSubmitting: WritableSignal<boolean> = signal<boolean>(false)

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null);
  }

  onSubmit() {
    const { title, description, memoryDate } = this.formModel();
    const file = this.selectedFile();

    if (!title.trim() || !file) {
      this._Toast.show("لازم تكتب عنوان وتختار ملف", 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('memoryDate', memoryDate || new Date().toISOString());
    formData.append('file', file);

    this.isSubmitting.set(true);

    this._Memory.addMemory(formData).subscribe({
      next: (res: IMemory) => {
        this._Toast.show(`تمت إضافة الذكرى ${title} بنجاح`, 'success');
        this.formModel.set({ title: '', description: '', memoryDate: '' });
        this.selectedFile.set(null);
        this.isSubmitting.set(false);
        this.memorySaved.emit();
      },
      error: (error: HttpErrorResponse) => {
        this._Toast.show(error.error ?? "حصل خطأ اثناء الرفع", 'error');
        this.isSubmitting.set(false);
      }
    })
  }
}
