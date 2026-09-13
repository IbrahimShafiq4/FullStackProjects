import { Component, effect, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';

export interface IEditableLineItem {
  description: string;
  unitPrice: number;
  quantity: number;
}

@Component({
  imports: [],
  selector: 'app-line-items-editor',
  templateUrl: './line-items-editor.html',
})
export class LineItemsEditor {
  items: WritableSignal<IEditableLineItem[]> = signal<IEditableLineItem[]>([{ description: '', unitPrice: 0, quantity: 1 }]);
  itemsChanged: OutputEmitterRef<IEditableLineItem[]> = output<IEditableLineItem[]>();

  constructor() {
    this.onEmit();
  }

  onEmit(): void {
    effect(() => this.itemsChanged.emit(this.items()));
  }

  addItem(): void {
    this.items.update((list) => [...list, { description: '', unitPrice: 0, quantity: 1 }]);
  }

  removeItem(index: number): void {
    this.items.update((list) => list.filter((_, i) => i != index));
  }

  updateItem(index: number, field: keyof IEditableLineItem, value: string | number) {
    this.items.update((list) =>
      list.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  getSubtotal(item: IEditableLineItem): number {
    return item.unitPrice * item.quantity;
  }

  getTotalSubtotal(): number {
    return this.items().reduce((sum, item) => sum + this.getSubtotal(item), 0)
  }
}
