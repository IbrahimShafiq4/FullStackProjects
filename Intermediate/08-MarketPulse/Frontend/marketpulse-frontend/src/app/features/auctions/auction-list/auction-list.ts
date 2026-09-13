import { Component, inject, signal } from '@angular/core';
import { AuctionsService } from '../../../core/services/auctions.service';
import { ToastService } from '../../../shared/services/toast.service';
import { form, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { RevealOnScrollDirective } from "../../../shared/directives/reveal-on-scroll.directive";
import { CurrencyPipe } from '@angular/common';

@Component({
    imports: [FormsModule, FormField, RouterLink, RevealOnScrollDirective, CurrencyPipe],
    selector: 'app-auction-list',
    templateUrl: './auction-list.html',
})
export class AuctionList {
    _AuctionsService = inject(AuctionsService);
    private _ToastService = inject(ToastService);

    fromModel = signal({ title: '', startingPrice: 0, durationMinutes: 60 });
    auctionForm = form(this.fromModel, () => {});
    selectedFiles = signal<File[]>([]);

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.selectedFiles.set(Array.from(input.files));
        }
    }

    onCreateAuction() {
        const { title, startingPrice, durationMinutes } = this.fromModel();
        if (!title.trim() || startingPrice <= 0) {
            this._ToastService.show('املأ البيانات بشكل صحيح', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('startingPrice', startingPrice.toString());
        formData.append('durationMinutes', durationMinutes.toString());
        this.selectedFiles().forEach(file => formData.append('mediaFiles', file));

        this._AuctionsService.createAuction(formData).subscribe({
            next: () => {
                this._ToastService.show('تم إنشاء المزاد', 'success');
                this.fromModel.set({ title: '', startingPrice: 0, durationMinutes: 60 });
                this.selectedFiles.set([]);
                this._AuctionsService.loadAuctions();
            },
            error: () => this._ToastService.show('حدث خطأ', 'error'),
        });
    }
}