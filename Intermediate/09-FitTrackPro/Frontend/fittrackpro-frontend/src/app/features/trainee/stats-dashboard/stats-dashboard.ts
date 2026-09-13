import {
  Component,
  effect,
  inject,
  input,
  signal
} from '@angular/core';

import { StatsService } from '../../../core/services/stats.service';

@Component({
  selector: 'app-stats-dashboard',
  standalone: true,

  template: `
    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">
            جلسات التدريب
          </p>
          <p class="text-3xl font-bold text-pulse">
            {{ stats()?.sessionsCount ?? 0 }}
          </p>
        </div>
        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">
            إجمالي الوزن المرفوع (كجم)
          </p>
          <p class="text-3xl font-bold text-blue-500">
            {{ stats()?.totalWeight ?? 0 }}
          </p>
        </div>
        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">
            إجمالي التكرارات
          </p>
          <p class="text-3xl font-bold text-green-500">
            {{ stats()?.totalReps ?? 0 }}
          </p>
        </div>
        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">
            إجمالي التمارين المسجلة
          </p>
          <p class="text-3xl font-bold text-amber-500">
            {{ stats()?.totalLogs ?? 0 }}
          </p>
        </div>
      </div>
      @if (stats()?.weeklyData?.length) {
        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700"
        >
          <h3 class="font-semibold text-gray-800 dark:text-white mb-3">
            تقدمك هذا الأسبوع
          </h3>
          <div class="flex items-end gap-2 h-32">
            @for (day of stats()?.weeklyData; track day.date) {
              <div class="flex-1 flex flex-col items-center gap-1">
                <div
                  class="w-full bg-pulse rounded-t-md"
                  [style.height.px]="day.totalWeight / 10"
                ></div>
                <span class="text-xs text-gray-500">
                  {{ formatDate(day.date) }}
                </span>
              </div>
            }
          </div>
        </div>
      }
      @if (recentLogs().length > 0) {
        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700"
        >
          <h3 class="font-semibold text-gray-800 dark:text-white mb-3">
            آخر التمارين
          </h3>
          <div class="space-y-2">
            @for (log of recentLogs(); track log.id) {
              <div
                class="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 text-sm"
              >
                <div>
                  <p class="font-medium text-gray-700 dark:text-gray-300">
                    {{ log.exerciseName }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ log.planName }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ log.reps }} × {{ log.weight }} كجم
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ formatDateTime(log.loggedAt) }}
                  </p>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class StatsDashboard {

  private _StatsService = inject(StatsService);
  refresh = input(0);
  stats = signal<any>(null);
  recentLogs = signal<any[]>([]);

  constructor() {
    effect(() => {
      this.refresh();
      this.loadStats();
    });
  }


  loadStats(): void {
    this._StatsService.getTraineeStats().subscribe({
      next: (data) => {
        this.stats.set(data);
      },
      error: () => {
        this.stats.set(null);
      }
    });
    
    this._StatsService.getRecentLogs().subscribe({
      next: (data) => {
        this.recentLogs.set(data);
      },
      error: () => {
        this.recentLogs.set([]);
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      'ar-EG',
      {
        weekday: 'short'
      }
    );
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      'ar-EG',
      {
        day: 'numeric',
        month: 'short'
      }
    );
  }
}