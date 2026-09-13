import { Component, ElementRef, inject, OnInit, Signal, viewChild } from '@angular/core';
import { BoardsService } from '../../../core/services/boards.service';
import { ActivatedRoute } from '@angular/router';
import gsap from 'gsap';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-board-analytics',
  templateUrl: './board-analytics.html',
})
export class BoardAnalytics implements OnInit {
  public _boardsService: BoardsService = inject(BoardsService);
  private _ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private statsRef: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>('stats');

  ngOnInit(): void {
    const id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    this._boardsService.loadAnalytics(id);
    setTimeout(() => {
      const cards = this.statsRef()?.nativeElement.children;
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.4,
          ease: 'power1.out'
        });
      }
    }, 100);
  }
}