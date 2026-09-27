import { Injectable, signal, WritableSignal } from '@angular/core';

export type TType = 'success' | 'error' | 'info';
export interface IToast {
    id: number;
    message: string;
    type: TType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts: WritableSignal<IToast[]> = signal<IToast[]>([]);
    private nextId: number = 0;

    show(message: string, type: IToast['type'] = 'info', duration = 3000) {
        const id = this.nextId++;
        this.toasts.update((list: IToast[]) => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number) {
        this.toasts.update((list: IToast[]) => list.filter((t) => t.id !== id));
    }
}