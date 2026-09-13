import { Component, OnDestroy, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnInit, OnDestroy {
  searchTerm = '';
  searchChanged = output<string>();
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => this.searchChanged.emit(value));
  }
  onInputChange(value: string): void { this.searchSubject.next(value); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}