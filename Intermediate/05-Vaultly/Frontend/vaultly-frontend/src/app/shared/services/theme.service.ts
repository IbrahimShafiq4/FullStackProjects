import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    effect, inject, Injectable, PLATFORM_ID, signal, WritableSignal
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private doc = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    readonly isDark: WritableSignal<boolean> = signal<boolean>(this.readInitial());

    constructor() {
        effect(() => {
            const dark = this.isDark();
            if (!this.isBrowser) return;

            const html = this.doc.documentElement;
            html.classList.toggle('dark', dark);
            html.style.colorScheme = dark ? 'dark' : 'light';

            try {
                localStorage.setItem('theme', dark ? 'dark' : 'light');
            } catch { }
        });
    }

    toggle(): void {
        this.isDark.update(v => !v);
    }

    setDark(value: boolean): void {
        this.isDark.set(value);
    }

    private readInitial(): boolean {
        if (!this.isBrowser) return false;
        try {
            const stored = localStorage.getItem('theme');
            if (stored) return stored === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch {
            return false;
        }
    }
}