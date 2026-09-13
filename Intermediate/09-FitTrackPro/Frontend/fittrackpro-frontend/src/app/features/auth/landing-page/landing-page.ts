import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { RatingService, ICoachRatingDto } from '../../../core/services/rating.service';
import { StatsService } from '../../../core/services/stats.service';
import { WorkoutService } from '../../../core/services/workout.service';

@Component({
  imports: [RouterLink, RevealOnScrollDirective],
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
})
export class LandingPage implements OnInit {
  private _AuthService: AuthService = inject(AuthService);
  private _RatingService: RatingService = inject(RatingService);
  private _StatsService: StatsService = inject(StatsService);
  private _WorkoutService: WorkoutService = inject(WorkoutService);

  currentUser = this._AuthService.currentUser();
  topCoaches = signal<ICoachRatingDto[]>([]);
  globalStats = signal<any>(null);
  recentPlans = signal<any[]>([]);

  ngOnInit(): void {
    this.loadTopCoaches();
    this.loadGlobalStats();
    this.loadRecentPlans();
  }

  loadTopCoaches(): void {
    this._RatingService.getTopCoaches(5).subscribe({
      next: (data) => this.topCoaches.set(data),
      error: () => this.topCoaches.set([])
    });
  }

  loadGlobalStats(): void {
    this._StatsService.getGlobalStats().subscribe({
      next: (data) => this.globalStats.set(data),
      error: () => this.globalStats.set(null)
    });
  }

  loadRecentPlans(): void {
    this._WorkoutService.loadPlans();
    this.recentPlans.set(this._WorkoutService.plans().slice(0, 3));
  }
}