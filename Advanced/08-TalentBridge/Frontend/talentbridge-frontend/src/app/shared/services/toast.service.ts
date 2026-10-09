import { Injectable, signal } from '@angular/core';

export type ToastType = 'info' | 'success' | 'error';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private _toasts = signal<Toast[]>([]);
    readonly toasts = this._toasts.asReadonly();

    private seq = 0;

    show(message: string, type: ToastType = 'info', durationMs = 4200): void {
        const id = ++this.seq;
        this._toasts.update((list) => [...list, { id, message, type }]);
        if (durationMs > 0) {
            setTimeout(() => this.dismiss(id), durationMs);
        }
    }

    dismiss(id: number): void {
        this._toasts.update((list) => list.filter((t) => t.id !== id));
    }
}