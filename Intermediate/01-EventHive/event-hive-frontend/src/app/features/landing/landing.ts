import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { IEvent } from '../../core/services/event';
import { LandingService, ILandingStats, ITestimonial, ICategory } from '../../core/services/landing.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-landing',
  styleUrl: './landing.scss',
  templateUrl: './landing.html',
})
export class Landing implements OnInit, OnDestroy {
    private readonly _landing = inject(LandingService);
    readonly auth = inject(AuthService);

    readonly year = new Date().getFullYear();

  stats = signal<ILandingStats | null>(null);
  featured = signal<IEvent[]>([]);
  testimonials = signal<ITestimonial[]>([]);
  categories = signal<ICategory[]>([]);

  animatedStats = signal({
    totalEvents: 0,
    totalAttendees: 0,
    totalOrganizers: 0,
    totalCities: 0,
    upcomingEvents: 0,
    totalRsvps: 0
  });

    private observer ?: IntersectionObserver;

  ngOnInit(): void {
    this._landing.getStats().subscribe(s => {
      this.stats.set(s);
      setTimeout(() => this.animateCountUp(s), 300);
    });

    this._landing.getFeatured(6).subscribe(f => this.featured.set(f));
    this._landing.getTestimonials().subscribe(t => this.testimonials.set(t));
    this._landing.getCategories().subscribe(c => this.categories.set(c));

    this.setupScrollReveal();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

    private setupScrollReveal(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    setTimeout(() => {
    document
      .querySelectorAll('[data-reveal]')
      .forEach((el) => this.observer?.observe(el));
  }, 400);
}

    private animateCountUp(target: ILandingStats): void {
  const steps = 60;
  const duration = 2000;
  const stepDuration = duration / steps;
  let current = 0;

  const timer = setInterval(() => {
    current++;
    const progress = current / steps;
    const ease = 1 - Math.pow(1 - progress, 3);

    this.animatedStats.set({
      totalEvents: Math.round(target.totalEvents * ease),
      totalAttendees: Math.round(target.totalAttendees * ease),
      totalOrganizers: Math.round(target.totalOrganizers * ease),
      totalCities: Math.round(target.totalCities * ease),
      upcomingEvents: Math.round(target.upcomingEvents * ease),
      totalRsvps: Math.round(target.totalRsvps * ease)
    });

    if (current >= steps) clearInterval(timer);
  }, stepDuration);
}

scrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
}