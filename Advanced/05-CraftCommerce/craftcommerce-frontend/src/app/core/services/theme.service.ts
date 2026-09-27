import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal, WritableSignal } from '@angular/core';

export type TTheme = 'light' | 'dark';

@Service()
export class ThemeService {
    private readonly _doc = inject(DOCUMENT);
    private readonly STORAGE_KEY = 'craftcommerce-theme';

    public currentTheme: WritableSignal<TTheme> = signal<TTheme>(this.resolveInitial());

    constructor() {
        effect(() => this.apply(this.currentTheme()));
    }

    toggle(): void { this.currentTheme.set(this.currentTheme() === 'light' ? 'dark' : 'light'); }
    set(theme: TTheme): void { this.currentTheme.set(theme); }

    private resolveInitial(): TTheme {
        const stored = localStorage.getItem(this.STORAGE_KEY) as TTheme | null;
        if (stored === 'light' || stored === 'dark') return stored;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    private apply(theme: TTheme): void {
        const root = this._doc.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem(this.STORAGE_KEY, theme);
    }
}