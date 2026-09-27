import { Injectable, signal, WritableSignal } from '@angular/core';

export type TPopupType = 'confirm' | 'info' | 'danger';

export interface IPopupConfig {
    title: string;
    message: string;
    type: TPopupType;
    confirmLabel?: string;
    cancelLabel?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    public config: WritableSignal<IPopupConfig | null> =
        signal<IPopupConfig | null>(null);

    private resolver: ((confirmed: boolean) => void) | null = null;

    confirm(
        config: Omit<IPopupConfig, 'type'>
    ): Promise<boolean> {
        this.config.set({
            type: 'confirm',
            ...config
        });

        return new Promise((resolver) => {
            this.resolver = resolver;
        });
    }

    respond(confirmed: boolean): void {
        this.resolver?.(confirmed);

        this.config.set(null);

        this.resolver = null;
    }
}