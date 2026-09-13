import { Component, inject } from '@angular/core';
import { BoardsService } from '../../../core/services/boards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  imports: [],
  selector: 'app-board-delete-confirm',
  templateUrl: './board-delete-confirm.html',
})
export class BoardDeleteConfirm {
  private _BoardsService: BoardsService = inject(BoardsService);
  private _Router: Router = inject(Router);
  private _ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _ToastService: ToastService = inject(ToastService);

  onConfirmDelete(): void {
    const id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    this._BoardsService.deleteBoard(id).subscribe({
      next: () => {
        this._ToastService.show('تم حذف اللوحة نهائيا', 'success');
        this._Router.navigate(['/boards']);
      },
      error: () => this._ToastService.show('حصل خطأ أثناء الحذف', 'error'),
    });
  }
}