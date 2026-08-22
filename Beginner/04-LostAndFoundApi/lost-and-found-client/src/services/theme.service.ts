import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    isDarkMode = signal<boolean>(this.getInitialTheme());

    constructor() {
        effect(() => {
            const isDark = this.isDarkMode();
            document.documentElement.classList.toggle('dark', isDark);
            document.cookie = `theme=${isDark ? 'dark' : 'light'}; path=/; max-age=31536000`;
        });
    }

    toggle(): void {
        this.isDarkMode.update(current => !current);
    }

    private getInitialTheme(): boolean {
        const match = document.cookie.match(/theme=(dark|light)/);
        if (match) return match[1] === 'dark';

        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}