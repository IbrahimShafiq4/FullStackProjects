import { Injectable, signal, WritableSignal } from '@angular/core';

export type TType = 'success' | 'info' | 'error';

export interface IToast {
    id: number;
    message: string;
    type: TType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts: WritableSignal<IToast[]> = signal<IToast[]>([]);
    private nextId = 0;

    show(message: string, type: TType = 'info', duration = 3400): void {
        const id = this.nextId++;
        this.toasts.update((t) => [...t, { id, message, type }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number): void {
        this.toasts.update((t) => t.filter((x) => x.id !== id));
    }
}