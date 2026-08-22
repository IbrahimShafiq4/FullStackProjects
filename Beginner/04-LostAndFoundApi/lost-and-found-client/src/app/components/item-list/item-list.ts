import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../services/item';
import { CommonModule } from '@angular/common';
import { ItemCard } from '../item-card/item-card';

@Component({
  selector: 'app-item-list',
  imports: [CommonModule, ItemCard],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList implements OnInit {
  constructor(public itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.loadItems();
  }
}
