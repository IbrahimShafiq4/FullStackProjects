import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BoardsService } from '../../../core/services/boards.service';
import { ToastService } from '../../../shared/services/toast.service';
import { RouterLink } from "@angular/router";

@Component({
  imports: [RouterLink],
  selector: 'app-board-list',
  templateUrl: './board-list.html',
})
export class BoardList implements OnInit {
  _BoardsService: BoardsService = inject(BoardsService);
  private _ToastService: ToastService = inject(ToastService);
  newTitle: WritableSignal<string> = signal('');

  ngOnInit() { this._BoardsService.loadBoards(); }

  onCreate() {
    if (!this.newTitle().trim()) return;
    this._BoardsService.createBoard(this.newTitle()).subscribe({
      next: () => {
        this._ToastService.show('تم إنشاء اللوحة', 'success');
        this.newTitle.set('');
        this._BoardsService.loadBoards();
      }
    });
  }
}