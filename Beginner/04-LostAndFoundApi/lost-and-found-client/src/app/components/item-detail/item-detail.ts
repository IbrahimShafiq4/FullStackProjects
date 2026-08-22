import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Item } from '../../../models/item.model';
import { ItemMatches } from '../item-matches/item-matches';
import { SignalRService } from '../../../services/signalr.service';

@Component({
  selector: 'app-item-detail',
  imports: [CommonModule, ItemMatches],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.scss',
})
export class ItemDetail implements OnInit, OnDestroy {
  item = signal<Item | null>(null);
  itemId!: number;

  private readonly apiUrl = 'https://localhost:7072/api/items';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private signalR: SignalRService
  ) { }

  ngOnInit(): void {
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadItem();

    this.signalR.connect();
    this.signalR.joinItem(this.itemId);
    this.signalR.onItemUpdated(() => this.loadItem());
  }

  loadItem(): void {
    this.http.get<Item>(`${this.apiUrl}/${this.itemId}`, { withCredentials: true })
      .subscribe(data => this.item.set(data));
  }

  ngOnDestroy(): void {
    this.signalR.leaveItem(this.itemId);
  }
}