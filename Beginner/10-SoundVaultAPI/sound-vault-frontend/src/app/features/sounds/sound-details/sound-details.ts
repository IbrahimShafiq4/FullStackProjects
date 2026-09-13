import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Sounds, ISound, IComment } from '../../../core/services/sounds';
import { Toast } from '../../../core/services/toast';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sound-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './sound-details.html',
})
export class SoundDetail implements OnInit {
  private _ActivatedRoute = inject(ActivatedRoute);
  private _Sounds = inject(Sounds);
  private _Toast = inject(Toast);
  sound: WritableSignal<ISound | null> = signal(null);
  comments: WritableSignal<IComment[]> = signal([]);
  newComment = '';
  soundId = 0;

  ngOnInit() {
    this.soundId = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    if (this.soundId) {
      this.loadSound();
      this.loadComments();
    }
  }

  loadSound() {
    this._Sounds.getById(this.soundId).subscribe({
      next: (s) => this.sound.set(s),
      error: () => this._Toast.show('تعذر تحميل الصوت', 'error')
    });
  }

  loadComments() {
    this._Sounds.getComments(this.soundId).subscribe({
      next: (c) => this.comments.set(c),
      error: () => this._Toast.show('تعذر تحميل التعليقات', 'error')
    });
  }

  addComment() {
    if (!this.newComment.trim()) {
      this._Toast.show('الرجاء كتابة تعليق', 'error');
      return;
    }
    this._Sounds.addComment(this.soundId, this.newComment).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments();
        this._Toast.show('تم إضافة التعليق', 'success');
      },
      error: () => this._Toast.show('فشل إضافة التعليق', 'error')
    });
  }

  deleteComment(commentId: number) {
    if (!confirm('هل أنت متأكد من حذف التعليق؟')) return;
    this._Sounds.deleteComment(commentId).subscribe({
      next: () => {
        this.loadComments();
        this._Toast.show('تم حذف التعليق', 'success');
      },
      error: () => this._Toast.show('فشل الحذف', 'error')
    });
  }

  toggleLike() {
    this._Sounds.toggleLike(this.soundId).subscribe({
      next: () => this.loadSound(),
      error: () => this._Toast.show('حدث خطأ', 'error')
    });
  }

  getFullMediaUrl(url: string) {
    return this._Sounds.getFullMediaUrl(url);
  }
}