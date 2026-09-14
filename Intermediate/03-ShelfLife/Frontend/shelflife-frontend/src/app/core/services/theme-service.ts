import { Service, signal, effect } from '@angular/core';

export type TTheme = 'light' | 'dark';

@Service()
export class ThemeService {
    isDark = signal<boolean>(this.getInitialTheme());

    constructor() {
        effect(() => {
            const dark = this.isDark();
            const theme: TTheme = dark ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.style.colorScheme = theme;
            localStorage.setItem('shelflife-theme', theme);
        });

        this.listenToSystemPreference();
    }

    private getInitialTheme(): boolean {
        const saved = localStorage.getItem('shelflife-theme');

        if (saved === 'dark') return true;
        if (saved === 'light') return false;

        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    private listenToSystemPreference(): void {
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        media.addEventListener('change', (e) => {
            const saved = localStorage.getItem('shelflife-theme');
            if (!saved) this.isDark.set(e.matches);
        });
    }

    toggle(): void {
        this.isDark.update(v => !v);
    }
}