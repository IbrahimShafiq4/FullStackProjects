import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoardsService } from '../../../core/services/boards.service';
import { ToastService } from '../../../shared/services/toast.service';
import { PopupService } from '../../../shared/services/popup.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-board-delete',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="min-h-screen bg-surface-muted px-4 py-10">
      <div class="max-w-md mx-auto">
        @if (board(); as board) {
          <div class="bg-white rounded-lg p-6 flex flex-col items-center shadow-apple-lg border border-surface-border">
            <div class="flex items-center gap-2 text-rose-600 mb-3">
              <span class="text-xl">⚠️</span>
              <h1 class="text-xl font-bold">حذف اللوحة</h1>
            </div>
            <p class="text-gray-700">هل أنت متأكد من رغبتك في حذف اللوحة <strong>"{{ board.title }}"</strong>؟</p>
            <p class="text-sm text-gray-500 mt-3" dir="rtl">تم الإنشاء: {{ board.createdAt | date:'medium' }}</p>
            <p class="text-sm text-gray-500">عدد البطاقات: {{ board.cardsCount }}</p>
            <div class="flex gap-3 mt-6 w-full">
              <button (click)="onConfirmDelete()" class="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-apple">نعم، احذف</button>
              <a [routerLink]="['/boards', board.id, 'details']" class="flex-1 bg-surface-muted hover:bg-surface-border text-gray-700 font-medium py-2.5 rounded-lg text-center transition-colors">إلغاء</a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class BoardDelete implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boardsService = inject(BoardsService);
  private toast = inject(ToastService);
  private popup = inject(PopupService);

  board = this.boardsService.currentBoard;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.boardsService.getBoard(id).subscribe({
      next: (data) => this.boardsService.currentBoard.set(data),
      error: () => this.toast.show('حدث خطأ أثناء تحميل بيانات اللوحة', 'error')
    });
  }

  async onConfirmDelete() {
    const id = this.board()?.id;
    if (!id) return;
    const confirmed = await this.popup.confirm({
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد تماماً من حذف هذه اللوحة؟ لا يمكن التراجع عن هذا الإجراء.',
      type: 'danger'
    });
    if (confirmed) {
      this.boardsService.deleteBoard(id).subscribe({
        next: () => {
          this.toast.show('تم حذف اللوحة بنجاح', 'success');
          this.router.navigate(['/boards']);
        },
        error: () => this.toast.show('فشل الحذف، حاول مرة أخرى', 'error')
      });
    }
  }
}