import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    readonly theme = signal<Theme>(this.initial());

    constructor() {
        effect(() => {
            const t = this.theme();
            document.documentElement.classList.toggle('dark', t === 'dark');
            localStorage.setItem('ch_theme', t);
        });
    }

    toggle(): void {
        this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
    }

    private initial(): Theme {
        const saved = localStorage.getItem('ch_theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}