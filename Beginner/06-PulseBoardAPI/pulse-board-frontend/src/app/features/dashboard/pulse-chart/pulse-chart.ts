import { Component, computed, input } from '@angular/core';

interface IChartData {
  labels: string[];
  moodData: number[];
  focusData: number[];
}

@Component({
  selector: 'app-pulse-chart',
  standalone: true,
  imports: [],
  templateUrl: './pulse-chart.html',
  styleUrl: './pulse-chart.scss',
})
export class PulseChart {

  // البيانات اللي جاية من الـ Parent
  data = input<IChartData | null>(null);

  // حجم الـ SVG
  readonly width = 600;
  readonly height = 200;

  // Padding عشان الـ chart ميبقاش لازق في الأطراف
  readonly paddingX = 20;
  readonly paddingY = 20;

  /**
   * عدد النقاط الموجودة في الـ chart
   */
  pointsCount = computed(() => {
    const data = this.data();

    if (!data) {
      return 0;
    }

    return Math.max(
      data.labels.length,
      data.moodData.length,
      data.focusData.length
    );
  });

  /**
   * Mood Line
   */
  moodPath = computed(() => {
    const data = this.data();

    if (!data || data.moodData.length === 0) {
      return '';
    }

    return this.buildPath(data.moodData);
  });

  /**
   * Focus Line
   */
  focusPath = computed(() => {
    const data = this.data();

    if (!data || data.focusData.length === 0) {
      return '';
    }

    return this.buildPath(data.focusData);
  });

  /**
   * Mood Points
   *
   * بنستخدمها عشان لو عندنا نقطة واحدة
   * نظهرها كـ circle بدل ما تختفي.
   */
  moodPoints = computed(() => {
    const data = this.data();

    if (!data || data.moodData.length === 0) {
      return [];
    }

    return this.buildPoints(data.moodData);
  });

  /**
   * Focus Points
   */
  focusPoints = computed(() => {
    const data = this.data();

    if (!data || data.focusData.length === 0) {
      return [];
    }

    return this.buildPoints(data.focusData);
  });

  /**
   * بناء الـ SVG Path
   */
  private buildPath(values: number[]): string {

    if (values.length === 0) {
      return '';
    }

    // لو عندنا نقطة واحدة
    if (values.length === 1) {

      const x = this.width / 2;

      const y = this.getY(values[0]);

      return `M ${x},${y}`;
    }

    const availableWidth =
      this.width - this.paddingX * 2;

    const stepX =
      availableWidth / (values.length - 1);

    return values
      .map((value, index) => {

        const x =
          this.paddingX + index * stepX;

        const y =
          this.getY(value);

        return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
      })
      .join(' ');
  }

  /**
   * تحويل القيمة من 0 - 10
   * إلى Y coordinate داخل الـ SVG
   */
  private getY(value: number): number {

    // نضمن إن القيمة بين 0 و 10
    const normalizedValue =
      Math.max(0, Math.min(value, 10));

    const availableHeight =
      this.height - this.paddingY * 2;

    return (
      this.height -
      this.paddingY -
      (normalizedValue / 10) * availableHeight
    );
  }

  /**
   * بناء الـ points
   */
  private buildPoints(values: number[]) {

    if (values.length === 0) {
      return [];
    }

    // لو نقطة واحدة نحطها في النص
    if (values.length === 1) {

      return [
        {
          x: this.width / 2,
          y: this.getY(values[0]),
          value: values[0],
        },
      ];
    }

    const availableWidth =
      this.width - this.paddingX * 2;

    const stepX =
      availableWidth / (values.length - 1);

    return values.map((value, index) => {

      const x =
        this.paddingX + index * stepX;

      const y =
        this.getY(value);

      return {
        x,
        y,
        value,
      };
    });
  }
}