import { effect, Service, signal, WritableSignal } from '@angular/core';

@Service()
export class ThemeService {
    isDark: WritableSignal<boolean> = signal<boolean>(localStorage.getItem('theme') === 'dark')

    constructor() {
        effect(() => {
            document.documentElement.classList.toggle('dark', this.isDark());
            localStorage.setItem('them', this.isDark() ? 'dark' : 'light');
        })
    }

    toggle() { this.isDark.update((v) => !v); }
}
