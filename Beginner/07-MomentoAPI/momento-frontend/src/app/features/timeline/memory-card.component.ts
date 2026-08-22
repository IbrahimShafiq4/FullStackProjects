import { Component, input, output } from '@angular/core';
import { IMemory } from '../../core/Services/memories';
import { RevealOnScroll } from '../../shared/directives/reveal-on-scroll';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-memory-card',
  imports: [RevealOnScroll, DatePipe],
  template: `
    <div appRevealOnScroll class="bg-white rounded-2xl overflow-hidden shadow-md border border-[#E8DFD3]">
      @if(memory().mediaType === 'Image') {
        <img [src]="mediaUrl()" [alt]="memory().title" class="w-full h-56 object-cover">
      } @else {
        <video [src]="mediaUrl()" controls class="w-full h-56 object-cover"></video>
      }

      <div class="p-5">
        <span class="text-xs text-[#C16E4C] font-medium"> {{ memory().memoryDate | date: 'dd MMMM yyyy' }} </span>
        <h3 class="text-lg text-[#3D3226] mt-1"> {{ memory().title }} </h3>
        @if(memory().description) { <p class="text-sm text-[#6B5D4F] mt-2"> {{ memory().description }} </p> }
        <button (click)="onDelete.emit(memory().id)" class="text-xs text-rose-500 hover:underline mt-3">حذف</button>
      </div>
    </div>
  `,
  styles: ``,
})
export class MemoryCardComponent {
  memory = input.required<IMemory>();
  mediaUrl = input.required<string>();
  onDelete = output<number>();
}
