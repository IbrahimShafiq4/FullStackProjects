import { Component, inject, OnInit } from '@angular/core';
import { Memories } from '../../core/Services/memories';
import { Toast } from '../../core/Services/toast';
import { HttpErrorResponse } from '@angular/common/http';
import { MemoryUploadFormComponent } from './memory-upload-form.component';
import { MemoryCardComponent } from './memory-card.component';

@Component({
  selector: 'app-timeline',
  imports: [MemoryUploadFormComponent, MemoryCardComponent],
  template: ` 
  <div class="min-h-screen bg-[#FAF7F2] px-6 py-10">
    <div class="max-w-2xl mx-auto space-y-8">

      <h1 class="text-4xl text-[#3D3226] text-center" style="font-family: 'Playfair Display', serif">
        ذكرياتي
      </h1>

      <app-memory-upload-form (memorySaved)="_Memory.loadMemories()" />

      <div class="relative border-r-2 border-[#E8DFD3] p-5 space-y-8">
        <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3">
        @for (memory of _Memory.memories(); track memory.id) {
            <app-memory-card
              [memory]="memory"
              [mediaUrl]="_Memory.getFullMediaUrl(memory.mediaUrl)"
              (onDelete)="onDelete($event)" />
        } @empty {
          <p class="text-[#6B5D4F] text-center py-10">لسه مفيش ذكريات مسجلة</p>
        }
      </div>
      </div>
    </div>
  </div>
  `,
  styles: ``,
})
export class TimelineComponent implements OnInit {
  _Memory: Memories = inject(Memories);
  _Toast: Toast = inject(Toast);

  ngOnInit() {
    this._Memory.loadMemories();
  }

  onDelete(id: number): void {
    this._Memory.deleteMemory(id).subscribe({
      next: (res: { message: string }) => {
        this._Toast.show(res.message, 'success');
        this._Memory.loadMemories();
      },
      error: (error: HttpErrorResponse) => { this._Toast.show("حصل خطأ اثناء الحذف", 'error'); }
    })
  }
}
