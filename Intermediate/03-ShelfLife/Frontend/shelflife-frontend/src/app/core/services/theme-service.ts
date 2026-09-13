import { Service, signal, effect } from '@angular/core';

@Service()
export class ThemeService {
    isDark = signal<boolean>(localStorage.getItem('theme') === 'dark');

    constructor() {
        effect(() => {
            document.documentElement.classList.toggle('dark', this.isDark());
            localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
        });
    }

    toggle() { this.isDark.update((v) => !v); }
}