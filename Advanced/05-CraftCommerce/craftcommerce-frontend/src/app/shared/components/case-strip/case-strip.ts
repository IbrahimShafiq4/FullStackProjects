import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

export type TBay = 'cpu' | 'ram' | 'gpu' | 'nvme' | 'psu' | 'io' | 'chipset' | 'cooling';

@Component({
  imports: [UpperCasePipe],
  selector: 'app-case-strip',
  templateUrl: './case-strip.html',
  styleUrl: './case-strip.css',
})
export class CaseStrip {
  @Input() bay: TBay = 'cpu';
  @Input() label = '';
  @Input() hint  = '';
}