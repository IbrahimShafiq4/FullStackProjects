import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

@Service()
export class ThemeService {
    private doc = inject(DOCUMENT);

    isDark = signal<boolean>(this.readInitial());

    constructor() {
        this.apply(this.isDark());

        effect(() => {
            const dark = this.isDark();
            this.apply(dark);
            localStorage.setItem('theme', dark ? 'dark' : 'light');
        });
    }

    toggle() {
        this.isDark.update(v => !v);
    }

    private apply(dark: boolean) {
        const html = this.doc.documentElement;
        html.classList.toggle('dark', dark);
        html.style.colorScheme = dark ? 'dark' : 'light';
    }

    private readInitial(): boolean {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') return true;
        if (stored === 'light') return false;
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
    }
}