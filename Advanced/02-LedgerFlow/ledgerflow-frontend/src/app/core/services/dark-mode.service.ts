import { effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DarkModeService {
    private readonly STORAGE_KEY = 'darkMode';
    isDark = signal<boolean>(this.loadInitial());

    constructor() {
        effect(() => {
            const dark = this.isDark();
            document.documentElement.classList.toggle('dark', dark);
            localStorage.setItem(this.STORAGE_KEY, String(dark));
        });
    }

    toggle() { this.isDark.update(d => !d); }

    private loadInitial(): boolean {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored !== null) return stored === 'true';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}