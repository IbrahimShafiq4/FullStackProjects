import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const initializeAuth = async (): Promise<void> => {
    const authService = inject(AuthService);
    await firstValueFrom(authService.loadCurrentUser());
};