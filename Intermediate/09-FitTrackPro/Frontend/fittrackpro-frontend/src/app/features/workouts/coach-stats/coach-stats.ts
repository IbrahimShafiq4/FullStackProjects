import { Component, inject, OnInit, signal } from '@angular/core';
import { StatsService } from '../../../core/services/stats.service';

@Component({
  selector: 'app-coach-stats',
  standalone: true,
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">الخطط</p>
        <p class="text-3xl font-bold text-pulse">{{ stats()?.planCount ?? 0 }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">المتدربين</p>
        <p class="text-3xl font-bold text-blue-500">{{ stats()?.totalTrainees ?? 0 }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">التمارين</p>
        <p class="text-3xl font-bold text-green-500">{{ stats()?.totalExercises ?? 0 }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">التقييم</p>
        <p class="text-3xl font-bold text-amber-500">{{ stats()?.avgRating?.toFixed(1) ?? 0 }} ★</p>
      </div>
    </div>
  `
})
export class CoachStats implements OnInit {
  private statsService = inject(StatsService);
  stats = signal<any>(null);

  ngOnInit(): void {
    this.statsService.getCoachStats().subscribe({
      next: (data) => this.stats.set(data),
      error: () => this.stats.set(null)
    });
  }
}