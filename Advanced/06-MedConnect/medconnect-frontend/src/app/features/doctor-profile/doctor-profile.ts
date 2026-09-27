import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DoctorProfileService, IDoctorProfile } from '../../doctor-profile.service';

@Component({
  selector: 'app-doctor-profile',
  imports: [RouterLink],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfilePage implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _profileService = inject(DoctorProfileService);
  readonly _auth = inject(AuthService);

  profile = signal<IDoctorProfile | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this._profileService.getProfile(id).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  photoUrl(): string {
    const url = this.profile()?.photoUrl ?? '';
    return this._profileService.resolveUrl(url);
  }
}