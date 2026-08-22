import { effect, Service, signal, WritableSignal } from '@angular/core';

@Service()
export class Theme {
    isDark: WritableSignal<boolean> = signal<boolean>(localStorage.getItem('theme') === 'dark');

    constructor() {
        effect(() => {
            document.documentElement.classList.toggle('dark', this.isDark());
            localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
        })
    }

    toggle(): void { this.isDark.update(v => !v); }
}
