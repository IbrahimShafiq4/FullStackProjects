import { Service, signal, WritableSignal } from '@angular/core';

export type IToastType = 'success' | 'error' | 'info';

export interface IToast {
    id      : number;
    message : string;
    type    : IToastType;
}

@Service()
export class Toast {
    toasts: WritableSignal<IToast[]> = signal<IToast[]>([])

    private nextId = 0;

    show(message: string, type: IToast['type'] = 'info', duration = 3000) {
        const id = this.nextId++;
        this.toasts.update((list) => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number) {
        this.toasts.update((list) => list.filter((t) => t.id != id));
    }
}
