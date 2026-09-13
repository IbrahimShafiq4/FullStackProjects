import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionsService } from '../../../core/services/auctions.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.html',
})
export class UserProfileComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private auctionsService = inject(AuctionsService);
    private toast = inject(ToastService);

    user = signal<any>(null);
    selectedAvatar: File | null = null;

    ngOnInit() {
        const userId = this.route.snapshot.paramMap.get('id');
        if (userId) {
            this.auctionsService.getUserProfile(userId).subscribe({
                next: (data) => this.user.set(data),
                error: () => this.toast.show('تعذر تحميل الملف الشخصي', 'error'),
            });
        }
    }

    onAvatarSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.selectedAvatar = input.files[0];
        }
    }

    uploadAvatar() {
        if (!this.selectedAvatar) return;
        this.auctionsService.uploadAvatar(this.selectedAvatar).subscribe({
            next: (res) => {
                this.toast.show('تم تحديث الصورة', 'success');
                this.user.update(u => ({ ...u, avatarUrl: res.url }));
            },
            error: () => this.toast.show('فشل رفع الصورة', 'error'),
        });
    }
}