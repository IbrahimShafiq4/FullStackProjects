import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile',
    imports: [RouterLink],
    templateUrl: './profile.html'
})
export class Profile {
    public authService = inject(AuthService);
}