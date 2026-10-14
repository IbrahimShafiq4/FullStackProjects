import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type TPlatformKey = 'twitter' | 'facebook' | 'instagram' | 'premium';

@Component({
  imports: [NgClass],
  selector: 'app-platform-card-layout',
  styleUrl: './platform-card-layout.scss',
  templateUrl: './platform-card-layout.html',
})
export class PlatformCardLayout {
  platform = input.required<TPlatformKey>();
  isLive = input<boolean>(false);

  cardClass = computed(() => `card-${this.platform()}`);
  gradientClass = computed(() => `gradient-${this.platform()}`);
}