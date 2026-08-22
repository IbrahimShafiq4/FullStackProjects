import { Component, computed, input } from '@angular/core';

interface IChartData {
  labels: string[];
  moodData: number[];
  focusData: number[];
}

@Component({
  selector: 'app-pulse-chart',
  imports: [],
  templateUrl: './pulse-chart.html',
  styleUrl: './pulse-chart.scss',
})
export class PulseChart {

  data = input<IChartData | null>(null);

  private readonly width = 600;
  private readonly height = 200;

  moodPath = computed(() => {
    const data = this.data();

    if (!data) {
      return '';
    }

    return this.buildPath(data.moodData);
  });

  focusPath = computed(() => {
    const data = this.data();

    if (!data) {
      return '';
    }

    return this.buildPath(data.focusData);
  });

  private buildPath(values: number[]): string {

    if (values.length === 0) {
      return '';
    }

    const stepX = this.width / (values.length - 1 || 1);

    return values
      .map((value, i) => {

        const x = i * stepX;

        const y =
          this.height -
          (value / 10) * this.height;

        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
      })
      .join(' ');
  }
}