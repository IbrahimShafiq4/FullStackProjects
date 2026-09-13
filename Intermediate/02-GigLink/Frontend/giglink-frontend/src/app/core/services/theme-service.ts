import { Service, signal, WritableSignal } from '@angular/core';

@Service()
export class ThemeService {
    isDark: WritableSignal<boolean> = signal<boolean>(false);

    toggle() {
        this.isDark.update((v) => !v);
    }
}