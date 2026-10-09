import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Station {
  code: string;
  label: string;
  active?: boolean;
  current?: boolean;
}

@Component({
  selector: 'app-route-line',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-line.html',
  styleUrl: './route-line.css',
})
export class RouteLine {
  @Input() stations: Station[] = [];
  @Input() orientation: 'h' | 'v' = 'h';
  @Input() animated = true;
}