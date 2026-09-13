import { Service, signal, WritableSignal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'error';

export interface IToast {
    id: number;
    message: string;
    type: ToastType;
}

@Service()
export class ToastService {
    toasts: WritableSignal<IToast[]> = signal<IToast[]>([]);
    private nextId = 0;
    show(message: string, type: IToast['type'] = 'info', duration = 3000) {
        const id = this.nextId++;
        this.toasts.update((list) => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number): void {
        this.toasts.update((list: IToast[]) => list.filter((t) => t.id !== id));
    }
}
