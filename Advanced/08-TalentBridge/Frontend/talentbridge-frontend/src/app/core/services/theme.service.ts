import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private _isDark = signal<boolean>(
        (localStorage.getItem('theme') ?? '') === 'dark'
    );
    readonly isDark = this._isDark.asReadonly();

    constructor() {
        effect(() => {
            const dark = this._isDark();
            document.documentElement.classList.toggle('dark', dark);
            localStorage.setItem('theme', dark ? 'dark' : 'light');
        });
    }

    toggle(): void {
        this._isDark.update((v) => !v);
    }
}