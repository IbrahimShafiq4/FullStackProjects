import { effect, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    isDark: WritableSignal<boolean> = signal<boolean>(
        (localStorage.getItem('theme') ?? 'dark') === 'dark',
    );

    constructor() {
        effect(() => {
            const dark = this.isDark();
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
            localStorage.setItem('theme', dark ? 'dark' : 'light');
        });
    }

    toggle(): void {
        this.isDark.update((v) => !v);
    }
}