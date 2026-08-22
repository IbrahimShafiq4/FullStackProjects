import { Component, Input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Item } from '../../../models/item.model';

@Component({
  selector: 'app-item-matches',
  imports: [CommonModule],
  templateUrl: './item-matches.html',
  styleUrl: './item-matches.scss',
})
export class ItemMatches {
    @Input({ required: true }) itemId!: number;

  matchConfirmed = output<void>();

  matches = signal<Item[]>([]);
  isLoading = signal<boolean>(false);
  confirmingId = signal<number | null>(null);

  private readonly apiUrl = 'https://localhost:7072/api/items';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.isLoading.set(true);

    this.http.get<Item[]>(`${this.apiUrl}/${this.itemId}/matches`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.matches.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }

  confirmMatch(matchedItemId: number): void {
    this.confirmingId.set(matchedItemId);

    this.http.patch(`${this.apiUrl}/${this.itemId}/match/${matchedItemId}`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.confirmingId.set(null);
          this.matchConfirmed.emit();
        },
        error: () => {
          this.confirmingId.set(null);
        }
      });
  }
}
