import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import {
  LandingService,
  ILandingStats,
  IFeaturedEvent,
  ITestimonial,
  IPricingRule,
} from '../../core/services/landing.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, DatePipe],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingPage implements OnInit, OnDestroy {
  public auth = inject(AuthService);
  public theme = inject(ThemeService);
  public landing = inject(LandingService);

  readonly year = new Date().getFullYear();
  readonly issue = '01';
  readonly today = new Date();

  stats = signal<ILandingStats | null>(null);
  featuredEvents = signal<IFeaturedEvent[]>([]);
  testimonials = signal<ITestimonial[]>([]);
  pricingRules = signal<IPricingRule[]>([]);

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.landing.getStats().subscribe({ next: (s) => this.stats.set(s) });
    this.landing.getFeaturedEvents(6).subscribe({ next: (e) => this.featuredEvents.set(e) });
    this.landing.getTestimonials(6).subscribe({ next: (t) => this.testimonials.set(t) });
    this.landing.getPricingRules().subscribe({ next: (r) => this.pricingRules.set(r) });
    this.setupRevealObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupRevealObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => this.observer?.observe(el));
    }, 200);
  }

  occupiedPercent(event: IFeaturedEvent): number {
    if (event.totalSeats === 0) return 0;
    return Math.min(100, Math.round((event.bookedSeats / event.totalSeats) * 100));
  }

  formatRevenue(value: number): string {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
    return value.toString();
  }

  starsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}