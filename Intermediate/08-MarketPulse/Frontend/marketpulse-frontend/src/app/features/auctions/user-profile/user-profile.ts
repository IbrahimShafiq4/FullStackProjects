import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionsService } from '../../../core/services/auctions.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.html',
    styleUrl: './user-profile.css'
})
export class UserProfileComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private auctions = inject(AuctionsService);
    private toast = inject(ToastService);

    user = signal<any>(null);
    loading = signal(true);
    uploading = signal(false);
    selected: File | null = null;

    ngOnInit() {
        const userId = this.route.snapshot.paramMap.get('id');
        if (userId) {
            this.auctions.profile(userId).subscribe({
                next: d => { this.user.set(d); this.loading.set(false); },
                error: () => {
                    this.loading.set(false);
                    this.toast.show('تعذر تحميل الملف الشخصي', 'error');
                }
            });
        }
    }

    onFile(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) this.selected = input.files[0];
    }

    upload() {
        if (!this.selected || this.uploading()) return;
        this.uploading.set(true);

        this.auctions.uploadAvatar(this.selected).subscribe({
            next: (res) => {
                this.toast.show('تم تحديث الصورة', 'success');
                this.user.update(u => ({ ...u, avatarUrl: res.url }));
                this.uploading.set(false);
                this.selected = null;
            },
            error: () => {
                this.uploading.set(false);
                this.toast.show('فشل رفع الصورة', 'error');
            }
        });
    }
}