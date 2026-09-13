import { Service, signal } from '@angular/core';

export interface PopupConfig {
    title: string; message: string; type: 'confirm' | 'info' | 'danger';
    confirmLabel?: string; cancelLabel?: string;
}

@Service()
export class PopupService {
    config = signal<PopupConfig | null>(null);
    private resolver: ((confirmed: boolean) => void) | null = null;

    confirm(config: Omit<PopupConfig, 'type'> & { type?: PopupConfig['type'] }): Promise<boolean> {
        this.config.set({ type: 'confirm', ...config });
        return new Promise((resolve) => { this.resolver = resolve; });
    }

    respond(confirmed: boolean) {
        this.resolver?.(confirmed);
        this.config.set(null);
        this.resolver = null;
    }
}