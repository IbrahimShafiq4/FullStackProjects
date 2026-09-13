import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LandingService, IGeneralStats, IPublicTransaction } from './landing.service';

@Component({
    selector: 'app-landing',
    imports: [RouterLink, DecimalPipe, DatePipe],
    templateUrl: './landing.html'
})
export class Landing implements OnInit {
    private landingService = inject(LandingService);

    stats: WritableSignal<IGeneralStats | null> = signal<IGeneralStats | null>(null);
    recentTransactions: WritableSignal<IPublicTransaction[]> = signal<IPublicTransaction[]>([]);

    ngOnInit(): void {
        this.landingService.getStats().subscribe({
            next: (data) => this.stats.set(data)
        });
        this.landingService.getRecentTransactions(5).subscribe({
            next: (data) => this.recentTransactions.set(data)
        });
    }
}