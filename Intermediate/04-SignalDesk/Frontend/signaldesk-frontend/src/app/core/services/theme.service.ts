import { Service, signal, effect } from '@angular/core';

export type NotebookTheme = 'classic' | 'blue' | 'red' | 'green' | 'vintage' | 'night';

@Service()
export class ThemeService {
    themes: { id: NotebookTheme; label: string }[] = [
        { id: 'blue', label: 'أزرق' },
        { id: 'classic', label: 'كلاسيكي' },
        { id: 'red', label: 'أحمر' },
        { id: 'green', label: 'أخضر' },
        { id: 'vintage', label: 'قديم' },
        { id: 'night', label: 'مذاكرة ليلية' },
    ];

    theme = signal<NotebookTheme>('classic');

    constructor() {
        const saved = localStorage.getItem('notebook-theme') as NotebookTheme | null;
        if (saved) this.theme.set(saved);

        effect(() => {
            const t = this.theme();
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem('notebook-theme', t);
        });
    }

    set(t: NotebookTheme) {
        this.theme.set(t);
    }
}