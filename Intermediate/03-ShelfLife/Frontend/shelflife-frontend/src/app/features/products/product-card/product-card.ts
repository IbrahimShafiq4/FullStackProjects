import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { IProduct } from '../../../core/services/products-service';
import { RevealOnScrollDirective } from "../../../shared/directives/reveal-on-scroll";
import { CommonModule} from '@angular/common';

@Component({
  imports: [RevealOnScrollDirective, CommonModule],
  selector: 'app-product-card',
  styles: ``,
  templateUrl: './product-card.html',
})
export class ProductCard {
  product:  InputSignal<IProduct>       = input.required<IProduct>();
  photoUrl: InputSignal<string | null>  = input.required<string | null>();
  voiceUrl: InputSignal<string | null>  = input.required<string | null>();
  onDelete: OutputEmitterRef<number>    = output<number>();
}
