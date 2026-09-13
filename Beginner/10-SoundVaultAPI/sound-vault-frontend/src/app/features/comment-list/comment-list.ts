import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { Sounds, IComment } from '../../core/services/sounds';
import { Toast } from '../../core/services/toast';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="bg-[var(--bg-secondary)] p-4 rounded-[var(--radius)] border border-[var(--border-color)]">
      <h4 class="font-semibold mb-3">التعليقات ({{ comments().length }})</h4>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        @for (c of comments(); track c.id) {
          <div class="border-b border-[var(--border-color)] pb-2">
            <span class="font-medium">{{ c.userName }}</span>
            <p class="text-sm text-[var(--text-secondary)]">{{ c.content }}</p>
            <span class="text-xs text-[var(--text-muted)]">{{ c.createdAt | date:'short' }}</span>
          </div>
        } @empty {
          <p class="text-[var(--text-muted)] text-sm">لا توجد تعليقات</p>
        }
      </div>
      <div class="mt-3 flex gap-2">
        <input [(ngModel)]="newComment" placeholder="أضف تعليقاً..." class="flex-1 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius)] px-3 py-1.5 text-sm" />
        <button (click)="addComment()" class="bg-[var(--accent)] text-white px-4 py-1.5 rounded-[var(--radius)] text-sm">نشر</button>
      </div>
    </div>
  `
})
export class CommentList {
  private _Sounds = inject(Sounds);
  private _Toast = inject(Toast);
  soundId = input.required<number>();
  comments: WritableSignal<IComment[]> = signal([]);
  newComment = '';

  ngOnInit() { this.loadComments(); }

  loadComments() {
    this._Sounds.getComments(this.soundId()).subscribe({
      next: res => this.comments.set(res)
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this._Sounds.addComment(this.soundId(), this.newComment).subscribe({
      next: () => { this.newComment = ''; this.loadComments(); this._Toast.show('تم إضافة التعليق', 'success'); },
      error: () => this._Toast.show('فشل الإضافة', 'error')
    });
  }
}