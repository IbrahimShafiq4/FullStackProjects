import { Service, signal, WritableSignal } from '@angular/core';

export type TPopupConfig = 'confirm' | 'info' | 'danger';

export interface IPopupConfig {
    title           : string;
    message         : string;
    type            : TPopupConfig;
    confirmLabel?   : string;
    cancelLabel?    : string;
}

@Service()
export class PopupService {
    config: WritableSignal<IPopupConfig | null> = signal<IPopupConfig | null>(null);
    private resolver: ((confirmed: boolean) => void) | null = null;

    confirm(config: Omit<IPopupConfig, 'type'> & { type?: IPopupConfig['type'] }): Promise<boolean> {
        this.config.set({ type: 'confirm', ...config })
        return new Promise<boolean>(
            (resolve: (value: boolean | PromiseLike<boolean>) => void) => {
                this.resolver = resolve;
            }
        );
    }

    respond(confirmed: boolean): void {
        this.resolver?.(confirmed);
        this.config.set(null);
        this.resolver = null;
    }
}
