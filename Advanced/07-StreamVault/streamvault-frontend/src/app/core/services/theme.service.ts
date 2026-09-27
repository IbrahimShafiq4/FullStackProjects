import { Service, signal, effect, WritableSignal } from '@angular/core';

@Service()
export class ThemeService {
    public isDark: WritableSignal<boolean> = signal<boolean>(
        localStorage.getItem('theme') === 'dark'
        || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    constructor() {
        effect(() => {
            document.documentElement.classList.toggle('dark', this.isDark());
            localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
        });
    }

    public toggle(): void {
        this.isDark.update((value: boolean) => !value);
    }
}