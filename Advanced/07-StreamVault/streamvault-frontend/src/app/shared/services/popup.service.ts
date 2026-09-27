import { Service, signal, WritableSignal } from '@angular/core';

export type PopupType = 'confirm' | 'info' | 'danger';

export interface IPopupConfig {
    title: string;
    message: string;
    type: PopupType;
    confirmLabel?: string;
    cancelLabel?: string;
}

@Service()
export class PopupService {
    public config: WritableSignal<IPopupConfig | null> = signal<IPopupConfig | null>(null);
    private _Resolver: ((confirmed: boolean) => void) | null = null;

    public confirm(config: Omit<IPopupConfig, 'type'> & { type?: PopupType }): Promise<boolean> {
        this.config.set({ type: 'confirm', ...config });
        return new Promise<boolean>((resolve) => (this._Resolver = resolve));
    }

    public respond(confirmed: boolean): void {
        this._Resolver?.(confirmed);
        this.config.set(null);
        this._Resolver = null;
    }
}