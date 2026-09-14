import { Service, signal, WritableSignal } from '@angular/core';

export interface IConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    tone?: 'default' | 'danger' | 'olive';
}

interface IConfirmState {
    options: IConfirmOptions;
    resolve: (value: boolean) => void;
}

@Service()
export class ConfirmService {
    private readonly defaultOptions: Required<IConfirmOptions> = {
        title: 'تأكيد',
        message: 'متأكد؟',
        confirmText: 'تأكيد',
        cancelText: 'إلغاء',
        tone: 'default'
    };

    active: WritableSignal<IConfirmOptions | null> = signal<IConfirmOptions | null>(null);

    private currentResolve: ((value: boolean) => void) | null = null;

    open(options: IConfirmOptions): Promise<boolean> {
        if (this.currentResolve) {
            this.currentResolve(false);
        }

        const merged: IConfirmOptions = {
            ...this.defaultOptions,
            ...options
        };

        this.active.set(merged);

        return new Promise<boolean>((resolve) => {
            this.currentResolve = resolve;
        });
    }

    confirm(): void {
        if (this.currentResolve) {
            this.currentResolve(true);
            this.currentResolve = null;
        }
        this.active.set(null);
    }

    cancel(): void {
        if (this.currentResolve) {
            this.currentResolve(false);
            this.currentResolve = null;
        }
        this.active.set(null);
    }
}