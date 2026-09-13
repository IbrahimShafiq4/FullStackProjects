import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ItemService } from '../../../services/item';
import { ItemCard } from '../item-card/item-card';
import { SearchBar } from '../search-bar/search-bar';
import { CreateItem } from '../create-item/create-item';
import { Modal } from '../modal/modal/modal';

@Component({
  selector: 'app-item-list',
  imports: [CommonModule, ItemCard, SearchBar, Modal, CreateItem],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList implements OnInit {
  isCreateModalOpen = signal(false);
  constructor(public itemService: ItemService, private router: Router) { }
  ngOnInit(): void { this.itemService.loadItems(); }
  openCreateModal(): void { this.isCreateModalOpen.set(true); }
  closeCreateModal(): void { this.isCreateModalOpen.set(false); }
  onSearch(term: string): void { this.itemService.loadItems(term); }
  onItemCreated(): void { this.closeCreateModal(); this.itemService.loadItems(); }
}