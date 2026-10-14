import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AuctionsService } from '../../../core/services/auctions.service';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    imports: [FormsModule, FormField, RouterLink, RevealOnScrollDirective, CurrencyPipe],
    selector: 'app-auction-list',
    templateUrl: './auction-list.html',
    styleUrl: './auction-list.css'
})
export class AuctionList implements OnInit {
    auctions = inject(AuctionsService);
    private toast = inject(ToastService);

    formModel = signal({ title: '', startingPrice: 0, durationMinutes: 60 });
    auctionForm = form(this.formModel, () => { });

    selectedFiles = signal<File[]>([]);
    showCreate = signal(false);
    creating = signal(false);

    ngOnInit() {
        this.auctions.load();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.selectedFiles.set(Array.from(input.files).slice(0, 6));
        }
    }

    onCreateAuction() {
        const { title, startingPrice, durationMinutes } = this.formModel();

        if (!title.trim() || startingPrice <= 0 || durationMinutes <= 0) {
            this.toast.show('راجع البيانات', 'error');
            return;
        }

        const fd = new FormData();
        fd.append('title', title);
        fd.append('startingPrice', String(startingPrice));
        fd.append('durationMinutes', String(durationMinutes));
        this.selectedFiles().forEach(f => fd.append('mediaFiles', f));

        this.creating.set(true);
        this.auctions.create(fd).subscribe({
            next: () => {
                this.toast.show('تم إنشاء المزاد', 'success');
                this.formModel.set({ title: '', startingPrice: 0, durationMinutes: 60 });
                this.selectedFiles.set([]);
                this.showCreate.set(false);
                this.creating.set(false);
                this.auctions.load();
            },
            error: (err) => {
                this.creating.set(false);
                this.toast.show(err?.error?.message ?? 'تعذر إنشاء المزاد', 'error');
            }
        });
    }
}