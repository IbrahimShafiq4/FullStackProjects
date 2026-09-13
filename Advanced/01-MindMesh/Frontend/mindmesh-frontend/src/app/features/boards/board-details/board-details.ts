import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BoardsService } from '../../../core/services/boards.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-board-details',
  templateUrl: './board-details.html',
})
export class BoardDetails implements OnInit {
  private _BoardsService: BoardsService = inject(BoardsService);
  private _ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
  board: WritableSignal<any> = signal(null);

  ngOnInit(): void {
    const id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    this._BoardsService.getBoard(id).subscribe({
      next: (board) => this.board.set(board),
    });
  }
}