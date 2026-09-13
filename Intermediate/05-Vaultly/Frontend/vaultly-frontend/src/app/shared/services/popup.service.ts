import { Service, signal, WritableSignal } from '@angular/core';

export type TPopupType = 'confirm' | 'info' | 'danger';

export interface IPopupConfig {
    title: string;
    message: string;
    type: TPopupType,
    confirmLabels?: string;
    cancelLabels?: string;
}

@Service()
export class PopupService {
    config: WritableSignal<IPopupConfig | null> = signal<IPopupConfig | null>(null);
    private resolver: ((confirmed: boolean) => void) | null = null;

    confirm(config: Omit<IPopupConfig, 'type'> & { type?: IPopupConfig['type'] }): Promise<boolean> {
        this.config.set({ type: 'confirm', ...config });

        return new Promise((resolver) => {
            this.resolver = resolver;
        })
    }

    respond(confirmed: boolean) {
        this.resolver?.(confirmed);
        this.config.set(null);
        this.resolver = null;
    }
}
